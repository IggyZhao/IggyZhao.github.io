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

Object.assign(window, { Hero3D, Marquee });
