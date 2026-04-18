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

      <div className="map-layout reveal">
        <div className="map-wrap">
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

Object.assign(window, { MapSection });
