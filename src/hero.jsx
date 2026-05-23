// Hero with 3D parallax + interactive portrait scene.
const { useState, useEffect, useRef } = React;

function Hero3D() {
  const sceneRef = useRef(null);
  const stackRef = useRef(null);
  const titleRef = useRef(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const miami = new Date(d.toLocaleString("en-US", { timeZone: "America/New_York" }));
      const hh = String(miami.getHours()).padStart(2, "0");
      const mm = String(miami.getMinutes()).padStart(2, "0");
      setTime(`${hh}:${mm}`);
    };
    fmt();
    const id = setInterval(fmt, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = sceneRef.current;
    const stack = stackRef.current;
    const title = titleRef.current;
    if (!el || !stack) return;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      tx = (x - 0.5) * 2;
      ty = (y - 0.5) * 2;
    };
    const raf = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (stack) stack.style.transform = `rotateY(${cx * 8}deg) rotateX(${-cy * 6}deg)`;
      if (title) {
        const spans = title.querySelectorAll("span.shift");
        spans.forEach((s, i) => {
          s.style.transform = `translateX(${cx * (i+1) * 3}px) translateZ(${i*4}px)`;
        });
      }
      requestAnimationFrame(raf);
    };
    window.addEventListener("mousemove", onMove);
    raf();
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const portraitSrc = (window.__resources && window.__resources.portrait) || "assets/portrait-cutout-clean.png";

  return (
    <header className="hero" id="top">
      <div className="hero-left">
        <div>
          <div className="hero-caption">
            <span>Index / <strong>001</strong></span>
            <span>Based in / <strong>Miami, FL</strong></span>
            <span>Est. / <strong>2026</strong></span>
            <span>Local / <strong>{time} EST</strong></span>
          </div>

          <h1 className="hero-title" ref={titleRef}>
            <span className="row"><span className="shift" style={{fontSize: "var(--name-main, 140px)"}}>Dr. Ziyi <em className="iggy-accent" style={{fontSize: "var(--name-iggy, 100px)", color: "rgb(184, 116, 58)"}}>(Iggy)</em></span></span>
            <span className="row"><span className="shift">Zhao</span></span>
          </h1>
        </div>

        <MiamiScene/>

        <div className="hero-bottom">
          <p className="hero-role">
            Assistant Professor<br/>
            Information Systems &amp; Business Analytics<br/>
            College of Business, Florida International University.
          </p>
          <div className="hero-meta">
            <div><span className="dot-live"/>ziyzhao@fiu.edu</div>
            <div>Miami, FL · USA</div>
            <div>↘ Scroll</div>
          </div>
        </div>
      </div>

      <div className="hero-scene" ref={sceneRef}>
        <div className="scene-stack" ref={stackRef}>
          <div className="scene-layer">
            <div className="scene-sun" />
            <div className="scene-horizon">
              <span/><span/><span/><span/>
            </div>
          </div>
          <div className="scene-layer"><div className="scene-frame"/></div>
          <img className="portrait-img" src={portraitSrc} alt="Portrait of Ziyi Zhao" />
          <div className="scene-chip c1">ZHAO / 2026</div>
          <div className="scene-chip c2">Assistant Prof.</div>
          <div className="scene-chip c3">FIU · Miami</div>
        </div>
      </div>
    </header>
  );
}

function MiamiScene() {
  // —— Catch-the-UTD24 game state ——
  const svgRef = useRef(null);
  const shipXRef = useRef(600);      // current rendered ship x (smoothed)
  const targetXRef = useRef(600);    // user-controlled target x
  const papersRef = useRef([]);      // [{id, x, y, vy, rot, vrot}]
  const popupsRef = useRef([]);      // [{id, x, y, born}]
  const lastSpawnRef = useRef(0);
  const nextIdRef = useRef(1);
  const [, force] = useState(0);
  const rerender = () => force((n) => (n + 1) & 0xffff);
  const [score, setScore] = useState(() => {
    try { return parseInt(localStorage.getItem("utd24_score") || "0", 10) || 0; }
    catch { return 0; }
  });
  const scoreRef = useRef(score);
  scoreRef.current = score;

  // Scene coordinate constants (must match SVG viewBox below)
  const SCENE_MIN_X = 40;
  const SCENE_MAX_X = 1160;
  const WATER_Y = 240;
  const DECK_Y = 215;                // catch line — top of cabin/bridge
  const CATCH_HALF_W = 48;           // half-width of catch zone around ship center

  // Convert client pointer to SVG x using current viewBox mapping
  const clientToSvgX = (clientX) => {
    const svg = svgRef.current;
    if (!svg) return targetXRef.current;
    const rect = svg.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return 0 + ratio * 1200;
  };

  // Pointer/touch/keyboard input
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let dragging = false;
    const setX = (cx) => {
      const x = Math.max(SCENE_MIN_X, Math.min(SCENE_MAX_X, clientToSvgX(cx)));
      targetXRef.current = x;
    };
    const onDown = (e) => {
      dragging = true;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      setX(cx);
      if (e.cancelable) e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging && !(e.buttons & 1) && !e.touches) return;
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      setX(cx);
    };
    const onUp = () => { dragging = false; };
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  { targetXRef.current = Math.max(SCENE_MIN_X, targetXRef.current - 40); }
      if (e.key === "ArrowRight") { targetXRef.current = Math.min(SCENE_MAX_X, targetXRef.current + 40); }
    };
    svg.addEventListener("mousedown", onDown);
    svg.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    window.addEventListener("keydown", onKey);
    return () => {
      svg.removeEventListener("mousedown", onDown);
      svg.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Game loop: spawn papers, animate fall, check collisions, animate popups
  useEffect(() => {
    let raf;
    let last = performance.now();
    const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SPAWN_MS = reduced ? 2200 : 1400;
    const tick = (now) => {
      const dt = Math.min(64, now - last);
      last = now;

      // Smooth ship toward target
      shipXRef.current += (targetXRef.current - shipXRef.current) * 0.18;

      // Spawn
      if (now - lastSpawnRef.current > SPAWN_MS) {
        lastSpawnRef.current = now;
        const x = SCENE_MIN_X + 40 + Math.random() * (SCENE_MAX_X - SCENE_MIN_X - 80);
        papersRef.current.push({
          id: nextIdRef.current++,
          x,
          y: -80,
          vy: reduced ? 0.08 : (0.11 + Math.random() * 0.06),  // px per ms
          rot: (Math.random() - 0.5) * 30,
          vrot: (Math.random() - 0.5) * 0.04,
        });
      }

      // Update papers
      const shipX = shipXRef.current;
      const kept = [];
      for (const p of papersRef.current) {
        p.y += p.vy * dt;
        p.rot += p.vrot * dt;
        const inCatchY = p.y >= DECK_Y - 12 && p.y <= DECK_Y + 18;
        const inCatchX = Math.abs(p.x - shipX) <= CATCH_HALF_W;
        if (inCatchY && inCatchX) {
          // Caught!
          popupsRef.current.push({ id: nextIdRef.current++, x: p.x, y: DECK_Y - 24, born: now });
          const next = scoreRef.current + 1;
          scoreRef.current = next;
          setScore(next);
          try { localStorage.setItem("utd24_score", String(next)); } catch {}
          continue;
        }
        if (p.y > WATER_Y + 30) continue; // fell into water
        kept.push(p);
      }
      papersRef.current = kept;

      // Cull old popups (1s lifetime)
      popupsRef.current = popupsRef.current.filter((u) => now - u.born < 1000);

      rerender();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Foreground Miami skyline — denser, varied, with iconic treatments
  const front = [
    {x:300,w:14,h:28},{x:316,w:16,h:34},{x:334,w:12,h:26},
    {x:348,w:18,h:40, t:'antenna'},
    // Freedom Tower-style cupola
    {x:368,w:20,h:46, t:'freedom'},
    {x:390,w:14,h:38},{x:406,w:16,h:42},
    // Wells Fargo sloped roof
    {x:424,w:22,h:54, t:'sloped'},
    // Bank of America Tower w/ antenna
    {x:448,w:18,h:62, t:'antenna'},
    {x:468,w:14,h:48},{x:484,w:16,h:52},
    // Southeast Financial
    {x:502,w:20,h:64},
    {x:524,w:14,h:50},{x:540,w:16,h:54, t:'antenna'},
    // Panorama Tower — Miami's tallest, sloped crown + spire
    {x:558,w:24,h:88, t:'panorama'},
    // Four Seasons Brickell
    {x:584,w:16,h:70, t:'antenna'},
    // Brickell Heights twin
    {x:602,w:20,h:62, t:'twin'},
    {x:624,w:14,h:54},
    // Echo Brickell
    {x:640,w:18,h:66},
    {x:660,w:14,h:48},
    // SLS Lux — angular
    {x:676,w:18,h:52, t:'sloped'},
    {x:696,w:14,h:42},{x:712,w:16,h:46},{x:730,w:12,h:36},
    {x:744,w:18,h:44},{x:764,w:14,h:38},{x:780,w:16,h:36, t:'antenna'},
    {x:798,w:12,h:30}
  ];
  // Palms — clustered, uneven heights
  const palms = [
    // Left cluster (3 close together)
    {x:28,  h:58},
    {x:54,  h:36},
    {x:78,  h:48},
    // Left singleton
    {x:212, h:52},
    {x:240, h:34},
    // Right cluster
    {x:842, h:42},
    {x:870, h:58},
    // Right cluster 2
    {x:1042, h:54},
    {x:1068, h:38},
    {x:1092, h:46},
    // Right far
    {x:1156, h:44}
  ];
  // Beach umbrellas — just a few, near palms
  const umbrellas = [
    {x:128, tilt:-6, size:13},
    {x:268, tilt: 5, size:12},
    {x:908, tilt:-5, size:13},
    {x:1130,tilt: 6, size:12}
  ];
  // Lounge chairs — next to umbrellas
  const chairs = [
    {x:140, dir: 1},
    {x:920, dir:-1}
  ];
  // Fireworks — burst high, with launch trail from water
  const fireworks = [
    { cx: 120, cy: 10,  color: "amber",     delay: 0.0, size: 24 },
    { cx: 310, cy: -18, color: "coral",     delay: 2.0, size: 28 },
    { cx: 540, cy: 4,   color: "sand",      delay: 1.0, size: 26 },
    { cx: 780, cy: -10, color: "teal-soft", delay: 3.2, size: 30 },
    { cx: 990, cy: 16,  color: "amber",     delay: 4.4, size: 22 },
  ];
  const waterY = 240;
  const shipX = shipXRef.current;
  return (
    <div className="miami-scene">
      <svg ref={svgRef} viewBox="0 -60 1200 320" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Catch the UTD24 papers — drag the orange boat left and right">
        {/* Fireworks — only colorful element; rise from water then burst */}
        <g className="ms-fireworks">
          {fireworks.map((fw, i) => (
            <g key={i} className={`ms-fw ms-fw-${fw.color}`}
               style={{
                 '--ms-delay': `${fw.delay}s`,
                 '--burst-len': fw.size,
                 '--trail-len': waterY - fw.cy
               }}>
              {/* Launch trail */}
              <line className="ms-fw-trail"
                    x1={fw.cx} y1={waterY} x2={fw.cx} y2={fw.cy}
                    strokeLinecap="round"
                    style={{ strokeDasharray: waterY - fw.cy }}/>
              {/* Burst */}
              <g className="ms-fw-burst" transform={`translate(${fw.cx}, ${fw.cy})`}>
                {[...Array(12)].map((_, j) => (
                  <line key={`l${j}`} x1="0" y1="0" x2="0" y2={-fw.size}
                        transform={`rotate(${j * 30})`}
                        strokeLinecap="round"
                        style={{ strokeDasharray: fw.size }}/>
                ))}
                {[...Array(12)].map((_, j) => (
                  <circle key={`d${j}`} cx="0" cy={-fw.size} r="1.4"
                          transform={`rotate(${j * 30})`}/>
                ))}
              </g>
            </g>
          ))}
        </g>

        {/* Foreground skyline with iconic Miami treatments */}
        <g className="ms-skyline">
          {front.map((b, i) => {
            const baseY = waterY - b.h;
            const cx = b.x + b.w / 2;
            if (b.t === 'panorama') {
              return (
                <g key={i}>
                  <path d={`M${b.x} ${baseY + 10} L${b.x} ${waterY} L${b.x + b.w} ${waterY} L${b.x + b.w} ${baseY + 10} L${cx} ${baseY} Z`}/>
                  <line x1={cx} y1={baseY} x2={cx} y2={baseY - 14} strokeWidth="1.5"/>
                  <circle cx={cx} cy={baseY - 14} r="1.5"/>
                </g>
              );
            }
            if (b.t === 'sloped') {
              return (
                <path key={i} d={`M${b.x} ${baseY + 8} L${cx} ${baseY} L${b.x + b.w} ${baseY + 8} L${b.x + b.w} ${waterY} L${b.x} ${waterY} Z`}/>
              );
            }
            if (b.t === 'twin') {
              const gap = 3;
              return (
                <g key={i}>
                  <rect x={b.x} y={baseY + 4} width={(b.w - gap) / 2} height={b.h - 4}/>
                  <rect x={b.x + (b.w + gap) / 2} y={baseY} width={(b.w - gap) / 2} height={b.h}/>
                </g>
              );
            }
            if (b.t === 'freedom') {
              return (
                <g key={i}>
                  <rect x={b.x} y={baseY + 10} width={b.w} height={b.h - 10}/>
                  <rect x={cx - 5} y={baseY + 4} width="10" height="7"/>
                  <rect x={cx - 2.5} y={baseY - 1} width="5" height="5"/>
                  <line x1={cx} y1={baseY - 1} x2={cx} y2={baseY - 8} strokeWidth="1"/>
                </g>
              );
            }
            if (b.t === 'antenna') {
              return (
                <g key={i}>
                  <rect x={b.x} y={baseY} width={b.w} height={b.h}/>
                  <line x1={cx} y1={baseY} x2={cx} y2={baseY - 10} strokeWidth="1"/>
                </g>
              );
            }
            return <rect key={i} x={b.x} y={baseY} width={b.w} height={b.h}/>;
          })}
        </g>

        {/* Beach umbrellas — just a handful, near palms */}
        <g className="ms-umbrellas">
          {umbrellas.map((u, i) => {
            const r = u.size;
            return (
              <g key={i} transform={`translate(${u.x}, ${waterY}) rotate(${u.tilt})`}>
                {/* Canopy dome */}
                <path className="ms-umb-canopy"
                      d={`M ${-r} 0 Q ${-r} ${-r*0.85} 0 ${-r} Q ${r} ${-r*0.85} ${r} 0 Q ${r*0.5} ${-r*0.15} 0 0 Q ${-r*0.5} ${-r*0.15} ${-r} 0 Z`}/>
                {/* Topper */}
                <circle className="ms-umb-top" cx="0" cy={-r} r="1.2"/>
                {/* Pole */}
                <line className="ms-umb-pole" x1="0" y1="0" x2="0" y2={r*1.5} strokeWidth="1.3"/>
              </g>
            );
          })}
        </g>

        {/* Lounge chairs — next to umbrellas */}
        <g className="ms-chairs">
          {chairs.map((c, i) => (
            <g key={i} transform={`translate(${c.x}, ${waterY}) scale(${c.dir}, 1)`}>
              <path className="ms-chair" d="M 0 0 L 0 -3 L 18 -3 L 24 -11 L 26 -11 L 20 -3 L 20 0 Z"/>
            </g>
          ))}
        </g>

        {/* Palm trees — clustered on the beaches */}
        <g className="ms-palms">
          {palms.map((p, i) => {
            const h = p.h;
            const f = (s, t) => `${s * h}`;
            return (
              <g key={i} transform={`translate(${p.x}, ${waterY})`}>
                <path className="ms-palm-trunk" d={`M0 0 Q -1 ${-h*0.4}, 0.5 ${-h*0.7} Q 1.5 ${-h*0.9}, 0 ${-h}`}/>
                <path className="ms-palm-frond" d={`M0 ${-h} C ${-h*0.2} ${-h-2}, ${-h*0.45} ${-h+1}, ${-h*0.6} ${-h+6} C ${-h*0.4} ${-h+1}, ${-h*0.18} ${-h-1}, 0 ${-h-2} Z`}/>
                <path className="ms-palm-frond" d={`M0 ${-h} C ${h*0.2} ${-h-2}, ${h*0.45} ${-h+1}, ${h*0.6} ${-h+6} C ${h*0.4} ${-h+1}, ${h*0.18} ${-h-1}, 0 ${-h-2} Z`}/>
                <path className="ms-palm-frond" d={`M0 ${-h} C ${-h*0.15} ${-h-6}, ${-h*0.32} ${-h-12}, ${-h*0.45} ${-h-13} C ${-h*0.3} ${-h-7}, ${-h*0.15} ${-h-3}, 0 ${-h-2} Z`}/>
                <path className="ms-palm-frond" d={`M0 ${-h} C ${h*0.15} ${-h-6}, ${h*0.32} ${-h-12}, ${h*0.45} ${-h-13} C ${h*0.3} ${-h-7}, ${h*0.15} ${-h-3}, 0 ${-h-2} Z`}/>
                <path className="ms-palm-frond" d={`M0 ${-h} C -1.5 ${-h-8}, -0.5 ${-h-14}, 0 ${-h-16} C 0.5 ${-h-14}, 1.5 ${-h-8}, 0 ${-h} Z`}/>
              </g>
            );
          })}
        </g>

        {/* Water band with subtle waves */}
        <g className="ms-water">
          <rect x="0" y={waterY} width="1200" height="20"/>
          <path className="ms-wave ms-wave-1" d={`M0 ${waterY+3} Q 50 ${waterY} 100 ${waterY+3} T 200 ${waterY+3} T 300 ${waterY+3} T 400 ${waterY+3} T 500 ${waterY+3} T 600 ${waterY+3} T 700 ${waterY+3} T 800 ${waterY+3} T 900 ${waterY+3} T 1000 ${waterY+3} T 1100 ${waterY+3} T 1200 ${waterY+3}`} fill="none"/>
          <path className="ms-wave ms-wave-2" d={`M0 ${waterY+11} Q 40 ${waterY+14} 80 ${waterY+11} T 160 ${waterY+11} T 240 ${waterY+11} T 320 ${waterY+11} T 400 ${waterY+11} T 480 ${waterY+11} T 560 ${waterY+11} T 640 ${waterY+11} T 720 ${waterY+11} T 800 ${waterY+11} T 880 ${waterY+11} T 960 ${waterY+11} T 1040 ${waterY+11} T 1120 ${waterY+11} T 1200 ${waterY+11}`} fill="none"/>
        </g>

        {/* Falling UTD24 papers — behind the boat so the boat appears to catch them */}
        <g className="ms-papers">
          {papersRef.current.map((p) => (
            <g key={p.id} transform={`translate(${p.x}, ${p.y}) rotate(${p.rot})`}>
              <rect className="ms-paper-bg" x="-22" y="-28" width="44" height="56" rx="2"/>
              <line className="ms-paper-rule" x1="-16" y1="-16" x2="16" y2="-16"/>
              <line className="ms-paper-rule" x1="-16" y1="-10" x2="10" y2="-10"/>
              <text className="ms-paper-text" x="0" y="8" textAnchor="middle">UTD24</text>
            </g>
          ))}
        </g>

        {/* Player-controlled orange boat */}
        <g className="ms-yacht" transform={`translate(${shipX}, ${WATER_Y - 8})`}>
          {/* Lower hull */}
          <path className="ms-yacht-hull" d="M-44 6 Q -50 -2, -34 -2 L 30 -2 L 48 6 L 42 12 L -38 12 Z"/>
          {/* Mid deck */}
          <path className="ms-yacht-deck" d="M-30 -8 L 24 -8 L 28 -2 L -34 -2 Z"/>
          {/* Cabin */}
          <rect className="ms-yacht-cabin" x="-20" y="-16" width="36" height="8"/>
          {/* Bridge */}
          <rect className="ms-yacht-bridge" x="-8" y="-24" width="16" height="8"/>
          {/* Windows on cabin */}
          <rect className="ms-yacht-window" x="-16" y="-13" width="4" height="3"/>
          <rect className="ms-yacht-window" x="-10" y="-13" width="4" height="3"/>
          <rect className="ms-yacht-window" x="-4" y="-13" width="4" height="3"/>
          <rect className="ms-yacht-window" x="2" y="-13" width="4" height="3"/>
          <rect className="ms-yacht-window" x="8" y="-13" width="4" height="3"/>
          {/* Mast + flag */}
          <line className="ms-yacht-mast" x1="0" y1="-40" x2="0" y2="-24" strokeWidth="1.2"/>
          <path className="ms-yacht-flag" d="M0 -40 L 9 -37 L 0 -34 Z"/>
          {/* Side antennas */}
          <line className="ms-yacht-mast" x1="-14" y1="-24" x2="-14" y2="-31" strokeWidth="0.9"/>
          <line className="ms-yacht-mast" x1="12" y1="-24" x2="12" y2="-30" strokeWidth="0.9"/>
        </g>

        {/* "+1" floating popups */}
        <g className="ms-popups">
          {popupsRef.current.map((u) => {
            const age = (performance.now() - u.born) / 1000;
            const ty = -age * 36;
            const opacity = Math.max(0, 1 - age * 1.1);
            return (
              <text key={u.id} className="ms-popup" x={u.x} y={u.y}
                    transform={`translate(0, ${ty})`} opacity={opacity} textAnchor="middle">
                paper +1
              </text>
            );
          })}
        </g>

        {/* Score chip */}
        <g className="ms-score" transform="translate(1180, -32)">
          <rect className="ms-score-bg" x="-176" y="-20" width="176" height="40" rx="20"/>
          <text className="ms-score-label" x="-160" y="0">UTD24 caught</text>
          <text className="ms-score-num"   x="-18"  y="1" textAnchor="end">{score}</text>
        </g>
      </svg>
      <div className="ms-hint" aria-hidden="true">drag the boat ↔ to catch UTD24 papers</div>
    </div>
  );
}

function Marquee() {
  const words = ["Generative AI", "Agentic AI", "Vibe Coding", "Future of Work", "Information Search", "Healthcare Agents", "AI Index & Methods"];
  const line = words.flatMap((w, i) => [<span key={`w${i}`}>{w}</span>, <span key={`s${i}`} className="star">✦</span>]);
  return (
    <div className="marquee">
      <div className="marquee-inner">
        <span>{line}</span>
        <span>{line}</span>
      </div>
    </div>
  );
}

Object.assign(window, { Hero3D, Marquee, MiamiScene });
