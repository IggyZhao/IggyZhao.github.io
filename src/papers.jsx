// Papers grid + modal
const { useState, useMemo } = React;

function PapersSection() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);

  const all = useMemo(() => {
    const w = window.CV.workingPapers.map(p => ({...p, kind:"under"}));
    const ip = window.CV.inProgress.map(p => ({...p, kind:"progress"}));
    const pub = window.CV.published.map(p => ({...p, kind:"published"}));
    return [...w, ...ip, ...pub];
  }, []);

  const filtered = filter === "all" ? all : all.filter(p => p.kind === filter);
  const label = { under: "Under Review", progress: "Work in Progress", published: "Published", all: "All" };
  const statusLabel = { under: "Under Review", progress: "In Progress", published: "Published" };

  return (
    <section className="block" id="research">
      <div className="section-head reveal">
        <div className="section-num">(02) — Research</div>
        <h2 className="section-title">Selected <em>work.</em></h2>
      </div>

      <div className="reveal">
        <div className="paper-filters">
          {["all","under","progress","published"].map(k => (
            <button key={k} className={`paper-filter ${filter===k?"active":""}`} onClick={() => setFilter(k)}>
              {label[k]} ({k==="all"?all.length:all.filter(p=>p.kind===k).length})
            </button>
          ))}
        </div>

        <div className="papers-grid">
          {filtered.map((p, i) => (
            <div key={`${filter}-${p.id||i}`} className="paper-card" onClick={() => setOpen(p)}>
              <div className={`paper-stamp ${p.kind}`}>
                <span className="status-dot"/>
                <span>{statusLabel[p.kind]}</span>
                <span style={{marginLeft:"auto", color:"var(--muted)"}}>→ {p.venue}</span>
              </div>
              <h3 className="paper-title">{p.title}</h3>
              <div className="paper-authors">{p.authors}</div>
              <div className="paper-venue">
                <span className="venue-name">{p.status || p.year}</span>
                <span className="status">Read details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`paper-modal ${open?"open":""}`} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
        {open && (
          <div className="paper-modal-inner">
            <button className="paper-modal-close" onClick={() => setOpen(null)}>×</button>
            <div className={`paper-stamp ${open.kind}`}>
              <span className="status-dot"/>
              <span>{statusLabel[open.kind]}</span>
            </div>
            <h3 className="mtitle">{open.title}</h3>
            <div className="mauthors">{open.authors}</div>
            <dl className="mmeta">
              <dt>Venue</dt><dd>{open.venue}</dd>
              {open.status && <><dt>Status</dt><dd>{open.status}</dd></>}
              {open.year && <><dt>Year</dt><dd>{open.year}</dd></>}
            </dl>
            {open.presented && open.presented.length > 0 && (
              <div className="mpresented">
                <h5>Presented at</h5>
                <ul>{open.presented.map((v, i) => <li key={i}>{v}</li>)}</ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

Object.assign(window, { PapersSection });
