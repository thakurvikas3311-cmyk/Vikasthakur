/* Vikas Thakur portfolio — editorial design, React */
const { useState, useEffect, useRef } = React;

/* ── Loader ── */
function Loader() {
  const [count, setCount] = useState(0);
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    // Lock scroll while loader is up.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    let n = 0;
    const iv = setInterval(() => {
      n += Math.floor(Math.random() * 6 + 4);
      if (n >= 100) { n = 100; clearInterval(iv); }
      setCount(n);
    }, 38);
    const tHide = setTimeout(() => setHiding(true), 1800);
    const tGone = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = prev;
      document.body.classList.add('booted');
      // tell others (hero) to fire their entrance
      dispatchEvent(new Event('app:booted'));
    }, 2500);
    return () => {
      clearInterval(iv); clearTimeout(tHide); clearTimeout(tGone);
      document.body.style.overflow = prev;
    };
  }, []);
  if (gone) return null;
  return (
    <div className={'loader' + (hiding ? ' hide' : '')} aria-hidden="true">
      <div className="loader-inner">
        <div className="loader-mark">
          <span className="lm-v">V</span>
          <span className="lm-dot">·</span>
          <span className="lm-t">T</span>
          <span className="lm-reg">®</span>
        </div>
        <div className="loader-bar"><div className="loader-bar-fill" style={{width: count + '%'}}></div></div>
        <div className="loader-row">
          <span className="paren-label">Booting studio</span>
          <span className="loader-num">{String(count).padStart(3, '0')}</span>
        </div>
      </div>
      <div className="loader-curtain"></div>
    </div>
  );
}

/* ── Booted flag (true after Loader fires app:booted) ── */
function useBooted() {
  const [booted, setBooted] = useState(() => document.body.classList.contains('booted'));
  useEffect(() => {
    if (booted) return;
    const onBoot = () => setBooted(true);
    addEventListener('app:booted', onBoot);
    // Fallback: in case the Loader was never mounted (e.g. inner page),
    // boot after a frame.
    const t = setTimeout(() => setBooted(true), 60);
    return () => { removeEventListener('app:booted', onBoot); clearTimeout(t); };
  }, []);
  return booted;
}

/* ── Reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { setSeen(true); obs.disconnect(); }
    }), { threshold: .12, rootMargin: '0px 0px -60px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, seen ? 'in' : ''];
}

/* ── Split a string into per-character spans for staggered reveal ── */
function SplitChars({ text, baseDelay = 0, charDelay = 30, className = '', play = true }) {
  // Group whole words so they don't wrap mid-word.
  const words = text.split(/(\s+)/);
  let idx = 0;
  return (
    <span className={'splitchar ' + className + (play ? ' in' : '')}>
      {words.map((w, wi) => {
        if (/^\s+$/.test(w)) return <span key={'sp' + wi}>{w}</span>;
        return (
          <span key={'w' + wi} className="sc-word">
            {[...w].map((ch, ci) => {
              const d = baseDelay + idx * charDelay;
              idx++;
              return (
                <span key={ci} className="sc-char">
                  <span className="sc-inner" style={{ transitionDelay: d + 'ms' }}>{ch}</span>
                </span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

/* ── Magnetic hover (applied via attribute on .btn) ── */
function useMagneticButtons() {
  useEffect(() => {
    const btns = document.querySelectorAll('.btn, .project-corner, .service-icon');
    const handlers = [];
    btns.forEach(el => {
      const mv = e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.22;
        el.style.transform = `translate(${dx}px,${dy}px)`;
      };
      const ml = () => { el.style.transform = ''; };
      el.addEventListener('mousemove', mv);
      el.addEventListener('mouseleave', ml);
      handlers.push([el, mv, ml]);
    });
    return () => handlers.forEach(([el, mv, ml]) => {
      el.removeEventListener('mousemove', mv);
      el.removeEventListener('mouseleave', ml);
    });
  }, []);
}

/* ── Tilt + parallax on project covers ── */
function useProjectTilt() {
  useEffect(() => {
    const cards = document.querySelectorAll('.project');
    const handlers = [];
    cards.forEach(card => {
      const cover = card.querySelector('.project-cover');
      const img = card.querySelector('.cover-art');
      if (!cover || !img) return;
      const mv = e => {
        const r = cover.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        cover.style.transform = `translateY(-6px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg)`;
        img.style.transform = `scale(1.05) translate(${px * -14}px, ${py * -14}px)`;
      };
      const ml = () => { cover.style.transform = ''; img.style.transform = ''; };
      cover.addEventListener('mousemove', mv);
      cover.addEventListener('mouseleave', ml);
      handlers.push([cover, mv, ml]);
    });
    return () => handlers.forEach(([el, mv, ml]) => {
      el.removeEventListener('mousemove', mv);
      el.removeEventListener('mouseleave', ml);
    });
  }, []);
}

/* ── Scroll-driven parallax on hero wash ── */
function useHeroParallax() {
  useEffect(() => {
    const wash = document.querySelector('.hero-wash.one');
    if (!wash) return;
    let raf;
    const tick = () => {
      raf = null;
      const y = scrollY * 0.18;
      wash.style.transform = `translate3d(0, ${y}px, 0)`;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    addEventListener('scroll', onScroll, { passive: true });
    tick();
    return () => { removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);
}

/* ── Scroll progress ── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
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

/* ── Counter ── */
function Counter({ to, decimals = 0, suffix = '', seen }) {
  const [val, setVal] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (!seen || done.current) return;
    done.current = true;
    const start = performance.now(); const dur = 1400;
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(to * e);
      if (p < 1) requestAnimationFrame(step);
      else setVal(to);
    };
    requestAnimationFrame(step);
  }, [seen, to]);
  return <span>{val.toFixed(decimals)}{suffix}</span>;
}

/* ── NAV ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => removeEventListener('scroll', onScroll);
  }, []);
  const close = () => setOpen(false);
  return (
    <>
      <nav className={'nav' + (scrolled ? ' scrolled' : '')} aria-label="Primary">
        <div className="nav-inner">
          <a href="#" className="logo" aria-label="Home">
            <span className="logo-name">vikas</span>
            <span className="logo-mark">thakur°</span>
          </a>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="nav-status" aria-live="polite">
            <span className="status-dot"></span>
            <span>Open for work</span>
          </div>
          <button className={'menu-btn' + (open ? ' open' : '')} onClick={() => setOpen(o => !o)} aria-label="Toggle menu" aria-expanded={open}>
            <span></span>
          </button>
        </div>
      </nav>
      <div className={'mobile-menu' + (open ? ' open' : '')} aria-hidden={!open}>
        <a href="#work" onClick={close}>Work</a>
        <a href="#about" onClick={close}>About</a>
        <a href="#services" onClick={close}>Services</a>
        <a href="#contact" onClick={close}>Contact</a>
        <a href="mailto:thakurvikas3311@gmail.com">Email ↗</a>
        <a href="https://www.linkedin.com/in/vikas-thakur-80181122b/" target="_blank" rel="noopener">LinkedIn ↗</a>
      </div>
    </>
  );
}

/* ── HERO VARIANTS ── */
const HERO_VARIANTS = [
  { id: 'lanes',     label: 'Lanes' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'specimen',  label: 'Specimen' },
  { id: 'marquee',   label: 'Marquee' },
  { id: 'studio',    label: 'Studio' },
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'diptych',   label: 'Diptych' },
  { id: 'stamp',     label: 'Stamp' },
  { id: 'index',     label: 'Index' },
];

function useIstClock() {
  const [t, setT] = useState({ h: '--', m: '--', s: '--' });
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
      const h = String(ist.getHours()).padStart(2, '0');
      const m = String(ist.getMinutes()).padStart(2, '0');
      const s = String(ist.getSeconds()).padStart(2, '0');
      setT({ h, m, s });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return t;
}

function useRotatingWord(words, ms = 2400) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setI(p => (p + 1) % words.length), ms);
    return () => clearInterval(iv);
  }, [words.length, ms]);
  return [words[i], i];
}

function HeroSwitcher({ variant, setVariant }) {
  return (
    <div className="hero-switch" role="group" aria-label="Hero style">
      <span className="paren-label">Hero style</span>
      <div className="hero-switch-rail">
        {HERO_VARIANTS.map(v => (
          <button
            key={v.id}
            className={'hero-switch-btn' + (variant === v.id ? ' is-active' : '')}
            onClick={() => setVariant(v.id)}
            aria-pressed={variant === v.id}
          >{v.label}</button>
        ))}
      </div>
    </div>
  );
}

/* Variant 1 — Editorial (the existing giant stacked name) */
function HeroEditorial({ booted }) {
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">Portfolio · 2026</span>
        <span className="paren-label">Chandigarh, IN · GMT+5:30</span>
      </div>
      <h1 className={'hero-name ' + (booted ? 'play' : '')}>
        <SplitChars text="Vikas" baseDelay={120} charDelay={45} play={booted} />
        {' '}
        <span className="surname"><SplitChars text="Thakur" baseDelay={420} charDelay={50} play={booted} /><span className={'reg' + (booted ? ' in' : '')}>®</span></span>
      </h1>
      <div className={'hero-tagline-row reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '900ms' : '0ms'}}>
        <h2 className="hero-tagline">
          UI/UX designer crafting <span className="it">accessible,</span> system-scale digital products.
        </h2>
        <div className="hero-cta-col">
          <p>2.7+ years shipping end-to-end product work — research through design system delivery, in close partnership with engineering.</p>
          <div className="btn-row">
            <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
            <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
          </div>
        </div>
      </div>
    </>
  );
}

/* Variant 2 — Specimen (the name treated as a type-specimen plate) */
function HeroSpecimen({ booted }) {
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">Type specimen №2026</span>
        <span className="paren-label">№ 01 / 04 — Display</span>
      </div>
      <h1 className={'hero-name hero-name--specimen ' + (booted ? 'play' : '')}>
        <SplitChars text="Vikas" baseDelay={120} charDelay={45} play={booted} />
        {' '}
        <span className="surname"><SplitChars text="Thakur" baseDelay={420} charDelay={50} play={booted} /><span className={'reg' + (booted ? ' in' : '')}>®</span></span>
      </h1>
      <div className={'specimen-meta reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '950ms' : '0ms'}}>
        <div className="sp-cell">
          <span className="sp-k">_001 Family</span>
          <span className="sp-v">Bricolage Grotesque<br/><em className="it">Instrument Serif</em></span>
        </div>
        <div className="sp-cell">
          <span className="sp-k">_002 Weight</span>
          <span className="sp-v">500 Medium<br/><em className="it">400 Italic</em></span>
        </div>
        <div className="sp-cell">
          <span className="sp-k">_003 Set</span>
          <span className="sp-v">11 glyphs · 2 words<br/>ASCII basic Latin</span>
        </div>
        <div className="sp-cell">
          <span className="sp-k">_004 Use</span>
          <span className="sp-v">Display · Identity<br/>Hero · Wordmark</span>
        </div>
      </div>
      <div className={'hero-tagline-row reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '1150ms' : '0ms'}}>
        <h2 className="hero-tagline">
          UI/UX designer crafting <span className="it">accessible,</span> system-scale digital products.
        </h2>
        <div className="hero-cta-col">
          <p>2.7+ years shipping end-to-end product work — research through design system delivery, in close partnership with engineering.</p>
          <div className="btn-row">
            <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
            <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
          </div>
        </div>
      </div>
    </>
  );
}

/* Variant 3 — Marquee (the surname runs continuously) */
function HeroMarquee({ booted }) {
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">Portfolio · 2026</span>
        <span className="paren-label">Chandigarh, IN · GMT+5:30</span>
      </div>
      <h1 className={'hero-name hero-name--marquee ' + (booted ? 'play' : '')}>
        <span className="hm-first">
          <SplitChars text="Vikas" baseDelay={120} charDelay={50} play={booted} />
        </span>
        <span className="hm-marquee" aria-label="Thakur, Thakur, Thakur">
          <span className="hm-marquee-track">
            {Array.from({length: 6}).map((_, i) => (
              <span key={i} className="hm-mq-item">
                <span className="it">Thakur</span><span className="hm-mq-sep">✺</span>
              </span>
            ))}
          </span>
        </span>
      </h1>
      <div className={'hero-tagline-row reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '900ms' : '0ms'}}>
        <h2 className="hero-tagline">
          UI/UX designer crafting <span className="it">accessible,</span> system-scale digital products.
        </h2>
        <div className="hero-cta-col">
          <p>2.7+ years shipping end-to-end product work — research through design system delivery, in close partnership with engineering.</p>
          <div className="btn-row">
            <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
            <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
          </div>
        </div>
      </div>
    </>
  );
}

/* Variant 4 — Studio (smaller name + live dashboard panel) */
function HeroStudio({ booted }) {
  const clk = useIstClock();
  const disciplines = ['Interface Design', 'Design Systems', 'UX Research', 'Prototyping', 'Motion', 'Accessibility'];
  const [discipline] = useRotatingWord(disciplines, 2200);
  const focus = ['Schoolpad v3 → mobile parent module', 'Telos v2 → reflection prompts', 'New design system for SaaS ERP'];
  const [focusLine] = useRotatingWord(focus, 4400);
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">Studio · Chandigarh</span>
        <span className="paren-label">Now &amp; next · 2026</span>
      </div>

      <div className="hero-studio-grid">
        <div className={'hero-studio-name reveal ' + (booted ? 'in' : '')}>
          <h1 className={'hero-name hero-name--studio ' + (booted ? 'play' : '')}>
            <SplitChars text="Vikas" baseDelay={120} charDelay={45} play={booted} />
            <br/>
            <span className="surname"><SplitChars text="Thakur" baseDelay={420} charDelay={50} play={booted} /><span className={'reg' + (booted ? ' in' : '')}>®</span></span>
          </h1>
        </div>

        <div className={'hero-studio-panel reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '900ms' : '0ms'}}>
          <div className="hsp-row">
            <span className="hsp-k">Local time</span>
            <span className="hsp-v hsp-clock">
              <span>{clk.h}</span><span className="hsp-sep">:</span><span>{clk.m}</span><span className="hsp-sec">:{clk.s}</span>
              <span className="hsp-tz">IST · GMT+5:30</span>
            </span>
          </div>
          <div className="hsp-row">
            <span className="hsp-k">Focus today</span>
            <span className="hsp-v hsp-shift" key={focusLine}><em className="it">{focusLine}</em></span>
          </div>
          <div className="hsp-row">
            <span className="hsp-k">Discipline</span>
            <span className="hsp-v hsp-shift" key={discipline}>{discipline}</span>
          </div>
          <div className="hsp-row">
            <span className="hsp-k">Availability</span>
            <span className="hsp-v hsp-avail"><span className="status-dot"></span> Open · responds in &lt; 4h</span>
          </div>
          <div className="hsp-row">
            <span className="hsp-k">Coordinates</span>
            <span className="hsp-v">30.7333° N · 76.7794° E</span>
          </div>
        </div>
      </div>

      <div className={'hero-tagline-row reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '1100ms' : '0ms'}}>
        <h2 className="hero-tagline">
          UI/UX designer crafting <span className="it">accessible,</span> system-scale digital products.
        </h2>
        <div className="hero-cta-col">
          <p>2.7+ years shipping end-to-end product work — research through design system delivery, in close partnership with engineering.</p>
          <div className="btn-row">
            <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
            <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
          </div>
        </div>
      </div>
    </>
  );
}

/* Variant 5 — Manifesto (a single opening-of-essay paragraph) */
function HeroManifesto({ booted }) {
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">A short manifesto</span>
        <span className="paren-label">№ 05 / 08</span>
      </div>
      <div className={'hero-manifesto reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '300ms' : '0ms'}}>
        <p className="hm-prose">
          <span className="hm-hi">Hi <span className="hm-wave">✺</span></span>
          {' I\u2019m '}
          <span className="hm-name">
            <span className="hm-name-up">Vikas</span>
            {' '}
            <em className="it hm-name-it">Thakur<span className="reg">®</span></em>
          </span>
          {' \u2014 a UI/UX designer in Chandigarh, building '}
          <em className="it">accessible,</em> system-scale digital products with care for the small details that make them feel inevitable.
        </p>
      </div>
      <div className={'hero-manifesto-foot reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '800ms' : '0ms'}}>
        <div className="hmf-meta">
          <span className="paren-label">Currently · Code Brigade</span>
          <span className="paren-label">Available · 2026</span>
        </div>
        <div className="btn-row">
          <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
          <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
        </div>
      </div>
    </>
  );
}

/* Variant 6 — Diptych (split panel: meta column + name column) */
function HeroDiptych({ booted }) {
  const clk = useIstClock();
  return (
    <div className={'hero-diptych reveal ' + (booted ? 'in' : '')}>
      <div className="hd-left">
        <div className="hd-eyebrow">
          <span className="paren-label">Studio · No. 2026</span>
        </div>
        <div className="hd-rows">
          <div className="hd-row"><span className="hd-k">Designer</span><span className="hd-v">UI/UX · Product</span></div>
          <div className="hd-row"><span className="hd-k">Location</span><span className="hd-v">Chandigarh, IN</span></div>
          <div className="hd-row"><span className="hd-k">Local time</span><span className="hd-v hd-clock">{clk.h}:{clk.m}<span className="hd-tz">IST</span></span></div>
          <div className="hd-row"><span className="hd-k">Practice</span><span className="hd-v">Systems · Research · Delivery</span></div>
          <div className="hd-row"><span className="hd-k">Status</span><span className="hd-v hd-status"><span className="status-dot"></span>Open · 2026</span></div>
        </div>
        <div className="hd-foot">
          <a href="#work" className="btn primary">View work <span className="arrow">↓</span></a>
          <a href="#contact" className="btn">Talk <span className="arrow">↗</span></a>
        </div>
      </div>
      <div className="hd-right" aria-hidden="true">
        <span className="hd-corner-top">VT — 2026</span>
        <h1 className={'hero-name hero-name--diptych ' + (booted ? 'play' : '')}>
          <SplitChars text="Vikas" baseDelay={150} charDelay={50} play={booted} />
          <br/>
          <span className="surname"><SplitChars text="Thakur" baseDelay={420} charDelay={55} play={booted} /><span className={'reg' + (booted ? ' in' : '')}>®</span></span>
        </h1>
        <span className="hd-corner-bot">CRAFTED IN CHANDIGARH · INDIA</span>
      </div>
    </div>
  );
}

/* Variant 7 — Stamp (a circular passport-stamp around the name) */
function HeroStamp({ booted }) {
  const stampText = 'AVAILABLE \u00b7 2026 \u00b7 STUDIO \u00b7 CHANDIGARH \u00b7 ';
  const repeated = stampText.repeat(2);
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">Imprinted · 2026</span>
        <span className="paren-label">Edition № 07 / 08</span>
      </div>
      <div className="hero-stamp-wrap">
        <div className={'hero-stamp ' + (booted ? 'in' : '')}>
          <svg className="hs-svg" viewBox="0 0 400 400" aria-hidden="true">
            <defs>
              <path id="hsPath" d="M 200 200 m -158 0 a 158 158 0 1 1 316 0 a 158 158 0 1 1 -316 0" fill="none"/>
            </defs>
            <circle className="hs-ring hs-ring-out" cx="200" cy="200" r="190" />
            <circle className="hs-ring hs-ring-in"  cx="200" cy="200" r="172" />
            <text className="hs-arc" >
              <textPath href="#hsPath" startOffset="0">
                {repeated}
              </textPath>
            </text>
            <text x="200" y="60"  className="hs-star" textAnchor="middle">✺</text>
            <text x="200" y="350" className="hs-star" textAnchor="middle">✺</text>
            <text x="60"  y="208" className="hs-star" textAnchor="middle">✺</text>
            <text x="340" y="208" className="hs-star" textAnchor="middle">✺</text>
          </svg>
          <div className="hs-center">
            <span className="hs-line-top">— studio of —</span>
            <h1 className={'hero-name hero-name--stamp ' + (booted ? 'play' : '')}>
              <SplitChars text="Vikas" baseDelay={180} charDelay={55} play={booted} />
              <br/>
              <span className="surname"><SplitChars text="Thakur" baseDelay={450} charDelay={60} play={booted} /></span>
            </h1>
            <span className="hs-line-bot">est'd 2023 · chandigarh</span>
          </div>
        </div>
      </div>
      <div className={'hero-tagline-row reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '1100ms' : '0ms'}}>
        <h2 className="hero-tagline">
          UI/UX designer crafting <span className="it">accessible,</span> system-scale digital products.
        </h2>
        <div className="hero-cta-col">
          <p>2.7+ years shipping end-to-end product work — research through design system delivery, in close partnership with engineering.</p>
          <div className="btn-row">
            <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
            <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
          </div>
        </div>
      </div>
    </>
  );
}

/* Variant 8 — Index (a book-style index treatment) */
function HeroIndex({ booted }) {
  const entries = [
    ['001', 'Vikas',     'noun \u00b7 given name',         '/ðα\u02d0\u02ccvi\u02d0kα\u02d0s/'],
    ['002', 'Thakur®',   'proper noun \u00b7 surname',     'family · trade'],
    ['003', 'designer',  'occupation \u00b7 ui/ux',         '~ 2.7+ years'],
    ['004', 'studio',    'location \u00b7 chandigarh, in', 'gmt + 5:30'],
    ['005', 'available', 'state \u00b7 open for work',     '2026 \u2014'],
  ];
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">An index, of sorts</span>
        <span className="paren-label">№ 08 / 08</span>
      </div>
      <div className="hero-index">
        <h1 className={'hero-name hero-name--index ' + (booted ? 'play' : '')}>
          <SplitChars text="Index" baseDelay={120} charDelay={50} play={booted} />
          <em className="it"> &amp; </em>
          <SplitChars text="Almanac" baseDelay={400} charDelay={55} play={booted} />
        </h1>
        <ol className="hi-list">
          {entries.map((e, i) => {
            const [r, c] = useReveal();
            return (
              <li ref={r} key={e[0]} className={'hi-row reveal ' + c} style={{transitionDelay: (i * 80 + 500) + 'ms'}}>
                <span className="hi-num">{e[0]}</span>
                <span className="hi-term">{e[1]}</span>
                <span className="hi-leader" aria-hidden="true"></span>
                <span className="hi-def">{e[2]}</span>
                <span className="hi-note"><em className="it">{e[3]}</em></span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className={'hero-tagline-row reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '1100ms' : '0ms'}}>
        <h2 className="hero-tagline">
          UI/UX designer crafting <span className="it">accessible,</span> system-scale digital products.
        </h2>
        <div className="hero-cta-col">
          <p>2.7+ years shipping end-to-end product work — research through design system delivery, in close partnership with engineering.</p>
          <div className="btn-row">
            <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
            <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
          </div>
        </div>
      </div>
    </>
  );
}

/* Variant 9 — Lanes (giant stacked wordmark + thumbnail marquee strip) */
function HeroLanes({ booted }) {
  const projects = window.PROJECTS || [];
  // doubled so the marquee track loops seamlessly
  const reel = [...projects, ...projects];
  return (
    <>
      <div className={'hero-eyebrow reveal ' + (booted ? 'in' : '')}>
        <span className="paren-label">Studio · Vikas Thakur®</span>
        <span className="paren-label">Chandigarh · 2026</span>
      </div>

      <div className={'hero-lanes-mark ' + (booted ? 'in' : '')} aria-label="Vikas Thakur">
        <div className="hl-stack hl-stack-main">
          {[0, 1, 2].map(i => (
            <span key={i} className="hl-row" style={{transitionDelay: (i * 90 + 120) + 'ms'}}>
              <SplitChars text="THAKUR" baseDelay={i * 90 + 180} charDelay={42} play={booted} />
            </span>
          ))}
        </div>
        <div className="hl-stack hl-stack-reg" aria-hidden="true">
          {[0, 1, 2].map(i => (
            <span key={i} className="hl-reg" style={{transitionDelay: (i * 90 + 360) + 'ms'}}>®</span>
          ))}
        </div>
      </div>

      <div className={'hero-lanes-headline reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '700ms' : '0ms'}}>
        <h2>I'm <em className="it">Vikas Thakur®</em> — a UI/UX designer based in <em className="it">Chandigarh.</em></h2>
      </div>

      <div className={'hero-lanes-reel ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '900ms' : '0ms'}} aria-label="Selected work">
        <div className="hl-reel-track">
          {reel.map((p, i) => (
            <a key={i} href={'case-study.html?project=' + p.slug} className="hl-thumb" aria-label={p.title}>
              <img src={p.img} alt={p.title} loading="lazy" />
              <span className="hl-thumb-label">{String((i % projects.length) + 1).padStart(2, '0')} · {p.title}</span>
            </a>
          ))}
        </div>
      </div>

      <div className={'hero-lanes-foot reveal ' + (booted ? 'in' : '')} style={{transitionDelay: booted ? '1100ms' : '0ms'}}>
        <p>2.7+ years shipping end-to-end product work — research through design system delivery, in close partnership with engineering.</p>
        <div className="btn-row">
          <a href="#work" className="btn primary">See selected work <span className="arrow">↓</span></a>
          <a href="#contact" className="btn">Get in touch <span className="arrow">↗</span></a>
        </div>
      </div>
    </>
  );
}

/* ── HERO ── */
function Hero() {
  const booted = useBooted();
  return (
    <section className="hero">
      <div className="hero-wash one" aria-hidden="true"></div>
      <div className="container">
        <HeroEditorial booted={booted} />
      </div>
      <Marquee />
    </section>
  );
}

/* ── MARQUEE ── */
function Marquee() {
  const items = [
    { text: 'Interface Design', it: false },
    { text: 'User Research', it: true },
    { text: 'Design Systems', it: false },
    { text: 'Prototyping', it: true },
    { text: 'Accessibility', it: false },
    { text: 'Motion', it: true },
  ];
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((it, i) => (
          <span key={i} className={'marquee-item' + (it.it ? ' it' : '')}>
            {it.text} <span className="marquee-sep">✺</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── WORK GRID ── */
function ProjectCard({ p, year, index }) {
  const [r, c] = useReveal();
  return (
    <a ref={r} className={'project reveal ' + c} style={{transitionDelay: ((index % 2) * 80) + 'ms'}} href={'case-study.html?project=' + p.slug}>
      <div className="project-cover">
        <span className="project-tag">{p.tags[0]}</span>
        <span className="project-corner">↗</span>
        <img className="cover-art" src={p.img} alt={p.title} loading="lazy" style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
      </div>
      <div className="project-info">
        <h3>{p.title} <span className="it">— {p.sub.split(' ').slice(0, 2).join(' ').toLowerCase()}</span></h3>
        <span className="project-meta">{year}</span>
      </div>
      <p className="project-summary">{p.desc}</p>
    </a>
  );
}

function Work() {
  const projects = window.PROJECTS;
  const years = ['2024','2024','2024','2024','2024','2023','2023','2023','2023','2023','2023','2023','2023','2023','2023','2022','2022','2022','2022','2022','2022'];
  useProjectTilt();
  return (
    <section id="work">
      <div className="container">
        <div className="sec-intro">
          <span className="paren-label">Selected work · 2022 – 2026</span>
          <div>
            <h2>{projects.length} projects I'm <span className="it">proud</span> to put my name on.</h2>
            <p>End-to-end work spanning university web, alumni platforms, blockchain credentials, SaaS ERP, mobile apps, fintech, healthcare, and educational decision tools.</p>
          </div>
        </div>
        <div className="work-grid">
          {projects.map((p, i) => <ProjectCard key={p.slug} p={p} year={years[i] || '2023'} index={i} />)}
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop:'var(--s-5)'}}>
          <a href="#contact" className="btn">Discuss your project <span className="arrow">↗</span></a>
        </div>
      </div>
    </section>
  );
}

/* ── ABOUT (dark) ── */
function About() {
  const [statRef, statSeen] = useReveal();
  return (
    <section id="about" className="about">
      <div className="about-wordmark" aria-hidden="true">THAKUR®</div>
      <div className="container">
        <div className="about-eyebrow">
          <span className="paren-label">About</span>
        </div>
        <div className="about-grid">
          <h2>I design with care for the <span className="it">small details</span> that make products feel right.</h2>
          <p className="about-lead">
            Creative and detail-oriented UI/UX Designer with 2.7+ years in user interface design, experience strategy, and responsive design. I build products end-to-end — from research and wireframes through to polished, system-scale delivery — shipping iteratively in Agile sprints with engineering and product teams.
          </p>
        </div>
        <div ref={statRef} className="about-stats">
          <div className="stat">
            <span className="stat-num"><Counter to={2.7} decimals={1} suffix="+" seen={!!statSeen}/></span>
            <span className="stat-label">Years designing</span>
          </div>
          <div className="stat">
            <span className="stat-num"><Counter to={window.PROJECTS.length} seen={!!statSeen}/></span>
            <span className="stat-label">Featured case studies</span>
          </div>
          <div className="stat">
            <span className="stat-num"><Counter to={100} suffix="K+" seen={!!statSeen}/></span>
            <span className="stat-label">Users reached</span>
          </div>
        </div>
        <div className="resume-block">
          <h4>Experience</h4>
          <div className="resume-row">
            <span className="resume-when">2023<br/>Present</span>
            <div>
              <div className="resume-role">UI / UX Designer</div>
              <div className="resume-where">Code Brigade — End-to-end UI for web and mobile products. Built a scalable design system in Figma, ran research and stakeholder workshops, shipped iteratively in Agile.</div>
            </div>
          </div>
        </div>
        <div className="resume-block">
          <h4>Education</h4>
          <div className="resume-row">
            <span className="resume-when">2021<br/>2023</span>
            <div>
              <div className="resume-role">Master's in UX/UI Design</div>
              <div className="resume-where">Chitkara University, Rajpura — School of Design</div>
            </div>
          </div>
          <div className="resume-row">
            <span className="resume-when">2019<br/>2021</span>
            <div>
              <div className="resume-role">Bachelor of Arts</div>
              <div className="resume-where">DAV College, Chandigarh — Sector 10</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SERVICES ── */
function ServiceRow({ row, index }) {
  const [r, c] = useReveal();
  const [n, a, b, desc] = row;
  return (
    <div ref={r} className={'service-row reveal ' + c} style={{transitionDelay: (index * 90) + 'ms'}}>
      <span className="service-num">{n}</span>
      <h3 className="service-name">{a}<span className="it">{b}</span></h3>
      <p className="service-desc">{desc}</p>
      <span className="service-icon">↗</span>
    </div>
  );
}

function Services() {
  const rows = [
    ['_001', 'UI & ', 'Interaction', 'Polished, responsive interfaces with care for micro-detail, accessibility, and consistency across breakpoints.'],
    ['_002', 'UX ', 'Strategy', 'Research, journey mapping, wireframes, and prototypes — shaping flows before any high-fidelity pixel.'],
    ['_003', 'Systems & ', 'Delivery', 'Scalable design systems and dev-ready handoff that cut inconsistencies and keep teams shipping.'],
  ];
  const tools = ['Figma', 'Framer', 'Webflow', 'Adobe Premiere Pro', 'Claude AI', 'Google Stitch'];
  return (
    <section id="services">
      <div className="container">
        <div className="sec-intro">
          <span className="paren-label">Services</span>
          <div>
            <h2>Strategy, design and <span className="it">delivery</span> — under one roof.</h2>
            <p>Three disciplines I bring to every project, from first sketch through engineering handoff.</p>
          </div>
        </div>
        <div className="services-list">
          {rows.map((r, i) => <ServiceRow key={r[0]} row={r} index={i} />)}
        </div>
        <div className="tools-block">
          <span className="paren-label">Tools I use daily</span>
          <div className="tools-list">
            {tools.map((t, i) => {
              const [r, c] = useReveal();
              return <span ref={r} key={t} className={'tool-chip reveal ' + c} style={{transitionDelay: (i * 60) + 'ms'}}>{t}</span>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── PROCESS ── */
function ProcessCard({ card, index }) {
  const [r, c] = useReveal();
  const [num, title, desc] = card;
  return (
    <div ref={r} className={'process-card reveal ' + c} style={{transitionDelay: (index * 120) + 'ms'}}>
      <div className="process-num">{num}</div>
      <div className="process-title">{title}</div>
      <p>{desc}</p>
    </div>
  );
}

function Process() {
  const cards = [
    ['/ 01', <>Research<br/>&amp; Frame</>, 'User interviews, journey mapping, and stakeholder workshops to surface real needs before any UI is drawn.'],
    ['/ 02', <>Design<br/>&amp; Iterate</>, 'Wireframes evolve into high-fidelity, system-backed UI — tested, refined, ready for engineering.'],
    ['/ 03', <>Ship<br/>&amp; Measure</>, 'Hands-on dev handoff, QA, and post-launch tuning to make sure the work performs in the wild.'],
  ];
  return (
    <section className="process">
      <div className="container">
        <div className="sec-intro">
          <span className="paren-label">Method</span>
          <div>
            <h2>How I <span className="it">work</span>, from kickoff to launch.</h2>
            <p>A repeatable, collaborative path that turns brief into shipped product.</p>
          </div>
        </div>
        <div className="process-grid">
          {cards.map((c, i) => <ProcessCard key={i} card={c} index={i} />)}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIAL ── */
function Testimonial() {
  const [r, c] = useReveal();
  return (
    <section className="testimonial">
      <div className="container">
        <div ref={r} className={'reveal ' + c}>
          <div className="testimonial-mark">"</div>
          <blockquote>
            Vikas brings <span className="it">rare clarity</span> to complex products — and the patience to ship the small details that make them feel inevitable.
          </blockquote>
          <cite>— Personal design principle</cite>
        </div>
      </div>
    </section>
  );
}

/* ── FAQ ── */
function FAQ() {
  const qa = [
    ['What kind of projects are you looking for?', 'Full-time UI/UX roles at product-led teams, plus selected freelance work — usually web/mobile product design, design systems, or end-to-end feature work. I love problems where research actually shapes the solution.'],
    ['What does your design process look like?', 'Research → frame the problem → wireframe → iterate in high-fidelity → ship and measure. Lots of stakeholder workshops up front, then close engineering collaboration through delivery. Agile sprints, weekly demos.'],
    ['How fast can you start?', 'For freelance work, I can usually scope and start within 1–2 weeks. For full-time roles, I\u2019d want a proper conversation about fit and team first.'],
    ['Do you do remote work?', 'Yes — I\u2019m based in Chandigarh (GMT+5:30) and work with teams worldwide. Daily standups, async-first documentation, and live design reviews when needed.'],
    ['What tools do you work in?', 'Figma is home — for design, prototyping, and design systems. Framer and Webflow for production builds. Premiere Pro for motion. I also lean on AI tools for ideation and acceleration.'],
  ];
  const [open, setOpen] = useState(-1);
  return (
    <section>
      <div className="container">
        <div className="sec-intro">
          <span className="paren-label">FAQ</span>
          <div>
            <h2>The <span className="it">honest</span> answers, upfront.</h2>
            <p>What working with me looks like in practice.</p>
          </div>
        </div>
        <div className="faq-list">
          {qa.map(([q, a], i) => (
            <div key={i} className={'faq-row' + (open === i ? ' open' : '')}>
              <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{q}</span>
                <span className="faq-icon" aria-hidden="true"></span>
              </button>
              <div className="faq-a">
                <div className="faq-a-inner">{a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTA() {
  return (
    <section id="contact" className="cta">
      <div className="container">
        <div className="cta-eyebrow">
          <span className="paren-label">Let's talk</span>
        </div>
        <h2 className="cta-big">
          Let's build<br/><span className="it">something good.</span>
        </h2>
        <div className="cta-buttons">
          <a href="mailto:thakurvikas3311@gmail.com?subject=Let's%20work%20together" className="btn primary">
            Email me <span className="arrow">↗</span>
          </a>
          <a href="https://www.linkedin.com/in/vikas-thakur-80181122b/" target="_blank" rel="noopener" className="btn">
            LinkedIn <span className="arrow">↗</span>
          </a>
        </div>
        <div className="reply-pill">
          <span className="reply-dot"></span>
          <span>Usually replies in <strong>under 4 hours</strong></span>
        </div>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function FooterBar() {
  return (
    <footer>
      <div className="container">
        <div className="footer-mark">vikas <span className="it">thakur°</span></div>
        <div className="footer-grid">
          <div>
            <h5>Studio</h5>
            <p>UI/UX designer based in Chandigarh, India. Currently shipping end-to-end product work at Code Brigade — and open for full-time roles &amp; select freelance.</p>
          </div>
          <div>
            <h5>Site</h5>
            <ul>
              <li><a href="#work">Work</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h5>Elsewhere</h5>
            <ul>
              <li><a href="https://www.linkedin.com/in/vikas-thakur-80181122b/" target="_blank" rel="noopener">LinkedIn ↗</a></li>
              <li><a href="#work">Case studies</a></li>
              <li><a href="mailto:thakurvikas3311@gmail.com">Email ↗</a></li>
            </ul>
          </div>
          <div>
            <h5>Studio</h5>
            <p style={{marginTop:'0.6rem'}}>UI/UX designer based in Chandigarh, India. Currently shipping at Code Brigade — open for select roles &amp; freelance.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Vikas Thakur. All rights reserved.</span>
          <span>Crafted with care · Chandigarh ↔ Worldwide</span>
        </div>
      </div>
    </footer>
  );
}

/* Scroll to #section after React mounts (loader delays native hash jump). */
function useHashScroll() {
  useEffect(() => {
    const scroll = () => {
      const id = location.hash.replace(/^#/, '');
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return false;
      const top = el.getBoundingClientRect().top + scrollY - 72;
      scrollTo({ top, behavior: 'smooth' });
      return true;
    };
    const onBoot = () => setTimeout(scroll, 120);
    if (document.body.classList.contains('booted')) setTimeout(scroll, 120);
    else addEventListener('app:booted', onBoot, { once: true });
    let tries = 0;
    const iv = setInterval(() => {
      if (scroll() || ++tries > 50) clearInterval(iv);
    }, 100);
    addEventListener('hashchange', scroll);
    return () => {
      clearInterval(iv);
      removeEventListener('app:booted', onBoot);
      removeEventListener('hashchange', scroll);
    };
  }, []);
}

/* ── APP ── */
function App() {
  useMagneticButtons();
  useHeroParallax();
  useHashScroll();
  return (
    <>
      <Loader />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Services />
        <Process />
        <Testimonial />
        <FAQ />
        <CTA />
      </main>
      <FooterBar />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
