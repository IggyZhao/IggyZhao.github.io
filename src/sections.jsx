// Remaining sections: About, Education, Teaching, Honors, Service, Talks, Contact
const { useState } = React;

function About() {
  return (
    <section className="block" id="about">
      <div className="section-head reveal">
        <div className="section-num">(01) — Research</div>
        <h2 className="section-title">What I <em>study.</em></h2>
      </div>

      {/* Primary statement — lead with the big idea */}
      <div className="about-lead reveal">
        <div className="lead-label">Focus</div>
        <p className="lead-statement">
          I open the black box of human-AI collaboration. Through <em>Multimodal Observation of Sequential Activity</em>, I trace how <em>generative</em> and <em>agentic AI</em> reshape human work and judgment across <strong>coding</strong>, <strong>information search</strong>, and <strong>healthcare decision-making</strong>.
        </p>
      </div>

      {/* Three pillars */}
      <div className="pillars reveal">
        <div className="pillar">
          <div className="pillar-num">01</div>
          <div className="pillar-head">Generative &amp; Agentic AI</div>
          <div className="pillar-body">Foundation models, copilots, autonomous agents — as research objects and as tools that change how humans work.</div>
        </div>
        <div className="pillar">
          <div className="pillar-num">02</div>
          <div className="pillar-head">AI in the Future of Work</div>
          <div className="pillar-body">Mixed method studies in <em>coding</em>, <em>searching</em>, and <em>healthcare</em> where AI shapes or transforms decision making.</div>
        </div>
        <div className="pillar">
          <div className="pillar-num">03</div>
          <div className="pillar-head">AI Index &amp; Methods</div>
          <div className="pillar-body">New indicators and methods for measuring what AI systems actually do.</div>
        </div>
      </div>

      {/* Methods — a single scrolling strip, no categories */}
      <MethodsMarquee/>
    </section>
  );
}

function MethodsMarquee() {
  const items = window.CV.research.methods.flatMap(m => m.items);
  const render = (arr) => arr.flatMap((w, i) => [
    <span key={`w${i}`} className="mm-word">{w}</span>,
    <span key={`s${i}`} className="mm-star">✦</span>
  ]);
  return (
    <div className="methods-marquee reveal">
      <div className="mm-label">methods</div>
      <div className="mm-rows">
        <div className="mm-track">
          <div className="mm-inner mm-ltr">
            <span>{render(items)}</span>
            <span>{render(items)}</span>
            <span>{render(items)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Education() {
  return (
    <section className="block" id="education">
      <div className="section-head reveal">
        <div className="section-num">(07) — Education</div>
        <h2 className="section-title"><em>Education.</em></h2>
      </div>
      <div className="edu-grid">
        {window.CV.education.map((e, i) => (
          <div key={i} className="edu-card reveal">
            <div className="edu-year">{e.years} · {e.loc}</div>
            <div className="edu-degree">{e.degree.split("\n").map((ln, k) => (<React.Fragment key={k}>{k>0 && <br/>}{ln}</React.Fragment>))}</div>
            <div className="edu-school">{e.school}</div>
            <div className="edu-detail">{e.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Teaching() {
  const [open, setOpen] = useState(new Set());
  const toggle = (i) => {
    const n = new Set(open);
    n.has(i) ? n.delete(i) : n.add(i);
    setOpen(n);
  };
  return (
    <section className="block" id="teaching">
      <div className="section-head reveal">
        <div className="section-num">(04) — Teaching</div>
        <h2 className="section-title"><em>Teaching.</em></h2>
      </div>

      <p className="teach-philosophy reveal">
        I use a <strong>Minimal Variable Product</strong> (MVP) strategy in class to boost curiosity,
        confidence, and the ability to ask meaningful questions, so students can become the
        <strong> Most Valuable Player</strong> (MVP) at work.
      </p>

      <div className="course-list reveal">
        {window.CV.courses.map((c, i) => (
          <div key={i} className={`course ${open.has(i) ? "open" : ""}`} onClick={() => toggle(i)}>
            <div className="course-code">
              {c.code}
              {c.rating && <><br/><span className="rating">★ {c.rating.split("(")[0].trim()}</span></>}
            </div>
            <div>
              <div className="course-name">{c.name}</div>
              <div className="course-role">{c.role}</div>
              <div className="course-desc">{c.description}</div>
            </div>
            <div className="course-meta">
              <span className="school">{c.school}</span>
              {c.level}{c.rating && c.rating.includes("(") ? <> · <span className="n-count">{c.rating.match(/\(([^)]+)\)/)[1]}</span></> : null}<br/>{c.term}
            </div>
            <div className="course-expand">+</div>
          </div>
        ))}
      </div>

    </section>
  );
}

function InvitedTalks() { return null; }

function HonorBlock({ label, items, highlight }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="honor-block">
      <div className="honor-block-label">
        <span>{label}</span>
        <span className="honor-count">{items.length}</span>
      </div>
      <ul className={`honor-list ${highlight?"highlight":""}`}>
        {items.map((x, i) => <li key={i}>{x}</li>)}
      </ul>
    </div>
  );
}

function Honors() {
  const h = window.CV.honors;
  return (
    <section className="block" id="honors">
      <div className="section-head reveal">
        <div className="section-num">(05) — Honors</div>
        <h2 className="section-title"><em>Honors</em> &amp; awards.</h2>
      </div>

      {/* Hero: honors and grants side-by-side */}
      <div className="honors-hero reveal">
        <div className="hh-col">
          <div className="hh-label">Research honors</div>
          <ul className="hh-list hh-list-single">
            {h.researchHonors.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
        <div className="hh-col">
          <div className="hh-label">Research grants</div>
          <ul className="hh-list hh-list-single">
            {h.researchGrants.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      </div>

      {/* Institutional honors: FIU + Temple stacked left, UConn + UoN stacked right */}
      <div className="honors-institutions reveal">
        <div className="honors-col-stack">
          <HonorBlock label="Florida International University" items={h.fiu}/>
          <HonorBlock label="Temple University" items={h.temple}/>
        </div>
        <div className="honors-col-stack">
          <HonorBlock label="University of Connecticut" items={h.uconn}/>
          <HonorBlock label="University of Nottingham" items={h.nottingham}/>
        </div>
      </div>

      {/* Footer strip: certificates, societal, media */}
      <div className="honors-misc reveal">
        <HonorBlock label="Professional certificates" items={h.certificates}/>
        <HonorBlock label="Societal &amp; academic" items={h.other}/>
        <HonorBlock label="Media coverage" items={h.media}/>
      </div>
    </section>
  );
}

function Service() {
  const s = window.CV.service;
  const total = s.journalTotal + s.conferenceTotal;
  return (
    <section className="block" id="service">
      <div className="section-head reveal">
        <div className="section-num">(06) — Service</div>
        <h2 className="section-title"><em>Service.</em></h2>
      </div>

      {/* Summary strip — clean stats at the top */}
      <div className="service-stats reveal">
        <div className="ss"><div className="n">{s.committee.length}</div><div className="l">Committee &amp; editorial roles</div></div>
        <div className="ss"><div className="n">{s.journalTotal}</div><div className="l">Journal reviews</div></div>
        <div className="ss"><div className="n">{s.conferenceTotal}</div><div className="l">Conference reviews</div></div>
        <div className="ss"><div className="n">{total}</div><div className="l">Total reports</div></div>
      </div>

      {/* Committee & editorial — top-of-section, wide */}
      <div className="service-section reveal">
        <div className="ss-label">Committee &amp; editorial</div>
        <ol className="service-roles">
          {s.committee.map((x, i) => (
            <li key={i}><span className="idx">{String(i+1).padStart(2,"0")}</span><span>{x}</span></li>
          ))}
        </ol>
      </div>

      {/* Reviewer venues, two columns, ordered by prestige */}
      <div className="reviewer-grid reveal">
        <div>
          <div className="ss-label">
            <span>Journal reviewer</span>
            <span className="ss-count">{s.journalTotal} reports</span>
          </div>
          <ReviewerList items={s.journalReviewer}/>
        </div>
        <div>
          <div className="ss-label">
            <span>Conference reviewer</span>
            <span className="ss-count">{s.conferenceTotal} reports</span>
          </div>
          <ReviewerList items={s.conferenceReviewer}/>
        </div>
      </div>

      {/* Community footer */}
      <div className="service-section reveal" style={{marginTop:80}}>
        <div className="ss-label">IS &amp; FIU community</div>
        <ul className="service-community">
          {s.community.map((x, i) => <li key={i}>{x}</li>)}
        </ul>
      </div>
    </section>
  );
}

function ReviewerList({ items }) {
  return (
    <ul className="rev-list">
      {items.map((r, i) => (
        <li key={i}>{r.name}</li>
      ))}
    </ul>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="section-head reveal" style={{marginBottom:40}}>
        <div className="section-num">(08) — Contact</div><div/>
      </div>
      <h2 className="contact-big reveal">
        Get in <em>touch.</em>
      </h2>
      <div className="contact-meta">
        <div><h6>Office</h6><p>Florida International University<br/>College of Business<br/>11200 SW 8th St<br/>Miami, FL 33199</p></div>
        <div><h6>Email</h6><p><a href="mailto:ziyzhao@fiu.edu" style={{borderBottom:'1px solid'}}>ziyzhao@fiu.edu</a></p></div>
        <div><h6>Social</h6><p><a href="https://www.linkedin.com/in/iggyzhao/" target="_blank" rel="noopener" style={{borderBottom:'1px solid'}}>LinkedIn</a><br/><a href="https://scholar.google.com/citations?user=9xgCneIAAAAJ" target="_blank" rel="noopener" style={{borderBottom:'1px solid'}}>Google Scholar</a></p></div>
        <div><h6>Updated</h6><p style={{fontFamily:'var(--mono)', fontSize:13, lineHeight:1.5, letterSpacing:'.08em', textTransform:'uppercase'}}>June 2026</p></div>
      </div>
    </section>
  );
}

/* Topbar + Reveal + Tweaks */
function Topbar() {
  const [sec, setSec] = useState("Top");
  React.useEffect(() => {
    const names = { about:"Research", research:"Papers", map:"Map", education:"Education", teaching:"Teaching", talks:"Talks", honors:"Honors", service:"Service", contact:"Contact" };
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
        <a href="#about">Research</a>
        <a href="#research">Papers</a>
        <a href="#map">Map</a>
        <a href="#teaching">Teaching</a>
        <a href="#honors">Honors</a>
        <a href="#education">Education</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="mark">Ziyi (Iggy) Zhao</div>
      <div className="right">
        <span>Now / {sec}</span>
        <a href="mailto:ziyzhao@fiu.edu">↗ Email</a>
      </div>
    </div>
  );
}

function Reveal() {
  React.useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "paper",
  "accent": "amber"
}/*EDITMODE-END*/;

function Tweaks() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  const [s, setS] = useState(TWEAK_DEFAULTS);
  React.useEffect(() => {
    const onMsg = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") { setActive(true); setOpen(true); }
      if (d.type === "__deactivate_edit_mode") { setActive(false); setOpen(false); }
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);
  React.useEffect(() => {
    document.documentElement.setAttribute("data-mode", s.mode === "paper" ? "paper" : "night");
    const accents = { amber: "#B8743A", teal: "#1B4F5C", coral: "#A85643", sand: "#8E7C5C" };
    document.documentElement.style.setProperty("--amber", accents[s.accent] || accents.amber);
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
            {["paper","night"].map(m => (
              <button key={m} className={s.mode===m?"active":""} onClick={()=>update("mode",m)}>{m}</button>
            ))}
          </div>
        </div>
        <div className="tweak-group">
          <label>Accent</label>
          <div className="tweak-row">
            {["amber","teal","coral","sand"].map(a => (
              <button key={a} className={s.accent===a?"active":""} onClick={()=>update("accent",a)}>{a}</button>
            ))}
          </div>
        </div>
      </>}
    </div>
  );
}

Object.assign(window, { About, Education, Teaching, InvitedTalks, Honors, Service, Contact, Topbar, Reveal, Tweaks });
