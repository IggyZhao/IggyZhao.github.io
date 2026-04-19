// Dotted-world map with uniform dots, click-to-reveal panel showing papers at each city.
const { useState, useMemo, useEffect, useRef } = React;

function project(lat, lng, w, h) {
  const x = (lng + 180) * (w / 360);
  const y = (90 - lat) * (h / 180);
  return [x, y];
}

function MapSection() {
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("conference"); // conference | invited
  const [mapSvg, setMapSvg] = useState("");
  const [openRows, setOpenRows] = useState(new Set());
  const toggleRow = (i) => setOpenRows(s => {
    const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n;
  });
  const W = 2000, H = 1000;

  // Desktop = show 3D globe; mobile/tablet = keep flat SVG map.
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" && window.matchMedia &&
    window.matchMedia("(min-width: 900px)").matches
  );
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(min-width: 900px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener ? mq.addEventListener("change", handler) : mq.addListener(handler);
    return () => {
      mq.removeEventListener ? mq.removeEventListener("change", handler) : mq.removeListener(handler);
    };
  }, []);

  // Lazy-load globe.gl only on desktop.
  const [globeReady, setGlobeReady] = useState(typeof window !== "undefined" && !!window.Globe);
  useEffect(() => {
    if (!isDesktop || globeReady) return;
    if (window.Globe) { setGlobeReady(true); return; }
    if (!document.getElementById("globe-gl-script")) {
      const s = document.createElement("script");
      s.id = "globe-gl-script";
      s.src = "https://unpkg.com/globe.gl@2";
      s.async = true;
      document.head.appendChild(s);
    }
    const iv = setInterval(() => {
      if (window.Globe) { setGlobeReady(true); clearInterval(iv); }
    }, 150);
    const to = setTimeout(() => clearInterval(iv), 12000);
    return () => { clearInterval(iv); clearTimeout(to); };
  }, [isDesktop, globeReady]);

  useEffect(() => {
    fetch("assets/dotted-world.svg").then(r => r.text()).then(raw => {
      // Crop polar areas and inflate dot radius + add the paper-cut filter defs.
      let svg = raw
        .replace(/<svg([^>]*?)\s+viewBox="[^"]*"/, '<svg$1 viewBox="0 110 2000 680"')
        .replace(/<svg([^>]*?)\s+preserveAspectRatio="[^"]*"/, '<svg$1')
        .replace(/<svg\b/, '<svg preserveAspectRatio="xMidYMid slice"')
        // Keep original dot radius (2.8) for crisp dotted-map look
        // Inject filter defs after <svg ...>
        .replace(/(<svg[^>]*>)/, `$1
          <defs></defs>
        `);
      setMapSvg(svg);
    }).catch(() => {});
  }, []);

  const appearances = useMemo(() => {
    const conf = window.CV.presentations.map(p => ({
      kind: "conference",
      date: p.date, venue: p.venue, city: p.city, lat: p.lat, lng: p.lng,
      title: p.title, authors: p.authors,
    }));
    const cityCoords = {};
    window.CV.presentations.forEach(p => { cityCoords[p.city] = [p.lat, p.lng]; });
    const invitedCoords = {
      "Philadelphia, PA": [39.95, -75.17],
      "Hoboken, NJ": [40.74, -74.03],
      "Miami, FL": [25.76, -80.19],
      "Atlanta, GA": [33.75, -84.39],
      "Bethlehem, PA": [40.62, -75.37],
      "Virtual": [null, null],
    };
    const inv = window.CV.invitedTalks.map(t => {
      const c = invitedCoords[t.city] || cityCoords[t.city] || [null, null];
      const [_, mm, yyyy] = t.date.match(/(\d+)\/(\d+)/) || [null, "01", "0000"];
      return {
        kind: "invited",
        date: `${yyyy}-${mm}`,
        displayDate: t.date,
        venue: t.venue, city: t.city, lat: c[0], lng: c[1],
      };
    });
    return [...conf, ...inv].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, []);

  const cities = useMemo(() => {
    const m = new Map();
    appearances.forEach(a => {
      if (a.lat == null) return;
      if (!m.has(a.city)) m.set(a.city, { city: a.city, lat: a.lat, lng: a.lng, items: [] });
      m.get(a.city).items.push(a);
    });
    return Array.from(m.values()).sort((a, b) => b.items.length - a.items.length);
  }, [appearances]);

  const papers = useMemo(() => {
    const m = {};
    [...window.CV.workingPapers, ...window.CV.inProgress, ...window.CV.published].forEach(p => { m[p.id] = p; });
    return m;
  }, []);

  // Do NOT auto-select on load — panel is hidden until user clicks a dot.

  const activeCity = cities.find(c => c.city === active);
  const filtered = appearances.filter(a => a.kind === filter);

  // For conferences, group by venue+month+city so repeat talks at the same event collapse into one row
  const conferenceGroups = useMemo(() => {
    const groups = [];
    const idx = new Map();
    appearances.filter(a => a.kind === "conference").forEach(a => {
      const key = `${a.venue}||${a.date}||${a.city}`;
      if (!idx.has(key)) {
        idx.set(key, groups.length);
        groups.push({ venue: a.venue, date: a.date, displayDate: a.displayDate || a.date, city: a.city, kind: "conference", talks: [] });
      }
      groups[idx.get(key)].talks.push(a);
    });
    return groups;
  }, [appearances]);

  const invitedRows = useMemo(() => appearances.filter(a => a.kind === "invited"), [appearances]);

  return (
    <section className="map-section" id="map">
      <div className="section-head reveal">
        <div className="section-num">(03) — Appearances</div>
        <h2 className="section-title">Where the <em>work</em> has travelled.</h2>
      </div>

      <div className={`map-layout reveal ${isDesktop && globeReady ? "has-globe" : ""}`}>
        <div className={`map-wrap ${isDesktop && globeReady ? "has-globe" : ""}`}>
          {isDesktop && globeReady ? (
            <GlobeView cities={cities} active={active} onSelect={setActive} />
          ) : (<>
          <div className="map-bg" dangerouslySetInnerHTML={{__html: mapSvg}}/>
          <svg className="map-overlay" viewBox="0 110 2000 680" preserveAspectRatio="xMidYMid slice">
            {/* Latitude guide lines (equator ≈ y500, tropics ±23.5° ≈ y370 & y630) */}
            <g className="map-guides-g">
              <line x1="0" x2="2000" y1="500" y2="500" className="guide equator"/>
              <line x1="0" x2="2000" y1="370" y2="370" className="guide"/>
              <line x1="0" x2="2000" y1="630" y2="630" className="guide"/>
            </g>
            {/* Default faint connection web between every city pair */}
            {!activeCity && (() => {
              const links = [];
              for (let i = 0; i < cities.length; i++) {
                for (let j = i + 1; j < cities.length; j++) {
                  const [x1, y1] = project(cities[i].lat, cities[i].lng, W, H);
                  const [x2, y2] = project(cities[j].lat, cities[j].lng, W, H);
                  const mx = (x1 + x2) / 2;
                  const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.15;
                  links.push(
                    <path key={`web-${i}-${j}`} className="map-web"
                          d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}/>
                  );
                }
              }
              return <g className="map-web-g">{links}</g>;
            })()}
            {/* Connecting lines from active city to other cities */}
            {activeCity && cities.filter(c => c.city !== active).map((c, i) => {
              const [x1, y1] = project(activeCity.lat, activeCity.lng, W, H);
              const [x2, y2] = project(c.lat, c.lng, W, H);
              const mx = (x1 + x2) / 2;
              const my = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.15;
              return (
                <path key={`l-${i}`} className="map-link"
                      d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                      style={{ animationDelay: `${i * 60}ms` }}/>
              );
            })}
            {/* Uniform city dots */}
            {cities.map((c, i) => {
              const [x, y] = project(c.lat, c.lng, W, H);
              const isActive = active === c.city;
              return (
                <g key={i} className={`map-dot ${isActive?"active":""}`}
                   transform={`translate(${x} ${y})`}
                   onClick={() => setActive(c.city)}>
                  <circle className="map-pulse" r="22"/>
                  <circle className="map-pulse delay" r="22"/>
                  <circle className="map-hit" r="18"/>
                  <circle className="map-ring" r="10"/>
                  <circle className="map-core" r="5"/>
                  <text className="map-label" y="-18">{c.city.split(",")[0]}</text>
                </g>
              );
            })}
          </svg>
          </>)}
        </div>

        {/* Detail panel — only mounted when a city is active */}
        {activeCity && (() => {
          // Group items at this city by conference (venue + date)
          const groups = [];
          const idx = new Map();
          activeCity.items.forEach(a => {
            const key = `${a.venue}||${a.date}`;
            if (!idx.has(key)) { idx.set(key, groups.length); groups.push({ venue: a.venue, date: a.displayDate || a.date, kind: a.kind, talks: [] }); }
            groups[idx.get(key)].talks.push(a);
          });
          const totalTalks = activeCity.items.length;
          return (
            <aside className="map-detail">
              <button className="md-close" onClick={() => setActive(null)} aria-label="Close">×</button>
              <div className="md-header">
                <div className="md-eyebrow">
                  {groups.length} {groups.length === 1 ? "event" : "events"} · {totalTalks} {totalTalks === 1 ? "talk" : "talks"}
                </div>
                <h3 className="md-city">{activeCity.city}</h3>
              </div>
              <ol className="md-items">
                {groups.map((g, i) => (
                  <li key={i} className={`md-item ${g.kind}`}>
                    <div className="md-meta">
                      <span className="md-kind">{g.kind === "invited" ? "Invited Talk" : "Conference"}</span>
                      <span className="md-date">{g.date}</span>
                    </div>
                    <div className="md-venue">{g.venue}</div>
                    {g.talks.some(t => t.title) && (
                      <ul className="md-talks">
                        {g.talks.map((t, j) => (
                          <li key={j} className="md-talk">
                            {t.title && <div className="md-title">“{t.title}”</div>}
                            {t.authors && <div className="md-authors">{t.authors}</div>}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </aside>
          );
        })()}
      </div>

      {/* Unified list of appearances */}
      <div className="appearances reveal">
        <div className="app-filters">
          <div className="app-label">Appearances · {appearances.length} total</div>
          <div className="app-tabs">
            {["conference","invited"].map(k => (
              <button key={k} className={filter===k?"active":""} onClick={() => setFilter(k)}>
                {k === "conference" ? "Conference" : "Invited"}
                <span>·</span>
                {k === "conference" ? conferenceGroups.length : invitedRows.length}
              </button>
            ))}
          </div>
        </div>

        <ol className="app-list">
          {filter === "conference"
            ? conferenceGroups.map((g, i) => {
                const isOpen = openRows.has(`conf-${i}`);
                const count = g.talks.length;
                return (
                  <li
                    key={i}
                    className={`app-row conference clickable ${isOpen ? "open" : ""}`}
                    onClick={() => toggleRow(`conf-${i}`)}
                  >
                    <div className="app-date">{g.displayDate}</div>
                    <div className="app-kind">Conf</div>
                    <div className="app-venue">
                      <div className="v-main">
                        {g.venue}
                        {count > 1 && <span className="v-multi"> (×{count})</span>}
                      </div>
                      <div className="v-detail">
                        {g.talks.map((t, j) => (
                          <div key={j} className="v-talk">
                            {t.title && <div className="v-paper">“{t.title}”</div>}
                            {t.authors && <div className="v-meta">{t.authors}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="app-city">{g.city}</div>
                    <div className="app-expand">+</div>
                  </li>
                );
              })
            : invitedRows.map((a, i) => {
                const hasDetail = !!(a.title || a.authors);
                const isOpen = openRows.has(`inv-${i}`);
                return (
                  <li
                    key={i}
                    className={`app-row invited ${hasDetail ? "clickable" : ""} ${isOpen ? "open" : ""}`}
                    onClick={() => hasDetail && toggleRow(`inv-${i}`)}
                  >
                    <div className="app-date">{a.displayDate || a.date}</div>
                    <div className="app-kind">Invited</div>
                    <div className="app-venue">
                      <div className="v-main">{a.venue}</div>
                      {hasDetail && (
                        <div className="v-detail">
                          {a.title && <div className="v-paper">“{a.title}”</div>}
                          {a.authors && <div className="v-meta">{a.authors}</div>}
                        </div>
                      )}
                    </div>
                    <div className="app-city">{a.city}</div>
                    {hasDetail && <div className="app-expand">+</div>}
                  </li>
                );
              })}
        </ol>
      </div>
    </section>
  );
}

// 3D globe view — globe.gl (Three.js) + hex-dotted land to echo the flat map's aesthetic.
function GlobeView({ cities, active, onSelect }) {
  const mountRef = useRef(null);
  const worldRef = useRef(null);

  useEffect(() => {
    if (!window.Globe || !mountRef.current) return;
    const el = mountRef.current;

    const HOME = { lat: 25.76, lng: -80.19 }; // Miami
    const arcs = cities
      .filter(c => !(Math.abs(c.lat - HOME.lat) < 0.5 && Math.abs(c.lng - HOME.lng) < 0.5))
      .map(c => ({ startLat: HOME.lat, startLng: HOME.lng, endLat: c.lat, endLng: c.lng }));

    const world = window.Globe()(el)
      .backgroundColor("rgba(0,0,0,0)")
      .showAtmosphere(true)
      .atmosphereColor("#B8743A")
      .atmosphereAltitude(0.16)
      .pointsData(cities)
      .pointLat(d => d.lat)
      .pointLng(d => d.lng)
      .pointColor(d => (d.city === active ? "#B8743A" : "#A85643"))
      .pointAltitude(0.008)
      .pointRadius(0.6)
      .pointLabel(d =>
        `<div style="font:500 10px/1 'JetBrains Mono',ui-monospace,monospace;`+
        `padding:7px 11px;background:#F4EFE6;color:#141210;letter-spacing:.14em;`+
        `text-transform:uppercase;border:1px solid rgba(20,18,16,0.14);`+
        `box-shadow:0 8px 22px rgba(20,18,16,0.18);">`+
        `${d.city.split(",")[0]} · ${d.items.length} ${d.items.length===1?"talk":"talks"}</div>`
      )
      .onPointClick(p => onSelect(p.city))
      .arcsData(arcs)
      .arcStartLat(d => d.startLat).arcStartLng(d => d.startLng)
      .arcEndLat(d => d.endLat).arcEndLng(d => d.endLng)
      .arcColor(() => ["rgba(184,116,58,0)", "rgba(184,116,58,0.8)", "rgba(184,116,58,0)"])
      .arcStroke(0.35)
      .arcDashLength(0.45)
      .arcDashGap(0.25)
      .arcDashAnimateTime(3500)
      .arcAltitudeAutoScale(0.45);

    // Tint globe material to match paper palette.
    try {
      const mat = world.globeMaterial();
      if (mat && mat.color && mat.color.set) mat.color.set("#CFC4AD");
    } catch (e) {}

    // Controls: slow auto-rotate, drag to rotate, no scroll-zoom hijack.
    const controls = world.controls();
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;

    // Size to container.
    const resize = () => world.width(el.clientWidth).height(el.clientHeight);
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Initial view — western hemisphere (home is Miami).
    world.pointOfView({ lat: 22, lng: -55, altitude: 2.1 }, 0);

    // Load dotted land polygons (async).
    fetch("https://unpkg.com/three-globe@2.31.1/example/ne_110m_admin_0_countries.geojson")
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (!data || !worldRef.current) return;
        worldRef.current.hexPolygonsData(data.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.4)
          .hexPolygonUseDots(true)
          .hexPolygonColor(() => "rgba(20,18,16,0.55)");
      })
      .catch(() => {});

    worldRef.current = world;

    return () => {
      try { ro.disconnect(); } catch (e) {}
      if (worldRef.current && worldRef.current._destructor) {
        try { worldRef.current._destructor(); } catch (e) {}
      }
      worldRef.current = null;
      if (el) el.innerHTML = "";
    };
  }, [cities]);

  // Recolor + camera response to active-city changes.
  useEffect(() => {
    const w = worldRef.current;
    if (!w) return;
    w.pointColor(d => (d.city === active ? "#B8743A" : "#A85643"));
    if (active) {
      w.controls().autoRotate = false;
      const c = cities.find(x => x.city === active);
      if (c) w.pointOfView({ lat: c.lat, lng: c.lng, altitude: 1.8 }, 900);
    } else {
      w.controls().autoRotate = true;
    }
  }, [active, cities]);

  return <div ref={mountRef} className="globe-mount" />;
}

Object.assign(window, { MapSection });
