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
            <span className="row"><span className="shift" style={{fontSize: "140px"}}>Dr. Ziyi <em className="iggy-accent" style={{fontSize: "100px", color: "rgb(184, 116, 58)"}}>(Iggy)</em></span></span>
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
  const fireworks = [
    { cx: 150, cy: 60, color: "amber",     delay: 0.0, size: 26 },
    { cx: 360, cy: 38, color: "coral",     delay: 1.4, size: 22 },
    { cx: 560, cy: 70, color: "sand",      delay: 0.7, size: 28 },
    { cx: 780, cy: 42, color: "teal-soft", delay: 2.1, size: 24 },
    { cx: 980, cy: 64, color: "amber",     delay: 2.9, size: 26 },
  ];
  return (
    <div className="miami-scene" aria-hidden="true">
      <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
        {/* Fireworks — only colorful element */}
        <g className="ms-fireworks">
          {fireworks.map((fw, i) => (
            <g key={i}
               className={`ms-fw ms-fw-${fw.color}`}
               transform={`translate(${fw.cx}, ${fw.cy})`}
               style={{ '--ms-delay': `${fw.delay}s`, '--burst-len': fw.size }}>
              {[...Array(12)].map((_, j) => (
                <line key={`l${j}`}
                      x1="0" y1="0" x2="0" y2={-fw.size}
                      transform={`rotate(${j * 30})`}
                      strokeLinecap="round"
                      style={{ strokeDasharray: fw.size }}/>
              ))}
              {[...Array(12)].map((_, j) => (
                <circle key={`d${j}`}
                        cx="0" cy={-fw.size} r="1.6"
                        transform={`rotate(${j * 30})`}/>
              ))}
            </g>
          ))}
        </g>

        {/* Distant skyline — lighter teal */}
        <g className="ms-skyline-back">
          <rect x="210" y="200" width="32" height="80"/>
          <rect x="242" y="188" width="34" height="92"/>
          <rect x="276" y="178" width="26" height="102"/>
          <rect x="302" y="195" width="38" height="85"/>
          <rect x="340" y="172" width="32" height="108"/>
          <rect x="372" y="190" width="26" height="90"/>
          <rect x="398" y="180" width="38" height="100"/>
          <rect x="436" y="198" width="30" height="82"/>
          <rect x="780" y="195" width="30" height="85"/>
          <rect x="810" y="180" width="38" height="100"/>
          <rect x="848" y="195" width="28" height="85"/>
          <rect x="876" y="186" width="34" height="94"/>
          <rect x="910" y="200" width="28" height="80"/>
          <rect x="938" y="190" width="32" height="90"/>
        </g>

        {/* Foreground CBD — varied tower silhouettes */}
        <g className="ms-skyline">
          {/* Tapered tower */}
          <path d="M470 170 L470 280 L508 280 L508 170 L489 152 Z"/>
          {/* Rect with antenna */}
          <rect x="513" y="160" width="32" height="120"/>
          <line x1="529" y1="160" x2="529" y2="138" strokeWidth="1.5"/>
          {/* Tall slab */}
          <rect x="550" y="140" width="42" height="140"/>
          {/* Spire — Miami's tallest motif */}
          <rect x="600" y="115" width="38" height="165"/>
          <line x1="619" y1="115" x2="619" y2="86" strokeWidth="2"/>
          <circle cx="619" cy="86" r="2"/>
          {/* Step-back tower */}
          <path d="M645 168 L645 280 L688 280 L688 168 L688 152 L678 152 L678 168 Z"/>
          {/* Rect */}
          <rect x="695" y="178" width="28" height="102"/>
          {/* Pyramid-top tower */}
          <path d="M728 175 L728 280 L772 280 L772 175 L750 156 Z"/>
        </g>

        {/* Palm trees — silhouettes */}
        <g className="ms-palms">
          {/* Tall palm — front left */}
          <g transform="translate(95, 280)">
            <path className="ms-palm-trunk" d="M0 0 Q -2 -32, 1 -60 Q 4 -90, 0 -115"/>
            <path className="ms-palm-frond" d="M0 -115 C -20 -118, -45 -115, -68 -105 C -50 -112, -32 -116, -10 -118 Z"/>
            <path className="ms-palm-frond" d="M0 -115 C 20 -118, 45 -115, 68 -105 C 50 -112, 32 -116, 10 -118 Z"/>
            <path className="ms-palm-frond" d="M0 -115 C -15 -132, -34 -148, -56 -152 C -40 -140, -22 -128, -6 -120 Z"/>
            <path className="ms-palm-frond" d="M0 -115 C 15 -132, 34 -148, 56 -152 C 40 -140, 22 -128, 6 -120 Z"/>
            <path className="ms-palm-frond" d="M0 -115 C -6 -140, -2 -158, 0 -168 C 2 -158, 6 -140, 0 -115 Z"/>
            <circle className="ms-palm-coconut" cx="-2" cy="-112" r="2.5"/>
            <circle className="ms-palm-coconut" cx="3" cy="-110" r="2.2"/>
          </g>
          {/* Medium palm — middle */}
          <g transform="translate(178, 280)">
            <path className="ms-palm-trunk" d="M0 0 Q -1.5 -26, 0 -52 Q 2 -78, 0 -94"/>
            <path className="ms-palm-frond" d="M0 -94 C -18 -97, -38 -94, -56 -85 C -42 -90, -26 -95, -8 -96 Z"/>
            <path className="ms-palm-frond" d="M0 -94 C 18 -97, 38 -94, 56 -85 C 42 -90, 26 -95, 8 -96 Z"/>
            <path className="ms-palm-frond" d="M0 -94 C -12 -110, -28 -122, -45 -125 C -32 -115, -18 -105, -5 -98 Z"/>
            <path className="ms-palm-frond" d="M0 -94 C 12 -110, 28 -122, 45 -125 C 32 -115, 18 -105, 5 -98 Z"/>
            <path className="ms-palm-frond" d="M0 -94 C -5 -116, -2 -132, 0 -138 C 2 -132, 5 -116, 0 -94 Z"/>
          </g>
          {/* Right-side palm */}
          <g transform="translate(1080, 280)">
            <path className="ms-palm-trunk" d="M0 0 Q -2 -30, 1 -58 Q 3 -86, 0 -106"/>
            <path className="ms-palm-frond" d="M0 -106 C -20 -110, -42 -106, -62 -96 C -46 -103, -28 -108, -8 -110 Z"/>
            <path className="ms-palm-frond" d="M0 -106 C 20 -110, 42 -106, 62 -96 C 46 -103, 28 -108, 8 -110 Z"/>
            <path className="ms-palm-frond" d="M0 -106 C -14 -124, -32 -140, -50 -142 C -36 -130, -20 -118, -5 -110 Z"/>
            <path className="ms-palm-frond" d="M0 -106 C 14 -124, 32 -140, 50 -142 C 36 -130, 20 -118, 5 -110 Z"/>
            <path className="ms-palm-frond" d="M0 -106 C -6 -132, -2 -150, 0 -156 C 2 -150, 6 -132, 0 -106 Z"/>
          </g>
        </g>

        {/* Water band with subtle waves */}
        <g className="ms-water">
          <rect x="0" y="280" width="1200" height="20"/>
          <path className="ms-wave ms-wave-1" d="M0 282 Q 60 279, 120 282 T 240 282 T 360 282 T 480 282 T 600 282 T 720 282 T 840 282 T 960 282 T 1080 282 T 1200 282" fill="none"/>
          <path className="ms-wave ms-wave-2" d="M0 290 Q 50 293, 100 290 T 200 290 T 300 290 T 400 290 T 500 290 T 600 290 T 700 290 T 800 290 T 900 290 T 1000 290 T 1100 290 T 1200 290" fill="none"/>
        </g>

        {/* Yacht */}
        <g className="ms-yacht" transform="translate(870, 270)">
          <path className="ms-yacht-hull" d="M-38 12 Q -42 4, -28 4 L 28 4 L 38 12 Z"/>
          <path className="ms-yacht-cabin" d="M-18 -6 L 14 -6 L 18 4 L -22 4 Z"/>
          <rect className="ms-yacht-roof" x="-10" y="-13" width="18" height="7"/>
          <line className="ms-yacht-mast" x1="-2" y1="-30" x2="-2" y2="-13" strokeWidth="1.3"/>
          <path className="ms-yacht-flag" d="M-2 -30 L 8 -27 L -2 -24 Z"/>
        </g>
      </svg>
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
