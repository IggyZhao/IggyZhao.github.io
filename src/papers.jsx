// Papers grid + modal
const { useState, useMemo } = React;

// Small orbit mark for papers that have a one-page figure (see src/figures.js).
// Left half teal = 2023 verification orbit, right half gold = 2026 validation orbit.
function OrbitMark() {
  const T = "#1E6B66", G = "#B8801F";
  return (
    <svg className="paper-mark" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="17" fill="none" stroke="#9C9488" strokeWidth="1.2" strokeDasharray="2.5 2.5"/>
      <path d="M50 20 A30 30 0 0 0 50 80" fill="none" stroke={T} strokeWidth="2.6" strokeLinecap="round"/>
      <path d="M50 20 A30 30 0 0 1 50 80" fill="none" stroke="#B9B3A8" strokeWidth="1"/>
      <path d="M50 7 A43 43 0 0 0 50 93" fill="none" stroke={G} strokeWidth="1" strokeOpacity=".45" strokeDasharray="1 4"/>
      <path d="M50 7 A43 43 0 0 1 50 93" fill="none" stroke={G} strokeWidth="2.6" strokeLinecap="round"/>
      <circle cx="50" cy="7" r="3.2" fill={G}/>
      <circle cx="50" cy="80" r="3.2" fill={T}/>
      <circle cx="42" cy="50" r="6.5" fill="currentColor"/>
      <circle cx="58" cy="50" r="6.5" fill="currentColor"/>
    </svg>
  );
}

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
  const label = { under: "Working Paper", progress: "Work in Progress", published: "Published", all: "All" };
  const statusLabel = { under: "Working Paper", progress: "In Progress", published: "Published" };

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
            <div key={`${filter}-${p.id||i}`} className={`paper-card ${p.figure ? "has-mark" : ""}`} onClick={() => setOpen(p)}>
              {p.figure && <PaperMark id={p.figure}/>}
              <div className={`paper-stamp ${p.kind}`}>
                <span className="status-dot"/>
                <span>{statusLabel[p.kind]}</span>
                <span style={{marginLeft:"auto", color:"var(--muted)"}}>→ {p.venue}</span>
              </div>
              <h3 className="paper-title">{p.title}</h3>
              <div className="paper-authors">{p.authors}</div>
              <div className="paper-venue">
                <span className="venue-meta">
                  {(p.status || p.year) && <span className="venue-name">{p.status || p.year}</span>}
                  {p.link && (
                    <a className="paper-link" href={p.link.url} target="_blank" rel="noopener noreferrer"
                       onClick={(e) => e.stopPropagation()}>{p.link.label} ↗</a>
                  )}
                </span>
                <span className="status">Read details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`paper-modal ${open?"open":""}`} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
        {open && (
          <div className={`paper-modal-inner ${open.figure ? "has-figure" : ""}`}>
            <button className="paper-modal-close" onClick={() => setOpen(null)}>×</button>
            <div className={`paper-stamp ${open.kind}`}>
              <span className="status-dot"/>
              <span>{statusLabel[open.kind]}</span>
            </div>
            <h3 className="mtitle">{open.title}</h3>
            <div className="mauthors">{open.authors}</div>
            {open.figure && window.FIGURES && window.FIGURES[open.figure] && (
              <div className="mfigure">
                <a className="mfigure-frame" href={open.figureUrl} target="_blank" rel="noopener noreferrer"
                   title="Open the figure full screen"
                   dangerouslySetInnerHTML={{__html: window.FIGURES[open.figure]}}/>
                <div className="mfigure-cap">
                  <span>One-page summary of the paper</span>
                  <a href={open.figureUrl} target="_blank" rel="noopener noreferrer">Open full screen ↗</a>
                </div>
              </div>
            )}
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
            {open.link && (
              <div className="mlink">
                <h5>Link</h5>
                <a className="mlink-a" href={open.link.url} target="_blank" rel="noopener noreferrer">
                  {open.link.label} ↗
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Figure-eight mark for the cross-platform SDK paper: iOS and Android lobes joined by one codebase.
function InfinityMark() {
  const G = "#B8801F";
  return (
    <svg className="paper-mark" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M56.7 50.0 L53.4 41.0 A26.0 26.0 0 1 0 53.4 59.0 L56.7 50.0 L59.2 43.4 A19.0 19.0 0 1 1 59.2 56.6 Z" fill="none" stroke={G} strokeOpacity=".2" strokeWidth="8" strokeLinejoin="round"/>
      <path d="M56.7 50.0 L53.4 41.0 A26.0 26.0 0 1 0 53.4 59.0 L56.7 50.0 L59.2 43.4 A19.0 19.0 0 1 1 59.2 56.6 Z" fill="none" stroke={G} strokeWidth="2.6" strokeLinejoin="round"/>
      <rect x="48.7" y="45.5" width="16" height="9" rx="4.5" fill="currentColor"/>
      <text x="29.0" y="53.2" textAnchor="middle" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="currentColor">iOS</text>
      <text x="77.0" y="53.0" textAnchor="middle" fontSize="8" fontFamily="IBM Plex Mono, monospace" fill="currentColor">And</text>
    </svg>
  );
}
const MARKS = { decoding: OrbitMark, killtwo: InfinityMark };
function PaperMark({ id }) { const M = MARKS[id]; return M ? <M/> : null; }

Object.assign(window, { PapersSection });
