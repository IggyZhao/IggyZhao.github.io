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
  // Background distant skyline — small, faint
  const backRow = [
    [60,14,22],[76,12,18],[90,16,26],[108,12,20],[122,14,24],[138,16,28],
    [156,12,22],[170,16,30],[188,14,26],[204,18,32],[224,14,26],[240,16,28],
    [258,12,22],[274,18,30],[294,14,24],[820,14,24],[836,16,28],[854,12,22],
    [868,18,30],[888,14,26],[904,16,28],[922,14,24],[938,18,32],[958,14,26],
    [974,12,22],[988,16,28],[1006,14,24],[1022,18,30],[1042,14,26],[1058,12,22],
    [1072,16,28],[1090,14,24],[1106,16,28],[1124,12,22],[1138,14,24],[1154,12,20]
  ];
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
  // Palms — smaller, more numerous
  const palms = [
    {x:40,  h:48},
    {x:72,  h:38},
    {x:104, h:32},
    {x:200, h:34},
    {x:228, h:42},
    {x:790, h:36},
    {x:1080, h:44},
    {x:1118, h:34},
    {x:1148, h:40}
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
  return (
    <div className="miami-scene" aria-hidden="true">
      <svg viewBox="0 -60 1200 320" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg">
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

        {/* Distant background skyline */}
        <g className="ms-skyline-back">
          {backRow.map(([x, w, h], i) => (
            <rect key={i} x={x} y={waterY - h} width={w} height={h}/>
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

        {/* Palm trees — smaller, more numerous */}
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

        {/* Animated yacht — sails from right to left */}
        <g className="ms-yacht">
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
