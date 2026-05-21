/* Case study inner page */
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

/* simple reveal hook */
function useRevealC() {
  const ref = useRefC(null);
  const [seen, setSeen] = useStateC(false);
  useEffectC(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { setSeen(true); obs.disconnect(); }
    }), { threshold: .1, rootMargin: '0px 0px -60px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, seen ? 'in' : ''];
}

/* Top-level nav (lighter version — no mobile menu) */
function NavLite() {
  const [scrolled, setScrolled] = useStateC(false);
  useEffectC(() => {
    const onScroll = () => setScrolled(scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')} aria-label="Primary">
      <div className="nav-inner">
        <a href="index.html" className="logo" aria-label="Home">
          <span className="logo-name">vikas</span>
          <span className="logo-mark">thakur°</span>
        </a>
        <div className="nav-links">
          <a href="index.html#work">Work</a>
          <a href="index.html#about">About</a>
          <a href="index.html#services">Services</a>
          <a href="index.html#contact">Contact</a>
        </div>
        <div className="nav-status" aria-live="polite">
          <span className="status-dot"></span>
          <span>Open for work</span>
        </div>
      </div>
    </nav>
  );
}

function ScrollProgressC() {
  const [pct, setPct] = useStateC(0);
  useEffectC(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      setPct(h > 0 ? (scrollY / h) * 100 : 0);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);
  return <div className="progress" style={{ width: pct + '%' }} aria-hidden="true"></div>;
}

/* Renders one case-section body — supports body string, features array, or chips */
function CaseSection({ s }) {
  return (
    <div className="case-section">
      <h4>{s.h}</h4>
      <div className="case-section-body">
        {s.body && <p>{s.body}</p>}
        {s.features && (
          <ul className="feature-list">
            {s.features.map(([name, desc], i) => (
              <li key={i}>
                <span className="feat-name">{name}</span>
                <span className="feat-desc">{desc}</span>
              </li>
            ))}
          </ul>
        )}
        {s.chips && (
          <div className="case-tools">
            {s.chips.map((c, i) => <span key={i}>{c}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

/* Gallery — staggered editorial grid */
function Gallery({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="case-gallery">
      {images.map((src, i) => (
        <figure key={i} className={'gal-item gal-item--' + (i % 3)}>
          <img src={src} alt="" loading="lazy"/>
        </figure>
      ))}
    </div>
  );
}

/* Hero of case */
function CaseHero({ c }) {
  const [heroR, heroC] = useRevealC();
  return (
    <section className="page-hero">
      <div className="container">
        <div ref={heroR} className={'reveal ' + heroC}>
          <div className="crumb">
            <a href="index.html">← Home</a>
            <span>/</span>
            <a href="index.html#work">Work</a>
            <span>/</span>
            <span>{c.title}</span>
          </div>
          <span className="case-tag">{c.tag}</span>
          <h1>{c.title} <span className="it">— {c.sub.toLowerCase()}</span></h1>
          <p>{c.overview}</p>
          <div className="case-hero-meta">
            <div><span className="meta-k">Year</span><span className="meta-v">{c.year}</span></div>
            <div><span className="meta-k">Client</span><span className="meta-v">{c.client}</span></div>
            <div><span className="meta-k">Type</span><span className="meta-v">{c.type}</span></div>
          </div>
        </div>
      </div>
      <div className="container">
        <div ref={useRevealC()[0]} className="case-hero-cover">
          <img src={c.cover} alt={c.title} loading="eager"/>
        </div>
      </div>
    </section>
  );
}

/* Main case study page */
function CaseStudyPage({ slug }) {
  const c = window.CASE_STUDIES[slug];
  if (!c) {
    return (
      <section className="page-hero">
        <div className="container">
          <div className="crumb"><a href="index.html">← Home</a></div>
          <h1>Project not found.</h1>
          <p>The case study <code>{slug}</code> doesn\u2019t exist. <a href="index.html#work" style={{textDecoration:'underline'}}>See all work →</a></p>
        </div>
      </section>
    );
  }
  const order = window.CASE_ORDER || [];
  const idx = order.indexOf(slug);
  const next = order[(idx + 1) % order.length];
  const nextC = next && window.CASE_STUDIES[next];

  return (
    <>
      <CaseHero c={c} />
      <section className="case-list">
        <div className="container">
          <article className="case">
            <div className="case-body">
              {c.sections.map((s, i) => <CaseSection key={i} s={s} />)}
            </div>
          </article>
          {c.gallery && c.gallery.length > 1 && (
            <div className="case-gallery-wrap">
              <h4 className="case-gallery-label">Gallery</h4>
              <Gallery images={c.gallery.slice(1)} />
            </div>
          )}
          {nextC && (
            <div className="case-next">
              <span className="nx-label">Next case</span>
              <a href={'case-study.html?project=' + next}>
                {nextC.title} <span className="it">— {nextC.sub.toLowerCase()}</span> →
              </a>
            </div>
          )}
        </div>
      </section>
      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta-eyebrow">
            <span className="paren-label">Have a similar problem?</span>
          </div>
          <h2 className="cta-big">Let's build<br/><span className="it">something good.</span></h2>
          <div className="cta-buttons">
            <a href="mailto:thakurvikas3311@gmail.com" className="btn primary">Email me <span className="arrow">↗</span></a>
            <a href="index.html#work" className="btn">See all work <span className="arrow">↗</span></a>
          </div>
        </div>
      </section>
      <footer>
        <div className="container">
          <div className="footer-mark">vikas <span className="it">thakur°</span></div>
          <div className="footer-bottom">
            <span>© 2026 Vikas Thakur. All rights reserved.</span>
            <span>Crafted with care · Chandigarh ↔ Worldwide</span>
          </div>
        </div>
      </footer>
    </>
  );
}

/* Read project slug from URL */
function getSlug() {
  const params = new URLSearchParams(location.search);
  return params.get('project') || (window.CASE_ORDER ? window.CASE_ORDER[0] : 'schoolpad');
}

function CaseApp() {
  const slug = getSlug();
  useEffectC(() => {
    document.title = (window.CASE_STUDIES[slug]?.title || 'Case study') + ' — Vikas Thakur';
    window.scrollTo(0, 0);
  }, [slug]);
  return (
    <>
      <ScrollProgressC />
      <NavLite />
      <main>
        <CaseStudyPage slug={slug} />
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CaseApp />);
