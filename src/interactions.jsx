// Scroll reveals, custom cursor, tweaks panel
const { useEffect, useState, useRef } = React;

function Cursor() {
  useEffect(() => {
    const c = document.querySelector(".cursor");
    const d = document.querySelector(".cursor-dot");
    if (!c || !d) return;
    let rx = 0, ry = 0, x = 0, y = 0;
    const move = (e) => { x = e.clientX; y = e.clientY; d.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; };
    const raf = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      c.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(raf);
    };
    window.addEventListener("mousemove", move);
    const over = () => c.classList.add("hover");
    const out = () => c.classList.remove("hover");
    document.querySelectorAll("a, button, .pub-row, .edu-card, .portrait, .skill-chip").forEach(el => {
      el.addEventListener("mouseenter", over); el.addEventListener("mouseleave", out);
    });
    raf();
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return null;
}

function Reveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

/* Topbar with section progress */
function Topbar() {
  const [sec, setSec] = useState("Top");
  useEffect(() => {
    const names = { about:"Profile", education:"Education", research:"Research", teaching:"Teaching", awards:"Honors", skills:"Tooling", talks:"Talks", contact:"Contact" };
    const onScroll = () => {
      const y = window.scrollY + 200;
      let cur = "Top";
      Object.keys(names).forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = names[id];
      });
      setSec(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="topbar">
      <div className="left">
        <a href="#about">Profile</a>
        <a href="#research">Research</a>
        <a href="#teaching">Teaching</a>
        <a href="#awards">Honors</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="mark">Ziyi Zhao</div>
      <div className="right">
        <span>Now viewing / {sec}</span>
        <a href="mailto:ziyzhao@fiu.edu">↗ Email</a>
      </div>
    </div>
  );
}

/* Tweaks */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "paper",
  "accent": "warm",
  "cursor": true,
  "display": "fraunces"
}/*EDITMODE-END*/;

function Tweaks() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [s, setS] = useState(TWEAK_DEFAULTS);

  useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") { setActive(true); setOpen(true); }
      if (d.type === "__deactivate_edit_mode") { setActive(false); setOpen(false); }
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-mode", s.mode);
    document.body.classList.toggle("no-cursor", !s.cursor);
    const accents = { warm: "oklch(0.58 0.09 45)", olive: "oklch(0.52 0.08 140)", ink: "var(--ink)", cobalt: "oklch(0.48 0.12 250)" };
    document.documentElement.style.setProperty("--accent-warm", accents[s.accent] || accents.warm);
    const fonts = {
      fraunces: '"Fraunces","Instrument Serif",serif',
      instrument: '"Instrument Serif","Times New Roman",serif',
      dm: '"DM Serif Display","Instrument Serif",serif',
    };
    document.documentElement.style.setProperty("--display", fonts[s.display] || fonts.fraunces);
  }, [s]);

  const update = (k, v) => {
    const next = { ...s, [k]: v };
    setS(next);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
  };

  if (!active) return null;
  return (
    <div className={`tweaks ${open?"open":""}`}>
      <h6>Tweaks <span onClick={()=>setOpen(!open)} style={{cursor:'pointer'}}>{open?"—":"+"}</span></h6>
      {open && <>
        <div className="tweak-group">
          <label>Mode</label>
          <div className="tweak-row">
            {["paper","ink","olive"].map(m => (
              <button key={m} className={s.mode===m?"active":""} onClick={()=>update("mode",m)}>{m}</button>
            ))}
          </div>
        </div>
        <div className="tweak-group">
          <label>Accent</label>
          <div className="tweak-row">
            {["warm","olive","ink","cobalt"].map(a => (
              <button key={a} className={s.accent===a?"active":""} onClick={()=>update("accent",a)}>{a}</button>
            ))}
          </div>
        </div>
        <div className="tweak-group">
          <label>Display font</label>
          <div className="tweak-row">
            {[["fraunces","Fraunces"],["instrument","Instrument"],["dm","DM Serif"]].map(([k,l]) => (
              <button key={k} className={s.display===k?"active":""} onClick={()=>update("display",k)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="tweak-group">
          <label>Cursor</label>
          <div className="tweak-row">
            <button className={s.cursor?"active":""} onClick={()=>update("cursor",true)}>On</button>
            <button className={!s.cursor?"active":""} onClick={()=>update("cursor",false)}>Off</button>
          </div>
        </div>
      </>}
    </div>
  );
}

Object.assign(window, { Cursor, Reveal, Topbar, Tweaks });
