// ============================================
// ANKIT GUPTA PORTFOLIO — INTERACTIVE ENGINE
// Semiconductor Process Flow · Silicon to Software
// ============================================

function initSectionParity() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cmds = ['run_test --coverage 99 --link L0', 'check_coverage -> 86-99% PASS', 'report_bugs -> 20+ closed', 'tape_out -> L0 LOCKED', 'cd ~/builder && npm run ship'];
  const typer = document.getElementById('typer-text');
  const replay = document.getElementById('typer-replay');
  let ci = 0, charI = (cmds[0] || '').length, deleting = true, timer = null;
  function tickTyper() {
    if (!typer) return;
    if (deleting) { charI--; typer.textContent = cmds[ci].slice(0, Math.max(0, charI)) || '...'; if (charI <= 0) { deleting = false; ci = (ci + 1) % cmds.length; charI = 0; } }
    else { charI++; typer.textContent = cmds[ci].slice(0, charI); if (charI >= cmds[ci].length) { deleting = true; timer = setTimeout(tickTyper, 1600); return; } }
    timer = setTimeout(tickTyper, deleting ? 28 : 55);
  }
  if (typer && !reduced) { timer = setTimeout(tickTyper, 1800); }
  if (replay) replay.addEventListener('click', () => { if (timer) clearTimeout(timer); ci = 0; charI = 0; deleting = false; tickTyper(); });
  document.querySelectorAll('.about-state').forEach(b => b.addEventListener('click', () => {
    const t = document.querySelector(b.dataset.goto); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }));
  const expBtns = document.querySelectorAll('.exp-filter');
  expBtns.forEach(b => b.addEventListener('click', () => {
    expBtns.forEach(x => x.classList.remove('active')); b.classList.add('active');
    const f = b.dataset.expFilter;
    if (f === 'saas') { const t = document.getElementById('indie-projects'); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); return; }
    document.querySelectorAll('#exp-track .h-card').forEach(c => { c.classList.toggle('dim', !(f === 'all' || c.dataset.exp === f)); });
  }));
  function wireFilter(btnSel, trackSel, attr, key) {
    const btns = document.querySelectorAll(btnSel);
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.classList.remove('active')); b.classList.add('active');
      const f = b.dataset[key];
      document.querySelectorAll(trackSel + ' .h-card').forEach(c => {
        const v = c.getAttribute(attr);
        c.classList.toggle('dim', !(f === 'all' || v === f));
      });
    }));
  }
  wireFilter('[data-proj-filter]', '#dv-proj-track', 'data-proj', 'projFilter');
  wireFilter('[data-indie-filter]', '#indie-track', 'data-indie', 'indieFilter');

  // College BOOT-ROM chapter tabs
  const cTabs = document.querySelectorAll('.college-tab');
  cTabs.forEach(t => t.addEventListener('click', () => {
    cTabs.forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
    t.classList.add('active'); t.setAttribute('aria-selected', 'true');
    document.querySelectorAll('.college-panel').forEach(p => {
      p.classList.toggle('active', p.dataset.collegePanel === t.dataset.collegeTab);
    });
  }));
  document.querySelectorAll('[data-lab-stage]').forEach(a => a.addEventListener('click', () => {
    const stage = a.dataset.labStage;
    setTimeout(() => { const btn = document.querySelector('.lab-stage[data-stage=\"' + stage + '\"]'); if (btn) btn.click(); }, 450);
  }));
  const copyBtn = document.getElementById('copy-email');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(copyBtn.dataset.email); copyBtn.textContent = 'copied ok'; }
    catch (e) { copyBtn.textContent = copyBtn.dataset.email; }
    setTimeout(() => { copyBtn.textContent = 'copy email'; }, 1800);
  });
  document.querySelectorAll('[data-divider]').forEach(cv => {
    const cx = cv.getContext('2d'); let x = 0, raf = 0, visible = true;
    function size() { const w = cv.parentElement.clientWidth - 40; cv.width = Math.max(280, Math.min(900, w)); cv.height = 44; }
    size(); window.addEventListener('resize', size);
    function draw() {
      if (!visible) return;
      cx.clearRect(0, 0, cv.width, cv.height);
      cx.strokeStyle = 'rgba(0,255,136,.55)'; cx.lineWidth = 1.5; cx.beginPath();
      const mid = cv.height / 2;
      for (let px = 0; px < cv.width; px += 4) {
        const sq = ((px + x) % 32) < 16 ? -10 : 10;
        const y = mid + sq * Math.sin(px * 0.02);
        if (px === 0) cx.moveTo(px, y); else cx.lineTo(px, y);
      }
      cx.stroke();
      if (!reduced) { x += 1.5; raf = requestAnimationFrame(draw); }
    }
    new IntersectionObserver(en => { visible = en[0].isIntersecting; if (visible) { cancelAnimationFrame(raf); draw(); } else cancelAnimationFrame(raf); }, { threshold: 0 }).observe(cv);
    draw();
  });
  const navLinks = document.querySelectorAll('.nav-links a[href^=\"#\"]');
  const secs = ['hero', 'about', 'experience', 'skills', 'dv-projects', 'indie-projects', 'the-loop', 'college', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObs = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('nav-active', a.getAttribute('href') === '#' + en.target.id)); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    secs.forEach(s => navObs.observe(s));
  }
}

function initAboutStoryboard() {
  const track = document.getElementById('sb-track');
  if (!track) return;

  const steps = document.querySelectorAll('.sb-step');
  const cards = track.querySelectorAll('.sb-card');
  const dots = document.querySelectorAll('.sb-hud-dot');
  const phaseEl = document.getElementById('sb-hud-phase');
  const prevBtn = document.getElementById('sb-prev');
  const nextBtn = document.getElementById('sb-next');
  const jumpLinks = track.querySelectorAll('.sb-jump-link');

  const phaseNames = [
    'STAGE 01 // BOOT · VIIT PUNE',
    'STAGE 02 // VERIFY · CHELSIO DV',
    'STAGE 03 // SHIP · INDIE BUILDER'
  ];
  const phaseColors = [
    'var(--accent-silicon)',
    'var(--accent-dv)',
    'var(--accent-builder)'
  ];

  let activeIndex = 0;
  let isProgrammaticScroll = false;
  let scrollTimeout = null;

  function syncUI(idx) {
    activeIndex = Math.max(0, Math.min(cards.length - 1, idx));

    steps.forEach((step, i) => {
      const isActive = i === activeIndex;
      step.classList.toggle('active', isActive);
      step.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    cards.forEach((card, i) => {
      card.classList.toggle('active', i === activeIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });

    if (phaseEl) {
      phaseEl.textContent = phaseNames[activeIndex] || `STAGE 0${activeIndex + 1}`;
      phaseEl.style.color = phaseColors[activeIndex] || 'var(--accent-silicon)';
    }

    if (prevBtn) prevBtn.disabled = activeIndex === 0;
    if (nextBtn) nextBtn.disabled = activeIndex === cards.length - 1;
  }

  function scrollToCard(idx) {
    if (idx < 0 || idx >= cards.length) return;
    const targetCard = cards[idx];
    if (!targetCard) return;

    isProgrammaticScroll = true;
    syncUI(idx);

    track.scrollTo({
      left: targetCard.offsetLeft - track.offsetLeft,
      behavior: 'smooth'
    });

    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isProgrammaticScroll = false;
    }, 450);
  }

  // Stepper tab click
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const idx = parseInt(step.dataset.storyIdx, 10);
      if (!isNaN(idx)) scrollToCard(idx);
    });
  });

  // HUD dots click
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.storyIdx, 10);
      if (!isNaN(idx)) scrollToCard(idx);
    });
  });

  // Prev / Next buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollToCard(activeIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollToCard(activeIndex + 1);
    });
  }

  // Keyboard navigation on track
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToCard(activeIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToCard(activeIndex - 1);
    }
  });

  // Track scroll synchronization for touch swipes / trackpad
  let ticking = false;
  track.addEventListener('scroll', () => {
    if (isProgrammaticScroll) return;
    if (!ticking) {
      requestAnimationFrame(() => {
        const trackCenter = track.scrollLeft + track.clientWidth / 2;
        let closestIdx = 0;
        let minDiff = Infinity;

        cards.forEach((card, i) => {
          const cardCenter = (card.offsetLeft - track.offsetLeft) + card.clientWidth / 2;
          const diff = Math.abs(trackCenter - cardCenter);
          if (diff < minDiff) {
            minDiff = diff;
            closestIdx = i;
          }
        });

        if (closestIdx !== activeIndex) {
          syncUI(closestIdx);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Handle smooth scroll for jump links in cards
  jumpLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Sync to journey switcher if user switches journey mode
  const journeyWatcher = new MutationObserver(() => {
    const journey = document.body.dataset.journey;
    if (journey === 'dv') {
      scrollToCard(1);
    } else if (journey === 'indie') {
      scrollToCard(2);
    } else if (journey === 'full') {
      scrollToCard(0);
    }
  });
  journeyWatcher.observe(document.body, { attributes: true, attributeFilter: ['data-journey'] });

  // Initialize first state
  syncUI(0);
}

document.addEventListener('DOMContentLoaded', () => {
  initSectionParity();
  initAboutStoryboard();

  // ============================================
  // 1. CIRCUIT BOARD CANVAS BACKGROUND
  // ============================================
  const canvas = document.getElementById('circuit-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let mouse = { x: -1000, y: -1000 };
    let animId;
    let lastFrame = 0;
    const FRAME_GAP = 1000 / 30; // 30fps is plenty for ambient bg

    function resizeCanvas() {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const w = canvas.parentElement.offsetWidth;
      const h = canvas.parentElement.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas._cssW = w; canvas._cssH = h;
      initNodes();
    }

    function initNodes() {
      nodes = [];
      const w = canvas._cssW || canvas.parentElement.offsetWidth;
      const h = canvas._cssH || canvas.parentElement.offsetHeight;
      const gap = w < 768 ? 110 : 90; // fewer nodes on mobile
      const cols = Math.floor(w / gap);
      const rows = Math.floor(h / gap);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          nodes.push({
            x: i * gap + 40 + (Math.random() - 0.5) * 20,
            y: j * gap + 40 + (Math.random() - 0.5) * 20,
            baseAlpha: 0.08 + Math.random() * 0.07,
            alpha: 0.08,
            size: 1.5 + Math.random() * 1.5,
            pulse: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function drawCircuit(now) {
      animId = requestAnimationFrame(drawCircuit);
      if (now - lastFrame < FRAME_GAP) return; // throttle
      lastFrame = now;
      const W = canvas._cssW, H = canvas._cssH;
      ctx.clearRect(0, 0, W, H);
      const t = now * 0.001;
      // Precompute mouse glow per node; traces use cheap Manhattan links
      const R2 = 120 * 120;
      for (const n of nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const proximity = d2 < 40000 ? Math.max(0, 1 - Math.sqrt(d2) / 200) : 0;
        n.alpha = n.baseAlpha + proximity * 0.5 + Math.sin(t + n.pulse) * 0.03;
        n._prox = proximity;
      }
      ctx.lineWidth = 0.5;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          if (dx > 120 || dx < -120) continue;
          const dy = a.y - b.y;
          if (dy > 120 || dy < -120) continue;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (a.alpha > b.alpha ? a.alpha : b.alpha) * (1 - dist / 120) * 0.5;
            if (alpha < 0.02) continue;
            ctx.strokeStyle = `rgba(0, 255, 136, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            const mx = (a.x + b.x) / 2;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mx, a.y);
            ctx.lineTo(mx, b.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const proximity = n._prox || 0;

        ctx.fillStyle = `rgba(0, 255, 136, ${n.alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size + proximity * 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow for nearby nodes
        if (proximity > 0.3) {
          ctx.fillStyle = `rgba(0, 255, 136, ${(proximity * 0.15).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size + proximity * 8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.x = -1000; mouse.y = -1000;
    });

    resizeCanvas();
    drawCircuit(performance.now());
    let resizeT;
    window.addEventListener('resize', () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        cancelAnimationFrame(animId);
        resizeCanvas();
        drawCircuit(performance.now());
      }, 200);
    });

    // Pause canvas when not visible
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        cancelAnimationFrame(animId);
        animId = null;
      } else if (!animId) {
        drawCircuit(performance.now());
      }
    }, { threshold: 0 });
    heroObserver.observe(canvas.parentElement);
    // Stop ambient anim after hero leaves once on low-end / mobile
    if (window.matchMedia('(max-width: 768px)').matches) {
      setTimeout(() => { if (!document.getElementById('hero-main')?.classList.contains('revealed')) return; }, 0);
    }
  }

  // ============================================
  // 2. TERMINAL TYPEWRITER BOOT SEQUENCE — FAST (~1.4s)
  // ============================================
  const terminalOutput = document.getElementById('terminal-output');
  const terminalWindow = document.getElementById('terminal');
  const heroMain = document.getElementById('hero-main');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const bootLines = [
    { text: '> SILICON_PIPELINE v4.0 initialized', cls: '' },
    { text: '> Engineer: Ankit Gupta · Chelsio Bangalore', cls: 't-highlight' },
    { text: '> PCIe Gen5 · UVM · 4+ yrs DV · 2 patents', cls: '' },
    { text: '> Status: READY', cls: 't-highlight' },
  ];

  function revealHero() {
    if (!terminalWindow || !heroMain || heroMain.classList.contains('revealed')) return;
    terminalWindow.classList.add('hidden');
    heroMain.classList.add('revealed');
    const heroEls = heroMain.querySelectorAll('.hero-stagger');
    heroEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 55 + 50);
    });
  }

  if (terminalOutput && terminalWindow && heroMain) {
    if (reducedMotion) {
      terminalWindow.classList.add('hidden');
      heroMain.classList.add('revealed');
      heroMain.querySelectorAll('.hero-stagger').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
    } else {
      // Click / tap anywhere on terminal skips boot
      terminalWindow.addEventListener('click', revealHero);
      setTimeout(revealHero, 2600); // hard fallback: never trap user
      let lineIdx = 0;
      let charIdx = 0;
      let currentEl = null;
      function typeLine() {
        if (!document.body.contains(terminalOutput)) { revealHero(); return; }
        if (heroMain.classList.contains('revealed')) return;
        if (lineIdx >= bootLines.length) {
          const cursor = document.createElement('span');
          cursor.className = 't-cursor';
          terminalOutput.appendChild(cursor);
          setTimeout(revealHero, 300);
          return;
        }
        const line = bootLines[lineIdx];
        if (charIdx === 0) {
          currentEl = document.createElement('div');
          currentEl.className = 't-line ' + line.cls;
          terminalOutput.appendChild(currentEl);
        }
        currentEl.textContent = line.text.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx >= line.text.length) {
          lineIdx++;
          charIdx = 0;
          setTimeout(typeLine, 65);
        } else {
          setTimeout(typeLine, 7 + Math.random() * 8);
        }
      }
      setTimeout(typeLine, 150);
    }
  } else if (heroMain) {
    heroMain.classList.add('revealed');
  }

  // ============================================
  // 3. SCROLL PROGRESS BAR
  // ============================================
  const progressBar = document.getElementById('progress-bar');
  const nav = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + '%';

    if (nav) {
      if (scrollTop > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // ============================================
  // 4. PROCESS PIPELINE TRACKER
  // ============================================
  const pipeline = document.getElementById('process-pipeline');
  const pipeNodes = document.querySelectorAll('.pipeline-node');
  const pipeConnectors = document.querySelectorAll('.pipeline-connector');
  const sections = [
    'hero', 'about', 'experience', 'skills',
    'dv-projects', 'bridge', 'indie-projects', 'college', 'contact'
  ];

  function updatePipeline() {
    const scrollY = window.scrollY + window.innerHeight * 0.3;

    // Show pipeline after scrolling past hero
    if (pipeline) {
      if (window.scrollY > 300) {
        pipeline.classList.add('visible');
      } else {
        pipeline.classList.remove('visible');
      }
    }

    let activeIndex = 0;
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && scrollY >= section.offsetTop) {
        activeIndex = i;
        break;
      }
    }

    pipeNodes.forEach((node, i) => {
      if (i <= activeIndex) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    pipeConnectors.forEach((conn, i) => {
      if (i < activeIndex) {
        conn.classList.add('filled');
      } else {
        conn.classList.remove('filled');
      }
    });
  }

  window.addEventListener('scroll', updatePipeline, { passive: true });

  // ============================================
  // 5. FADE-UP ON SCROLL (IntersectionObserver)
  // ============================================
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  fadeEls.forEach(el => fadeObserver.observe(el));

  // ============================================
  // 5b. SCROLL BEATS — progressive disclosure
  //     (.rv elements reveal one beat at a time)
  // ============================================
  const rvEls = document.querySelectorAll('.rv');
  const rvReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (rvReduced || !('IntersectionObserver' in window)) {
    // Show everything immediately — no animation
    rvEls.forEach(el => el.classList.remove('rv'));
  } else {
    const rvObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('in');
        rvObserver.unobserve(el);
        // Clean up classes after the beat finishes so hover/tilt
        // transforms (h-card, flip-card) aren't blocked by .rv rules.
        const d = parseInt(el.style.getPropertyValue('--d'), 10) || 0;
        setTimeout(() => el.classList.remove('rv', 'in'), 1400 + d * 90);
      });
    }, { threshold: 0, rootMargin: '0px 0px 50px 0px' });
    rvEls.forEach(el => rvObserver.observe(el));
  }

  // Timeline rails: fill with scroll progress (experience + indie journey)
  const railEls = document.querySelectorAll('.exp-timeline, .indie-journey-v');
  if (railEls.length) {
    let railTick = false;
    const fillRails = () => {
      railTick = false;
      const vh = window.innerHeight || 800;
      railEls.forEach(el => {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / Math.max(1, r.height)));
        el.style.setProperty('--rail-fill', p.toFixed(3));
      });
    };
    window.addEventListener('scroll', () => {
      if (!railTick) { railTick = true; requestAnimationFrame(fillRails); }
    }, { passive: true });
    window.addEventListener('resize', fillRails, { passive: true });
    fillRails();
  }

  // ============================================
  // 6. COUNTER ANIMATION (Digital Flicker)
  // ============================================
  function animateCounter(el, target) {
    const duration = 1800;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;

      // Add occasional flicker
      if (Math.random() > 0.9 && progress < 0.8) {
        el.style.opacity = '0.7';
        setTimeout(() => { el.style.opacity = '1'; }, 50);
      }

      el.textContent = isDecimal ? value.toFixed(1) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ============================================
  // 7. HORIZONTAL SCROLL: Nav Buttons + Dots
  // ============================================
  function initHorizontalScroll(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);
    if (!track) return;

    const cards = track.querySelectorAll('.h-card');
    const prevBtn = document.querySelector(`.h-prev[data-target="${trackId}"]`);
    const nextBtn = document.querySelector(`.h-next[data-target="${trackId}"]`);

    // Create dots
    if (dotsContainer) {
      cards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dotsContainer.appendChild(dot);
      });
    }

    function updateDots() {
      if (!dotsContainer) return;
      const scrollLeft = track.scrollLeft;
      const cardWidth = cards[0]?.offsetWidth + 20 || 1;
      const activeIndex = Math.round(scrollLeft / cardWidth);
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    }

    track.addEventListener('scroll', updateDots, { passive: true });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const cardWidth = cards[0]?.offsetWidth + 20 || 300;
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const cardWidth = cards[0]?.offsetWidth + 20 || 300;
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }
  }

  initHorizontalScroll('exp-track', 'exp-dots');
  // DV projects use the pinned horizontal story (initDvStory) — no h-scroll wiring

  // ============================================
  // 8. FLIP CARDS (Touch/Click for mobile)
  // ============================================
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (isTouchDevice) {
    document.querySelectorAll('.flip-card, .flip-card-project').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't flip if clicking a link
        if (e.target.closest('a')) return;
        card.classList.toggle('flipped');
      });
    });
  }

  // ============================================
  // 9. 3D TILT — consolidated into initTilt3d() (see bottom of file)
  // ============================================

  // ============================================
  // 10. SMOOTH SCROLL FOR NAV LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 110; // Account for nav + pipeline
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 11. MOBILE NAVIGATION TOGGLE
  // ============================================
  const navToggle = document.createElement('button');
  navToggle.className = 'nav-toggle';
  navToggle.setAttribute('aria-label', 'Toggle menu');
  navToggle.innerHTML = '<span></span><span></span><span></span>';

  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelector('.nav-links');

  if (navbar && navLinks) {
    navbar.appendChild(navToggle);
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }

  // ============================================
  // 12. 3D ATOM ORBIT — skills as electrons (DV ref)
  //     One rAF clock drives ring spin, chip depth &
  //     counter-rotation so labels stay upright.
  // ============================================
  const atomBox = document.querySelector('#dv-orbit .orbit-container');
  const atomRings = [];
  let atomVisible = true, atomLive = false, atomTheta = 0, atomLast = 0, atomRaf = 0;
  const atomReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const atomSmall = window.matchMedia('(max-width: 768px)');

  function atomConfFor(ring) {
    if (ring.classList.contains('ring-1')) return { tilt: 62, speed: 0.34 };
    if (ring.classList.contains('ring-2')) return { tilt: -58, speed: -0.26 };
    return { tilt: 54, speed: 0.18 };
  }

  function layoutAtom() {
    atomRings.length = 0;
    if (!atomBox) return;
    atomBox.querySelectorAll('.orbit-ring').forEach(ring => {
      const conf = atomConfFor(ring);
      const chips = Array.from(ring.querySelectorAll('.orbit-chip'));
      const size = ring.offsetWidth || 1;
      const c = size / 2;
      const factor = ring.classList.contains('ring-1') ? 0.66
        : ring.classList.contains('ring-2') ? 0.78 : 0.86;
      const radius = c * factor;
      chips.forEach((chip, i) => {
        const a0 = (2 * Math.PI * i) / chips.length - Math.PI / 2;
        chip.dataset.a0 = a0;
        chip.style.left = (c + radius * Math.cos(a0)) + 'px';
        chip.style.top = (c + radius * Math.sin(a0)) + 'px';
        if (!chip.dataset.bound) {
          chip.dataset.bound = '1';
          chip.addEventListener('mouseenter', () => { chip.dataset.h = '1'; });
          chip.addEventListener('mouseleave', () => { chip.dataset.h = ''; });
        }
      });
      ring._tilt = conf.tilt;
      ring._speed = conf.speed;
      atomRings.push(ring);
    });
    drawAtom();
  }

  function drawAtom() {
    const DEG = Math.PI / 180;
    for (const ring of atomRings) {
      const S = atomTheta * ring._speed;                 // radians
      const Sdeg = S / DEG;
      const tilt = ring._tilt;
      ring.style.transform = 'translate(-50%,-50%) rotateX(' + tilt + 'deg) rotateZ(' + Sdeg.toFixed(2) + 'deg)';
      const rz = -Sdeg, rx = -tilt;
      const sinT = Math.sin(tilt * DEG);
      ring.querySelectorAll('.orbit-chip').forEach(chip => {
        const a0 = parseFloat(chip.dataset.a0) || 0;
        const zf = Math.sin(a0 + S) * sinT;               // -1 back .. +1 front
        const ds = 1 + zf * 0.15;
        const op = 0.66 + (zf + 1) * 0.17;                // 0.66 .. 1
        chip.style.setProperty('--rz', rz.toFixed(2) + 'deg');
        chip.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        chip.style.setProperty('--ds', ds.toFixed(3));
        chip.style.setProperty('--do', op.toFixed(2));
        chip.style.zIndex = String(Math.round(zf * 12) + (chip.dataset.h ? 100 : 0));
      });
    }
  }

  function atomTick(now) {
    atomRaf = requestAnimationFrame(atomTick);
    if (!atomLive || !atomVisible || document.hidden) { atomLast = now; return; }
    const dt = Math.min(80, now - (atomLast || now));
    atomLast = now;
    atomTheta += dt / 1000;
    drawAtom();
  }

  function updateAtomMode() {
    atomLive = !atomReduced && !atomSmall.matches;
    if (atomLive) {
      if (!atomRaf) { atomLast = 0; atomRaf = requestAnimationFrame(atomTick); }
    } else if (atomRaf) {
      cancelAnimationFrame(atomRaf); atomRaf = 0;
    }
    drawAtom();   // static snapshot (tilted, unspun) when not live
  }

  layoutAtom();
  updateAtomMode();
  window.addEventListener('resize', () => { layoutAtom(); updateAtomMode(); });
  if (document.fonts) document.fonts.ready.then(layoutAtom);
  if (atomSmall.addEventListener) atomSmall.addEventListener('change', updateAtomMode);
  if ('IntersectionObserver' in window && atomBox) {
    new IntersectionObserver(en => { atomVisible = en[0].isIntersecting; }, { threshold: 0 }).observe(atomBox);
  }

  // ============================================
  // 13. KEYBOARD ACCESSIBILITY FOR FLIP CARDS
  // ============================================
  document.querySelectorAll('.flip-card, .flip-card-project').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

  // ============================================
  // 14. INITIAL PIPELINE UPDATE
  // ============================================
  updatePipeline();

  // ============================================
  // 15. JOURNEY MODES (DV / FULL / INDIE)
  // ============================================
  const journeyBtns = document.querySelectorAll('[data-journey-btn]');
  function setJourney(mode) {
    document.body.dataset.journey = mode;
    journeyBtns.forEach(b => {
      const on = b.dataset.journeyBtn === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    try { history.replaceState(null, '', '#' + mode); } catch (e) {}
    updatePipeline();
  }
  journeyBtns.forEach(b => b.addEventListener('click', () => setJourney(b.dataset.journeyBtn)));
  const hash = (location.hash || '').replace('#', '');
  if (['dv', 'full', 'indie'].includes(hash)) setJourney(hash);
  document.body.dataset.skills = 'dv';

  // skills tabs
  document.querySelectorAll('[data-skills-tab]').forEach(t => {
    t.addEventListener('click', () => {
      document.querySelectorAll('[data-skills-tab]').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.body.dataset.skills = t.dataset.skillsTab;
    });
  });

  siliconLab();
  cdcPortal();
  initTilt3d();
  initFinaleGlow();
  initBugHunt();
  initHStory('dv-story');
  initHStory('indie-story');
  initScrollFX();
  initLabScroll();
  initTraceLayer();
  initNavPill();
  initContactPulse();
  initStoryScenes();

});

document.addEventListener('DOMContentLoaded', () => {
  const jBtns = document.querySelectorAll('[data-journey-btn]');
  function applyJourney(mode) {
    document.body.dataset.journey = mode;
    jBtns.forEach(b => {
      const on = b.dataset.journeyBtn === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }
  jBtns.forEach(b => b.addEventListener('click', () => applyJourney(b.dataset.journeyBtn)));
});

function siliconLab() {
  const wave = document.getElementById('wave-canvas');
  if (!wave) return;
  const wctx = wave.getContext('2d');
  let playing = true, t = 0, zoom = 2, periodNs = 4, stage = 'cache';
  const lanes = { clk: true, reset: true, valid: true, ready: true, data: true, ltssm: true };
  const stageCap = {
    cache: 'First ownership: cache coherency + arbitration. Directed + constrained-random tests, credits stable, link parked in L0.',
    tlp: 'My biggest win: back-to-back Gen5 TLPs, flow-control credits dancing — 530+ tests, 20+ bugs, 86→99% coverage.',
    phy: 'The 2am debug: equalization sweeps, ordered sets, x16 lanes hunting for lock. Retrain, relock, repeat.',
    serial: 'Bring-up joy: UART loopback pattern, BERT-style PRBS, error counter falling to zero on the FPGA.'
  };
  const stageMetrics = {
    cache: ['Stage 1/4 · GCache 🏆', 'my first ownership', 'coherency ✓'],
    tlp: ['Stage 2/4 · Gen5 TLP 🏆', '530+ tests', '20+ bugs closed', '86→99% cov', '360→426 Gbps'],
    phy: ['Stage 3/4 · PCIe PHY x2 🏆', 'RC / EP / SWITCH', 'x16 lanes → LOCK'],
    serial: ['Stage 4/4 · UART 🏆', 'loopback ✓', 'errors → 0']
  };
  function sizeCanvas(c) {
    const r = c.getBoundingClientRect();
    const d = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.max(300, (r.width || 600) * d);
    c.height = (parseInt(c.getAttribute('height')) || 200) * d;
  }
  sizeCanvas(wave);
  window.addEventListener('resize', () => sizeCanvas(wave));
  const dataRegs = [0xA5, 0x3C, 0xF0, 0x11, 0xBC, 0x5A];
  function drawWave() {
    const W = wave.width, H = wave.height, d = Math.min(2, window.devicePixelRatio || 1);
    wctx.clearRect(0, 0, W, H);
    wctx.fillStyle = '#07070c'; wctx.fillRect(0, 0, W, H);
    const rows = [['clk', 'clk'], ['reset', 'reset_n'], ['valid', 'tx_valid'], ['ready', 'tx_ready'], ['data', 'tlp_data'], ['ltssm', 'ltssm_state']].filter(([k]) => lanes[k]);
    if (!rows.length) return;
    const rh = H / rows.length, pxPerNs = 6 * zoom * d;
    wctx.font = (10 * d) + 'px JetBrains Mono, monospace';
    rows.forEach(([key, label], i) => {
      const y0 = i * rh, mid = y0 + rh / 2, lo = mid + rh * 0.28, hi = mid - rh * 0.28;
      wctx.fillStyle = '#8888a0'; wctx.fillText(label, 8 * d, y0 + 14 * d);
      wctx.strokeStyle = 'rgba(255,255,255,.06)'; wctx.lineWidth = d;
      wctx.beginPath(); wctx.moveTo(0, y0 + rh); wctx.lineTo(W, y0 + rh); wctx.stroke();
      wctx.lineWidth = 1.6 * d;
      wctx.strokeStyle = key === 'clk' ? '#00ff88' : key === 'ltssm' ? '#a855f7' : key === 'data' ? '#ffd700' : '#00e5ff';
      wctx.beginPath();
      let prevY = null;
      for (let x = 60 * d; x < W; x += 2) {
        const ns = (x / pxPerNs) + t;
        let y = mid;
        if (key === 'clk') y = ((((ns / (periodNs / 2)) | 0) % 2) === 0) ? hi : lo;
        else if (key === 'reset') y = ns < 30 ? lo : hi;
        else if (key === 'valid') y = (stage === 'phy' ? (ns % 90 < 50) : (ns % 24 < 15)) ? hi : lo;
        else if (key === 'ready') y = (ns % 31 < 26) ? hi : lo;
        else if (key === 'ltssm') y = mid + Math.sin(ns / 40) * rh * 0.22;
        else if (key === 'data') y = ((((ns / 12) | 0) % 2) ? mid - rh * 0.18 : mid + rh * 0.18);
        if (x === 60 * d) wctx.moveTo(x, y);
        else if (key === 'data') wctx.lineTo(x, y);
        else { wctx.lineTo(x, prevY); wctx.lineTo(x, y); }
        prevY = y;
      }
      wctx.stroke();
      if (key === 'data') {
        wctx.fillStyle = 'rgba(255,215,0,.85)';
        for (let k = 0; k < 4; k++) {
          const hx = dataRegs[(k + ((t / 40) | 0)) % dataRegs.length].toString(16).toUpperCase().padStart(2, '0');
          wctx.fillText('0x' + hx, (90 + k * 90) * d, mid + 4 * d);
        }
      }
    });
    const cxp = W * 0.55;
    wctx.strokeStyle = 'rgba(255,51,102,.55)'; wctx.setLineDash([4, 4]);
    wctx.beginPath(); wctx.moveTo(cxp, 0); wctx.lineTo(cxp, H); wctx.stroke(); wctx.setLineDash([]);
  }
  let scrubUntil = 0;
  // scroll-scrub hook: scrolling the lab moves the time cursor
  window.__labScrub = (dy) => { t += dy * 2.0; scrubUntil = Date.now() + 700; };
  function tickWave() {
    const r = wave.getBoundingClientRect();
    if (playing && r.bottom > 0 && r.top < window.innerHeight) {
      t += 1.2; drawWave();
      const ro = document.getElementById('wave-readout');
      const stageName = { cache: 'GCache', tlp: 'Gen5 TLP', phy: 'PCIe PHY', serial: 'UART' }[stage] || stage;
      if (ro) ro.textContent = 't = ' + (t | 0) + ' ns · ' + stageName + ' · period ' + periodNs + 'ns (' + Math.round(1000 / periodNs) + ' MHz) · L0' + (Date.now() < scrubUntil ? ' · SCROLL-SCRUB' : '') + (playing ? '' : ' · HELD');
    }
    requestAnimationFrame(tickWave);
  }
  drawWave(); tickWave();
  const playBtn = document.getElementById('wave-play');
  if (playBtn) playBtn.addEventListener('click', () => {
    playing = !playing;
    playBtn.textContent = playing ? '⏸ Pause' : '▶ Play';
    const lv = document.getElementById('wave-live');
    if (lv) lv.textContent = playing ? '● LIVE' : '○ HELD';
  });
  document.querySelectorAll('.wave-zoom-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.wave-zoom-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); zoom = +b.dataset.zoom; drawWave();
  }));
  document.querySelectorAll('.wave-period-btn').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.wave-period-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active'); periodNs = +b.dataset.period; drawWave();
  }));
  document.querySelectorAll('.wave-lane-toggle').forEach(b => b.addEventListener('click', () => {
    b.classList.toggle('active'); lanes[b.dataset.lane] = b.classList.contains('active'); drawWave();
  }));
  document.querySelectorAll('.lab-stage').forEach(s => s.addEventListener('click', () => {
    document.querySelectorAll('.lab-stage').forEach(x => { x.classList.remove('active'); x.setAttribute('aria-selected', 'false'); });
    s.classList.add('active'); s.setAttribute('aria-selected', 'true');
    stage = s.dataset.stage;
    const c = document.getElementById('lab-stage-caption');
    if (c) c.textContent = stageCap[stage] || '';
    const m = document.getElementById('lab-stage-metrics');
    if (m) m.innerHTML = (stageMetrics[stage] || []).map((x, i) => '<span class="metric-chip' + (i === 0 ? ' hot' : '') + '">' + x + '</span>').join('');
    if (stage === 'tlp') animateBugCounter();
    if (stage === 'phy') flashLanes();
  }));
  function animateBugCounter() {
    const m = document.getElementById('lab-stage-metrics');
    if (!m) return;
    let n = 0;
    const iv = setInterval(() => {
      n += 2;
      if (n >= 20) { n = 20; clearInterval(iv); }
      m.innerHTML = '<span class="metric-chip hot">Stage 2/4 · Gen5 TLP 🏆</span><span class="metric-chip">530+ tests</span><span class="metric-chip">' + n + '+ bugs closed</span><span class="metric-chip">86→99% cov</span>';
    }, 90);
  }
  function flashLanes() {
    const nodes = document.querySelectorAll('.ltssm-node');
    const order = ['Detect', 'Polling', 'Configuration', 'L0'];
    let i = 0;
    const iv = setInterval(() => {
      nodes.forEach(nd => nd.classList.toggle('active', nd.dataset.state === order[i]));
      i++;
      if (i >= order.length) clearInterval(iv);
    }, 350);
  }
  const ltssmInfo = {
    Detect: ['Detect — where every link starts', 'My PHY story began here: is anything plugged in? Receiver detection, the first green blip in the viewer.'],
    Polling: ['Polling — bit & symbol lock', 'Ordered sets flying, polarity checks, data-rate negotiation. I watched these patterns hunt for lock.'],
    Configuration: ['Configuration — lanes become a link', 'Lane numbering, width and speed agreement. When this passed, my coverage jumped.'],
    L0: ['L0 — where my link lived', 'Full-speed packets at Gen5 pace — 530+ tests, 20+ bugs closed, 86→99% coverage to hold this state.'],
    L0s: ['L0s — light sleep, fast wake', 'Tx naps to save power. My ASPM tests hammered the entry/exit corners.'],
    L1: ['L1 — deeper sleep', 'Clocks gated, slower wake. Power-aware tests lived here.'],
    L2: ['L2 — aux-only sleep', 'Main power off, wake via beacon. Rare but must-not-hang.'],
    Recovery: ['Recovery — the 2am retrain', 'My debug loop: re-lock, redo equalization, pray for L0. Hit "Replay my retrain debug" to relive it.'],
    'Hot Reset': ['Hot Reset — in-band reset', 'Reset without dropping power. Re-enters Detect.'],
    Disable: ['Disable — link off', 'Electrical idle until retrain is directed.'],
    Loopback: ['Loopback — my BERT playground', 'Tx looped to Rx for pattern tests — same idea as my UART bring-up, at Gen5 pace.']
  };
  const ltNodes = document.querySelectorAll('.ltssm-node');
  function setLtssm(s) {
    ltNodes.forEach(n => n.classList.toggle('active', n.dataset.state === s));
    const nm = document.getElementById('ltssm-name'), ds = document.getElementById('ltssm-desc');
    if (ltssmInfo[s] && nm && ds) { nm.textContent = ltssmInfo[s][0]; ds.textContent = ltssmInfo[s][1]; }
  }
  ltNodes.forEach(n => {
    n.setAttribute('tabindex', '0');
    n.addEventListener('click', () => setLtssm(n.dataset.state));
    n.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLtssm(n.dataset.state); } });
  });
  setLtssm('L0');
  const retrain = document.getElementById('ltssm-retrain');
  if (retrain) retrain.addEventListener('click', () => {
    const seq = ['L0', 'Recovery', 'Configuration', 'L0'];
    let i = 0; retrain.disabled = true;
    const step = () => {
      setLtssm(seq[i]); stage = (seq[i] === 'Recovery' || seq[i] === 'Configuration') ? 'phy' : 'tlp';
      i++;
      if (i < seq.length) setTimeout(step, 700);
      else { retrain.disabled = false; stage = 'tlp'; }
    };
    step();
  });
  document.querySelectorAll('.logic-tab').forEach(tb => tb.addEventListener('click', () => {
    document.querySelectorAll('.logic-tab').forEach(x => x.classList.remove('active'));
    tb.classList.add('active');
    document.querySelectorAll('.logic-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tb.dataset.logic));
  }));
  let gate = 'AND', ga = 0, gb = 0;
  function gateFn() {
    switch (gate) {
      case 'AND': return ga & gb;
      case 'OR': return ga | gb;
      case 'XOR': return ga ^ gb;
      case 'NAND': return (ga & gb) ^ 1;
      case 'NOR': return (ga | gb) ^ 1;
      case 'XNOR': return (ga ^ gb) ^ 1;
      default: return 0;
    }
  }
  function paintGate() {
    const y = gateFn();
    const o = document.getElementById('gate-out');
    if (o) o.textContent = 'Y = ' + y + ' · ' + gate + '(' + ga + ',' + gb + ')';
    const led = document.getElementById('gate-led');
    if (led) led.classList.toggle('on', !!y);
    const a = document.getElementById('gate-a'), b = document.getElementById('gate-b');
    if (a) { a.textContent = 'A = ' + ga; a.classList.toggle('on', !!ga); }
    if (b) { b.textContent = 'B = ' + gb; b.classList.toggle('on', !!gb); }
  }
  document.querySelectorAll('.gate-type').forEach(g => g.addEventListener('click', () => {
    document.querySelectorAll('.gate-type').forEach(x => x.classList.remove('active'));
    g.classList.add('active'); gate = g.dataset.gate; paintGate();
  }));
  const gaB = document.getElementById('gate-a'), gbB = document.getElementById('gate-b');
  if (gaB) gaB.addEventListener('click', () => { ga ^= 1; paintGate(); });
  if (gbB) gbB.addEventListener('click', () => { gb ^= 1; paintGate(); });
  paintGate();
  const muxVals = [1, 0, 1, 0];
  let s0 = 0, s1 = 0;
  function paintMux() {
    document.querySelectorAll('.mux-in').forEach((el) => {
      const i = +el.dataset.mux;
      el.textContent = 'I' + i + '=' + muxVals[i];
      el.classList.toggle('on', !!muxVals[i]);
    });
    const m0 = document.getElementById('mux-s0'), m1 = document.getElementById('mux-s1');
    if (m0) { m0.textContent = 'S0=' + s0; m0.classList.toggle('on', !!s0); }
    if (m1) { m1.textContent = 'S1=' + s1; m1.classList.toggle('on', !!s1); }
    const idx = (s1 << 1) | s0;
    const o = document.getElementById('mux-out');
    if (o) o.textContent = 'Y = I' + idx + ' = ' + muxVals[idx];
  }
  document.querySelectorAll('.mux-in').forEach(el => el.addEventListener('click', () => {
    const i = +el.dataset.mux; muxVals[i] ^= 1; paintMux();
  }));
  const ms0 = document.getElementById('mux-s0'), ms1 = document.getElementById('mux-s1');
  if (ms0) ms0.addEventListener('click', () => { s0 ^= 1; paintMux(); });
  if (ms1) ms1.addEventListener('click', () => { s1 ^= 1; paintMux(); });
  paintMux();
  function paintCodec() {
    const inp = document.getElementById('codec-in'), out = document.getElementById('codec-out');
    let v = parseInt((inp && inp.value) || '0', 10);
    if (isNaN(v)) v = 0;
    v = Math.max(0, Math.min(7, v));
    const bin = v.toString(2).padStart(3, '0');
    const arr = '00000000'.split(''); arr[7 - v] = '1';
    if (out) out.textContent = bin + ' → ' + arr.join('');
  }
  const cg = document.getElementById('codec-go'), ci = document.getElementById('codec-in');
  if (cg) cg.addEventListener('click', paintCodec);
  if (ci) ci.addEventListener('input', paintCodec);
  paintCodec();
  let ffd = 0, ffq = 0;
  const ffHist = [];
  function paintFF(edge) {
    const o = document.getElementById('ff-out'), d = document.getElementById('ff-d');
    if (edge) { ffq = ffd; ffHist.push({ d: ffd, q: ffq }); if (ffHist.length > 24) ffHist.shift(); }
    if (o) o.textContent = 'Q = ' + ffq + ' · Qn = ' + (ffq ^ 1);
    if (d) { d.textContent = 'D = ' + ffd; d.classList.toggle('on', !!ffd); }
    drawFF();
  }
  function drawFF() {
    const c = document.getElementById('ff-canvas');
    if (!c) return;
    const dd = window.devicePixelRatio || 1;
    c.width = Math.max(200, c.clientWidth * dd); c.height = 70 * dd;
    const x2 = c.getContext('2d');
    x2.fillStyle = '#07070c'; x2.fillRect(0, 0, c.width, c.height);
    const n = Math.max(8, ffHist.length);
    [['d', '#00e5ff', c.height * 0.3], ['q', '#00ff88', c.height * 0.7]].forEach(([k, col, base]) => {
      x2.strokeStyle = col; x2.lineWidth = 2; x2.beginPath();
      for (let i = 0; i < n; i++) {
        const h = ffHist[i] ? ffHist[i][k] : 0;
        const x = (i + 1) * (c.width / (n + 1));
        const y = base + (h ? -12 : 12);
        if (i === 0) x2.moveTo(x, y); else x2.lineTo(x, y);
      }
      x2.stroke();
    });
  }
  const ffdB = document.getElementById('ff-d'), ffcB = document.getElementById('ff-clk');
  if (ffdB) ffdB.addEventListener('click', () => { ffd ^= 1; paintFF(false); });
  if (ffcB) ffcB.addEventListener('click', () => paintFF(true));
  paintFF(false);
  const cf = document.getElementById('clk-freq'), cd = document.getElementById('clk-duty');
  const cv = document.getElementById('clk-div'), cp = document.getElementById('clk-phase'), cj = document.getElementById('clk-jitter');
  function drawClock() {
    const c = document.getElementById('clock-canvas');
    if (!c) return;
    const d2 = Math.min(2, window.devicePixelRatio || 1);
    c.width = Math.max(300, c.clientWidth * d2); c.height = 150 * d2;
    const f = cf ? +cf.value : 100, duty = cd ? +cd.value : 50;
    const divIdx = cv ? +cv.value : 1, ph = cp ? +cp.value : 90, jit = cj ? cj.checked : false;
    const divs = [1, 2, 4, 8], div = divs[divIdx] || 2, per = 1000 / f;
    const fv = document.getElementById('clk-freq-v'), dv = document.getElementById('clk-duty-v');
    const vv = document.getElementById('clk-div-v'), pv = document.getElementById('clk-phase-v');
    const ro = document.getElementById('clock-readout');
    if (fv) fv.textContent = f + ' MHz';
    if (dv) dv.textContent = duty + '%';
    if (vv) vv.textContent = '÷' + div;
    if (pv) pv.textContent = ph + '°';
    if (ro) ro.textContent = 'Period ' + per.toFixed(2) + 'ns · ' + f + 'MHz · ÷' + div + ' · ' + ph + '° — my Gen4→Gen5 speedup';
    const x2 = c.getContext('2d');
    x2.fillStyle = '#07070c'; x2.fillRect(0, 0, c.width, c.height);
    x2.font = (10 * d2) + 'px JetBrains Mono, monospace'; x2.fillStyle = '#8888a0';
    x2.fillText('clk_in', 8, 24 * d2);
    x2.fillText('clk_div /' + div, 8, 74 * d2);
    x2.fillText('clk_shift ' + ph + 'deg', 8, 124 * d2);
    const rows2 = [[24, 1, 0, '#00ff88'], [74, div, 0, '#00e5ff'], [124, 1, ph / 360, '#ff3366']];
    rows2.forEach(([yc, ddiv, phOff, col]) => {
      const y = yc * d2, amp = 14 * d2, x0 = 90 * d2;
      x2.strokeStyle = col; x2.lineWidth = 1.8 * d2; x2.beginPath();
      for (let x = x0; x < c.width - 8; x += 2) {
        const cyc = ((x - x0) / (46 * d2)) / ddiv + phOff + (jit ? Math.sin(x * 0.3 + Date.now() * 0.004) * 0.008 : 0);
        const frac = cyc - Math.floor(cyc);
        const yv = frac < duty / 100 ? y - amp : y + amp;
        if (x === x0) x2.moveTo(x, yv); else x2.lineTo(x, yv);
      }
      x2.stroke();
    });
  }
  [cf, cd, cv, cp, cj].forEach(el => { if (el) el.addEventListener('input', drawClock); });
  drawClock();
  window.addEventListener('resize', drawClock);
  setInterval(() => {
    const c = document.getElementById('clock-canvas');
    if (!c || !cj || !cj.checked) return;
    const r = c.getBoundingClientRect();
    if (r.bottom > 0 && r.top < window.innerHeight) drawClock();
  }, 150);
}

function cdcPortal() {
  const scene = document.getElementById('portal-scene');
  const cv = document.getElementById('portal-canvas');
  if (!scene || !cv) return;
  const cx = cv.getContext('2d');
  const bar = document.getElementById('portal-progress');
  const dotItems = scene.querySelectorAll('.portal-dot-item');
  const cards = scene.querySelectorAll('.cdc-card');
  const stepBtns = scene.querySelectorAll('[data-step-target]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function size() {
    cv.width = Math.max(300, window.innerWidth * Math.min(2, window.devicePixelRatio || 1));
    cv.height = window.innerHeight * Math.min(2, window.devicePixelRatio || 1);
  }
  size();
  window.addEventListener('resize', size, { passive: true });

  // 140 dual-domain background particles
  const N = 140, parts = [];
  for (let i = 0; i < N; i++) {
    parts.push({
      x: Math.random(),
      y: Math.random(),
      s: Math.random() * 2.2 + 0.6,
      v: 0.0004 + Math.random() * 0.0016
    });
  }

  // FIFO handshake packets for Card 1 (CDC Sync)
  const packets = [
    { p: 0.05, label: 'REQ', yOff: -26 },
    { p: 0.35, label: 'SYNC_1', yOff: 0 },
    { p: 0.65, label: 'SYNC_2', yOff: 0 },
    { p: 0.90, label: 'ACK', yOff: 26 }
  ];

  // Floating star particles for Card 2 (E-Commerce)
  const stars = [];
  for (let i = 0; i < 20; i++) {
    stars.push({
      x: 0.2 + Math.random() * 0.6,
      y: Math.random(),
      s: Math.random() * 9 + 8,
      v: 0.0008 + Math.random() * 0.0015,
      rot: Math.random() * Math.PI
    });
  }

  let curProg = 0;
  let targetProg = 0;
  let activeCardIndex = -1;
  let isVisible = false;
  let animId = null;

  function scrollToCard(idx) {
    const sceneRect = scene.getBoundingClientRect();
    const sceneTop = sceneRect.top + window.scrollY;
    const total = Math.max(1, scene.offsetHeight - window.innerHeight);
    const targets = [0.06, 0.32, 0.58, 0.85];
    const targetP = targets[Math.max(0, Math.min(3, idx))];
    const targetScroll = sceneTop + targetP * total;
    window.scrollTo({ top: targetScroll, behavior: reduced ? 'auto' : 'smooth' });
  }

  // Dot click navigation
  dotItems.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToCard(idx);
    });
  });

  // Next / Prev step buttons inside cards
  stepBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIdx = parseInt(btn.dataset.stepTarget, 10);
      if (!isNaN(targetIdx)) {
        scrollToCard(targetIdx);
      }
    });
  });

  function updateActiveCard(prog) {
    let activeIdx = 0;
    if (prog < 0.22) activeIdx = 0;
    else if (prog < 0.48) activeIdx = 1;
    else if (prog < 0.74) activeIdx = 2;
    else activeIdx = 3;

    if (activeIdx !== activeCardIndex) {
      activeCardIndex = activeIdx;

      cards.forEach((card, idx) => {
        card.classList.remove('active', 'past', 'future');
        if (idx === activeCardIndex) {
          card.classList.add('active');
        } else if (idx < activeCardIndex) {
          card.classList.add('past');
        } else {
          card.classList.add('future');
        }
      });

      dotItems.forEach((item, idx) => {
        item.classList.toggle('active', idx === activeCardIndex);
      });

      // Synchronize roaming companion entity mode with active card
      if (typeof window.setCompanionEcomMode === 'function') {
        window.setCompanionEcomMode(activeCardIndex >= 2);
      }
    }
  }

  function render(prog) {
    const W = cv.width, H = cv.height;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cx.clearRect(0, 0, W, H);
    const now = Date.now() * 0.002;

    // 1. Moving ambient wavefront
    const waveX = W * prog;
    const grad = cx.createLinearGradient(waveX - 140 * dpr, 0, waveX + 140 * dpr, 0);
    grad.addColorStop(0, 'rgba(0, 255, 136, 0)');
    grad.addColorStop(0.5, prog < 0.5 ? 'rgba(0, 229, 255, 0.12)' : 'rgba(255, 215, 0, 0.12)');
    grad.addColorStop(1, 'rgba(255, 51, 102, 0)');
    cx.fillStyle = grad;
    cx.fillRect(waveX - 140 * dpr, 0, 280 * dpr, H);

    // 2. Central CDC boundary line
    cx.save();
    cx.setLineDash([4 * dpr, 6 * dpr]);
    cx.strokeStyle = prog < 0.5 ? 'rgba(0, 255, 136, 0.12)' : 'rgba(255, 51, 102, 0.12)';
    cx.lineWidth = 1 * dpr;
    cx.beginPath();
    cx.moveTo(W / 2, 0);
    cx.lineTo(W / 2, H);
    cx.stroke();
    cx.restore();

    // 3. Dual-domain particles
    parts.forEach(p => {
      p.y -= p.v * (1 + prog * 1.5);
      if (p.y < 0) { p.y = 1; p.x = Math.random(); }
      const px = p.x * W;
      const py = p.y * H;
      if (px < waveX - 50 * dpr) {
        cx.fillStyle = 'rgba(0, 255, 136, 0.55)';
      } else if (Math.abs(px - waveX) <= 70 * dpr) {
        cx.fillStyle = 'rgba(0, 229, 255, 0.75)';
      } else {
        cx.fillStyle = 'rgba(255, 51, 102, 0.6)';
      }
      cx.fillRect(px, py, p.s * dpr, p.s * dpr);
    });

    // 4. Waveforms pinned at top of viewport
    // Left Clock: clk_asic (fast square wave)
    const waveY = 32 * dpr;
    cx.save();
    cx.strokeStyle = prog < 0.5 ? 'rgba(0, 255, 136, 0.55)' : 'rgba(0, 255, 136, 0.18)';
    cx.lineWidth = 2 * dpr;
    cx.beginPath();
    const hwStep = 24 * dpr;
    for (let x = 20 * dpr; x < Math.min(W * 0.46, waveX + 60 * dpr); x += hwStep) {
      const high = Math.sin((x / hwStep) * Math.PI + now * 4) > 0;
      const y = waveY + (high ? -10 * dpr : 10 * dpr);
      if (x === 20 * dpr) cx.moveTo(x, y);
      else {
        cx.lineTo(x, y);
        cx.lineTo(x + hwStep, y);
      }
    }
    cx.stroke();

    // Right Clock: clk_web / SaaS (smooth sine wave)
    cx.strokeStyle = prog > 0.4 ? 'rgba(255, 51, 102, 0.55)' : 'rgba(255, 51, 102, 0.18)';
    cx.beginPath();
    for (let x = Math.max(W * 0.54, waveX - 60 * dpr); x < W - 20 * dpr; x += 6 * dpr) {
      const y = waveY + Math.sin((x / (35 * dpr)) - now * 2.5) * (11 * dpr);
      if (x <= Math.max(W * 0.54, waveX - 60 * dpr)) cx.moveTo(x, y);
      else cx.lineTo(x, y);
    }
    cx.stroke();
    cx.restore();

    // 5. Active Handshake packet animation (Card 1: CDC Sync)
    if (activeCardIndex === 1 || (prog > 0.18 && prog < 0.52)) {
      const cxc = W / 2, cyc = H * 0.5;
      packets.forEach(pkt => {
        const flow = ((pkt.p + now * 0.18 + prog * 0.8) % 1);
        const pkX = (cxc - 160 * dpr) + flow * (320 * dpr);
        const pkY = cyc + pkt.yOff * dpr;
        cx.fillStyle = 'rgba(0, 229, 255, 0.95)';
        cx.shadowColor = '#00e5ff';
        cx.shadowBlur = 10 * dpr;
        cx.fillRect(pkX - 4 * dpr, pkY - 4 * dpr, 8 * dpr, 8 * dpr);
        cx.shadowBlur = 0;
        cx.font = (9 * dpr) + 'px JetBrains Mono, monospace';
        cx.fillText(pkt.label, pkX - 14 * dpr, pkY - 8 * dpr);
      });
    }

    // 6. Floating 5-star review sparkles (Card 2: E-Commerce)
    if (activeCardIndex === 2 || (prog > 0.45 && prog < 0.78)) {
      cx.save();
      cx.fillStyle = 'rgba(255, 215, 0, 0.75)';
      cx.shadowColor = '#ffd700';
      cx.shadowBlur = 8 * dpr;
      stars.forEach(st => {
        st.y -= st.v;
        if (st.y < 0) { st.y = 1; st.x = 0.15 + Math.random() * 0.7; }
        const sx = st.x * W;
        const sy = st.y * H;
        cx.font = (st.s * dpr) + 'px sans-serif';
        cx.fillText('★', sx, sy);
      });
      cx.restore();
    }
  }

  function loop() {
    const r = scene.getBoundingClientRect();
    const inView = r.bottom > -200 && r.top < window.innerHeight + 200;
    if (!inView) {
      animId = null;
      return;
    }

    curProg += (targetProg - curProg) * 0.16;
    if (Math.abs(targetProg - curProg) < 0.0005) curProg = targetProg;

    if (bar) bar.style.width = (curProg * 100).toFixed(1) + '%';
    render(curProg);

    animId = requestAnimationFrame(loop);
  }

  function onScroll() {
    const r = scene.getBoundingClientRect();
    const total = Math.max(1, scene.offsetHeight - window.innerHeight);
    const raw = Math.min(1, Math.max(0, -r.top / total));
    targetProg = raw;

    // Immediately update active card on scroll for snappy transitions:
    updateActiveCard(raw);

    const inView = r.bottom > -200 && r.top < window.innerHeight + 200;
    if (inView && !animId) {
      animId = requestAnimationFrame(loop);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(en => {
      isVisible = en[0].isIntersecting;
      if (isVisible) {
        if (!animId) loop();
      } else {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      }
    }, { threshold: 0 });
    obs.observe(scene);
  } else {
    isVisible = true;
    loop();
  }
}

function initTilt3d() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduced || !fine) return;
  const sel = ['.wave-card', '.ltssm-card', '.logic-card', '.clock-card',
    '.h-card', '.project-card-featured', '.exp-card', '.college-viit-card',
    '.research-card', '.gandharva-card', '.patent-card', '.achieve-card', '.contact-link-card'].join(', ');
  document.querySelectorAll(sel).forEach(card => {
    card.classList.add('tilt-3d-inner');
    const parent = card.parentElement;
    if (parent) parent.classList.add('tilt-3d');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(900px) rotateY(' + (px * 8).toFixed(2) + 'deg) rotateX(' + (-py * 8).toFixed(2) + 'deg) translateZ(4px)';
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ============================================
// HORIZONTAL STORY ENGINE (shared)
// Vertical scroll drives translateX on the track
// (1:1 mapping, lerped) with per-panel entrances.
// Panels can carry data-step / data-glow / data-more.
// ============================================
function initHStory(storyId) {
  const story = document.getElementById(storyId);
  const track = story ? story.querySelector('.hstory-track') : null;
  if (!story || !track) return;
  const sticky = story.querySelector('.hstory-sticky');
  const bar = story.querySelector('.hstory-bar');
  const stepEl = story.querySelector('.hstory-step');
  const dotsBox = story.querySelector('.hstory-dots');
  const prevBtn = story.querySelector('.hstory-prev');
  const nextBtn = story.querySelector('.hstory-next');
  const panels = Array.from(track.querySelectorAll('.hstory-panel'));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!sticky || !panels.length) return;

  let travel = 0, target = 0, cur = 0, activeIdx = -1, scrollTick = false;

  // Interactive "case notes" disclosure built from each panel's data-more
  panels.forEach(p => {
    if (!p.dataset.more) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hs-toggle mono';
    btn.textContent = '＋ open case notes';
    btn.addEventListener('click', () => {
      const open = p.classList.toggle('open');
      btn.textContent = open ? '− close case notes' : '＋ open case notes';
    });
    const more = document.createElement('div');
    more.className = 'hs-more';
    more.innerHTML = '<span class="hs-more-label mono">CASE NOTES</span><p></p>';
    more.querySelector('p').textContent = p.dataset.more;
    p.appendChild(btn);
    p.appendChild(more);
  });

  const dots = panels.map((p, i) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'hstory-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Go to step ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    if (dotsBox) dotsBox.appendChild(d);
    return d;
  });

  function syncActive() {
    const vw = window.innerWidth;
    let best = 0, bd = 1e9;
    panels.forEach((pan, i) => {
      const pr = pan.getBoundingClientRect();
      const d = Math.abs(pr.left + pr.width / 2 - vw / 2);
      if (d < bd) { bd = d; best = i; }
    });
    if (best === activeIdx) return;
    activeIdx = best;
    panels.forEach((p, i) => p.classList.toggle('active', i === best));
    dots.forEach((d, i) => d.classList.toggle('active', i === best));
    if (stepEl) stepEl.textContent = 'STEP ' + (best + 1) + ' / ' + panels.length + ' · ' + (panels[best].dataset.step || '');
    if (sticky) sticky.style.setProperty('--glow-rgb', panels[best].dataset.glow || '0,255,136');
  }

  function paint() {
    track.style.transform = 'translate3d(' + (-cur).toFixed(2) + 'px,0,0)';
  }

  function apply(snap) {
    const r = story.getBoundingClientRect();
    const total = Math.max(1, story.offsetHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, -r.top / total));
    target = p * travel;
    if (snap || reduced) { cur = target; paint(); }
    if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    syncActive();
  }

  function measure() {
    travel = Math.max(0, track.scrollWidth - sticky.clientWidth);
    // 1:1 scroll mapping: story is (viewport height + horizontal travel) tall
    story.style.height = (window.innerHeight + travel) + 'px';
    apply(true);
  }

  function goTo(i) {
    i = Math.max(0, Math.min(panels.length - 1, i));
    const vw = sticky.clientWidth;
    const wantX = Math.min(travel, Math.max(0, panels[i].offsetLeft + panels[i].offsetWidth / 2 - vw / 2));
    const p = travel ? wantX / travel : 0;
    const top = story.getBoundingClientRect().top + window.scrollY + p * Math.max(1, story.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  }

  function tick() {
    requestAnimationFrame(tick);
    if (document.hidden) return;
    if (reduced) { if (cur !== target) { cur = target; paint(); syncActive(); } return; }
    const diff = target - cur;
    if (Math.abs(diff) < 0.12) { if (diff !== 0) { cur = target; paint(); } return; }
    cur += diff * 0.14;
    paint();
    syncActive();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(activeIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(activeIdx + 1));

  window.addEventListener('scroll', () => {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(() => { scrollTick = false; apply(false); });
  }, { passive: true });
  window.addEventListener('resize', measure);
  if (document.fonts) document.fonts.ready.then(measure);

  measure();
  requestAnimationFrame(tick);
}

// ============================================
// SCROLL FX — part 1: global rail, scroll math,
// velocity energy, hero parallax, card spotlight.
// ============================================
function initScrollFX() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;

  // ---- Global section rail ----
  const rail = document.getElementById('scroll-rail');
  const railFill = document.getElementById('rail-fill');
  const railDot = document.getElementById('rail-dot');
  const ticksBox = document.getElementById('rail-ticks');
  const sections = Array.from(document.querySelectorAll('section[id]')).filter(s => s.id !== 'bridge');
  let ticks = [];
  if (rail && ticksBox) {
    ticks = sections.map(s => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rail-tick';
      b.innerHTML = '<span>' + s.id.toUpperCase() + '</span>';
      b.setAttribute('aria-label', 'Jump to ' + s.id);
      b.addEventListener('click', () => {
        const y = s.getBoundingClientRect().top + window.scrollY - 110;
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      });
      ticksBox.appendChild(b);
      return b;
    });
    requestAnimationFrame(() => rail.classList.add('ready'));
  }

  // ---- scroll math ----
  let lastY = window.scrollY, vel = 0, pending = false, activeIdx = -1;
  const expCards = Array.from(document.querySelectorAll('.exp-card'));
  const stageLabels = Array.from(document.querySelectorAll('.section-stage-label'));
  const stackLayers = Array.from(document.querySelectorAll('.stack-layer'));
  const skillConn = document.querySelector('.skills-connector');
  const expBullets = Array.from(document.querySelectorAll('.exp-timeline .exp-card-points li'));
  const expChips = Array.from(document.querySelectorAll('.exp-timeline .award-chip'));
  function compute() {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    vel = Math.max(-1, Math.min(1, dy / 60));

    if (document.getElementById('hero')) {
      const p = Math.min(1, Math.max(0, y / Math.max(1, window.innerHeight)));
      document.body.style.setProperty('--hero-y', (y * 0.35).toFixed(1) + 'px');
      document.body.style.setProperty('--hero-fade', p.toFixed(3));
      document.body.style.setProperty('--load-p', p.toFixed(2));
    }

    const doc = Math.max(1, root.scrollHeight - window.innerHeight);
    const gp = Math.min(1, Math.max(0, y / doc));
    if (railFill) railFill.style.height = (gp * 100).toFixed(1) + '%';
    if (railDot) railDot.style.top = (gp * 100).toFixed(1) + '%';

    let idx = -1;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= window.innerHeight * 0.45) idx = i; });
    if (idx !== activeIdx) {
      activeIdx = idx;
      ticks.forEach((t, i) => t.classList.toggle('on', i === idx));
      const TINT = { 'indie-projects': '255,51,102', college: '255,215,0', contact: '255,215,0' };
      document.body.style.setProperty('--tint-rgb', (idx >= 0 && TINT[sections[idx].id]) || '0,255,136');
    }

    if (expCards.length) {
      let best = -1, bd = 1e9;
      expCards.forEach((c, i) => {
        const r = c.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - window.innerHeight / 2);
        if (d < bd) { bd = d; best = i; }
      });
      expCards.forEach((c, i) => c.classList.toggle('spot', i === best && bd < window.innerHeight * 0.62));
    }

    // builder-stack layers assemble as they cross the viewport
    stackLayers.forEach(l => {
      const r = l.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      const p = Math.min(1, Math.max(0, 1 - (r.top - window.innerHeight * 0.22) / (window.innerHeight * 0.55)));
      l.style.setProperty('--p', p.toFixed(3));
    });
    if (skillConn) {
      const r = skillConn.getBoundingClientRect();
      if (Math.abs(r.top) < window.innerHeight * 2) {
        const p = Math.min(1, Math.max(0, 1 - (r.top - window.innerHeight * 0.3) / (window.innerHeight * 0.45)));
        skillConn.style.setProperty('--cp', p.toFixed(3));
      }
    }

    // experience: bullets light and awards stamp as the rail advances
    if (expBullets.length || expChips.length) {
      const expTl = document.querySelector('.exp-timeline');
      if (expTl) {
        const r2 = expTl.getBoundingClientRect();
        const f = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r2.top) / Math.max(1, r2.height)));
        expBullets.forEach((b, i) => b.classList.toggle('lit', f > (i + 0.4) / expBullets.length));
        expChips.forEach((c, i) => c.classList.toggle('stamped', f > 0.18 + (i / Math.max(1, expChips.length)) * 0.45));
      }
    }
  }
  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; compute(); });
  }, { passive: true });
  window.addEventListener('resize', compute);
  compute();

  // velocity decay feeds the story panels' energy glow
  if (!reduced) {
    let glow = 0;
    (function decay() {
      glow += (Math.abs(vel) - glow) * 0.14;
      document.body.style.setProperty('--velglow', glow.toFixed(3));
      document.body.style.setProperty('--velabs', glow.toFixed(3));
      document.body.style.setProperty('--vel', vel.toFixed(3));
      requestAnimationFrame(decay);
    })();
  }

  initScrollFXPart2(reduced, fine);
}

// ============================================
// SCROLL FX — part 2: label sweep, title decode,
// count-ups, college tab scan, magnetic buttons.
// ============================================
function initScrollFXPart2(reduced, fine) {
  if (!('IntersectionObserver' in window)) return;

  // Signal burst when a section label arrives
  function burst(el) {
    const r = el.getBoundingClientRect();
    const box = document.createElement('div');
    box.className = 'signal-burst';
    for (let i = 0; i < 7; i++) {
      const d = document.createElement('i');
      const a = (Math.PI * 2 * i) / 7 + Math.random() * 0.6;
      const dist = 40 + Math.random() * 70;
      d.style.left = (r.left + 24) + 'px';
      d.style.top = (r.top + r.height / 2) + 'px';
      d.style.setProperty('--bx', (Math.cos(a) * dist).toFixed(0) + 'px');
      d.style.setProperty('--by', (Math.sin(a) * dist).toFixed(0) + 'px');
      box.appendChild(d);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 1000);
  }

  // Stage labels light up as their section arrives
  const labelIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in-view');
    labelIO.unobserve(en.target);
    if (!reduced) burst(en.target);
  }), { threshold: 0.4 });
  document.querySelectorAll('.section-stage-label').forEach(el => labelIO.observe(el));

  // Flip cards swing in once, then behave normally
  const flipIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    flipIO.unobserve(el);
    if (reduced) return;
    el.classList.add('reveal-in');
    setTimeout(() => el.classList.remove('reveal-in'), 900);
  }), { threshold: 0.4 });
  document.querySelectorAll('.flip-card').forEach(el => flipIO.observe(el));

  // Skills nucleus swells while the section is centred
  const skillsTrack = document.querySelector('.skills-track-360');
  if (skillsTrack) {
    const sIO = new IntersectionObserver(es => es.forEach(en => {
      skillsTrack.classList.toggle('focused', en.isIntersecting && en.intersectionRatio > 0.4);
    }), { threshold: [0.4, 0.8] });
    sIO.observe(skillsTrack);
  }

  // Titles decode in — text nodes only, so inner spans survive
  const GLYPHS = '01#/\\<>{}[]=+*';
  const titleIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    titleIO.unobserve(el);
    if (reduced) return;
    const texts = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim());
    if (!texts.length) return;
    el.classList.add('decoding');
    const finals = texts.map(n => n.textContent);
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      texts.forEach((n, k) => {
        let out = '';
        for (let i = 0; i < finals[k].length; i++) {
          const ch = finals[k][i];
          out += (ch === ' ' || frame >= 14) ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        n.textContent = out;
      });
      if (frame >= 14) { clearInterval(iv); el.classList.remove('decoding'); }
    }, 30);
  }), { threshold: 0.3 });
  document.querySelectorAll('.section-title').forEach(el => titleIO.observe(el));

  // Impact numbers count up on arrival
  const countIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    countIO.unobserve(el);
    const to = parseFloat(el.dataset.count) || 0;
    if (reduced) { el.textContent = to; return; }
    const dec = to % 1 !== 0;
    const t0 = performance.now(), dur = 1200;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = dec ? (eased * to).toFixed(1) : Math.round(eased * to);
      if (p < 1) requestAnimationFrame(step); else el.textContent = to;
    })(performance.now());
  }), { threshold: 0.4 });
  document.querySelectorAll('.count[data-count]').forEach(el => countIO.observe(el));

  // College tabs auto-scan while the section is on screen
  const tabs = Array.from(document.querySelectorAll('.college-tab'));
  const college = document.getElementById('college');
  if (college && tabs.length && !reduced) {
    let scanTimer = null;
    const scanIO = new IntersectionObserver(es => es.forEach(en => {
      if (!en.isIntersecting) { clearInterval(scanTimer); scanTimer = null; return; }
      college.classList.add('datasheet');
      if (scanTimer) return;
      let i = 0;
      scanTimer = setInterval(() => {
        tabs.forEach(t => t.classList.remove('scanning'));
        tabs[i % tabs.length].classList.add('scanning');
        i++;
        if (i > tabs.length + 1) { clearInterval(scanTimer); scanTimer = null; }
      }, 650);
    }), { threshold: 0.3 });
    scanIO.observe(college);
  }

  // Magnetic buttons (fine pointers only)
  if (fine && !reduced) {
    // Silicon probe cursor with a lagging trail
    const probe = document.getElementById('probe-cursor');
    if (probe) {
      const dots = Array.from(probe.querySelectorAll('i'));
      const target = { x: -100, y: -100 };
      const pts = dots.map(() => ({ x: -100, y: -100 }));
      window.addEventListener('mousemove', e => { target.x = e.clientX; target.y = e.clientY; }, { passive: true });
      (function trail() {
        requestAnimationFrame(trail);
        let px = target.x, py = target.y;
        pts.forEach((p, i) => {
          p.x += (px - p.x) * (0.38 - i * 0.09);
          p.y += (py - p.y) * (0.38 - i * 0.09);
          dots[i].style.left = p.x.toFixed(1) + 'px';
          dots[i].style.top = p.y.toFixed(1) + 'px';
          px = p.x; py = p.y;
        });
      })();
    }

    document.querySelectorAll('.btn-primary, .btn-glow, .college-tab, .hs-toggle, .proj-filter, .exp-filter, .skills-tab').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) * 0.16;
        const dy = (e.clientY - r.top - r.height / 2) * 0.26;
        el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }
}

// ============================================
// LAB SCROLL DRIVE — stage + LTSSM follow scroll,
// waveform scrubs, logic sims run themselves.
// Any pointer interaction in the lab pauses it.
// ============================================
function initLabScroll() {
  const lab = document.getElementById('silicon-lab');
  if (!lab) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stageBtns = Array.from(document.querySelectorAll('.lab-stage'));
  const ltNodes = Array.from(document.querySelectorAll('.ltssm-node'));
  const ltOrder = ['Detect', 'Polling', 'Configuration', 'L0'];
  let manualUntil = 0, lastY = window.scrollY, lastIdx = -1, lastLt = '', simLast = 0;

  lab.addEventListener('pointerdown', () => { manualUntil = Date.now() + 9000; }, true);

  function onScroll() {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    if (dy && typeof window.__labScrub === 'function') window.__labScrub(dy);
    if (reduced || Date.now() < manualUntil) return;
    const total = Math.max(1, lab.offsetHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, -lab.getBoundingClientRect().top / total));
    const idx = Math.min(3, Math.floor(p * 4));
    if (idx !== lastIdx) {
      lastIdx = idx;
      const btn = stageBtns[idx];
      if (btn) {
        if (!btn.classList.contains('active')) btn.click();
        stageBtns.forEach(b => b.classList.toggle('auto', b === btn));
      }
    }
    const state = ltOrder[Math.min(3, Math.floor(p * 4.2))];
    if (state !== lastLt) {
      lastLt = state;
      const node = ltNodes.find(n => n.dataset.state === state);
      // SVG <g> has no .click() — dispatch instead
      if (node) node.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  try { onScroll(); } catch (e) { /* never let the autopilot break the page */ }

  // Logic sims play themselves while their card is on screen
  (function sim() {
    requestAnimationFrame(sim);
    if (reduced || Date.now() - simLast < 1400 || Date.now() < manualUntil) return;
    const card = document.querySelector('.logic-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    simLast = Date.now();
    const panel = card.querySelector('.logic-panel.active');
    if (!panel) return;
    const g = panel.dataset.panel;
    if (g === 'gates') { const a = document.getElementById('gate-a'), b = document.getElementById('gate-b'); if (a) a.click(); if (b && Math.random() > .55) b.click(); }
    else if (g === 'mux') { const s0 = document.getElementById('mux-s0'), s1 = document.getElementById('mux-s1'); if (s0) s0.click(); if (s1 && Math.random() > .7) s1.click(); }
    else if (g === 'ff') { const d = document.getElementById('ff-d'), c = document.getElementById('ff-clk'); if (d) d.click(); if (c) c.click(); }
  })();
}

// ============================================
// CIRCUIT TRACE LAYER — the page's wiring draws
// itself as you scroll, with packets running
// along completed traces.
// ============================================
function initTraceLayer() {
  const svg = document.getElementById('trace-layer');
  if (!svg) return;
  const anchors = Array.from(document.querySelectorAll('.section-stage-label'));
  if (anchors.length < 2) return;
  const NS = 'http://www.w3.org/2000/svg';
  let paths = [], pending = false;

  function build() {
    svg.textContent = '';
    const X = 34;
    const pts = anchors.map(a => {
      const r = a.getBoundingClientRect();
      return { y: r.top + window.scrollY + r.height / 2 };
    });
    paths = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const midY = (a.y + b.y) / 2;
      const jog = i % 2 === 0 ? 16 : -16;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', 'M ' + X + ' ' + a.y + ' L ' + X + ' ' + (midY + jog) + ' L ' + (X + 14) + ' ' + midY + ' L ' + X + ' ' + (midY - jog) + ' L ' + X + ' ' + b.y);
      p.setAttribute('id', 'trace-' + i);
      p.setAttribute('class', 'trace');
      const len = Math.abs(b.y - a.y) + 120;
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      svg.appendChild(p);

      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '2.4');
      dot.setAttribute('class', 'trace-pulse');
      const mp = document.createElementNS(NS, 'mpath');
      mp.setAttribute('href', '#trace-' + i);
      const mv = document.createElementNS(NS, 'animateMotion');
      mv.setAttribute('dur', (2.4 + i * 0.35) + 's');
      mv.setAttribute('repeatCount', 'indefinite');
      mv.appendChild(mp);
      dot.appendChild(mv);
      svg.appendChild(dot);

      paths.push({ el: p, len, top: a.y, bottom: b.y });
    }
    const last = anchors[anchors.length - 1].getBoundingClientRect();
    svg.style.height = Math.max(1, last.bottom + window.scrollY + 160) + 'px';
  }

  function update() {
    const eye = window.scrollY + window.innerHeight * 0.5;
    paths.forEach(p => {
      const prog = Math.min(1, Math.max(0, (eye - p.top) / Math.max(1, p.bottom - p.top)));
      p.el.style.strokeDashoffset = (p.len * (1 - prog)).toFixed(0);
    });
  }

  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => { pending = false; update(); });
  }, { passive: true });
  window.addEventListener('resize', () => { build(); update(); });
  build(); update();
  setTimeout(() => { build(); update(); }, 1500);
  if (document.fonts) document.fonts.ready.then(() => { build(); update(); });
}

// ============================================
// MORPHING NAV PILL — glides to the active link
// ============================================
function initNavPill() {
  const links = document.querySelector('.nav-links');
  if (!links) return;
  const pill = document.createElement('span');
  pill.className = 'nav-pill';
  pill.setAttribute('aria-hidden', 'true');
  links.insertBefore(pill, links.firstChild);
  function place() {
    const active = links.querySelector('a.nav-active');
    if (!active || window.innerWidth <= 900) { pill.style.opacity = '0'; return; }
    pill.style.opacity = '1';
    pill.style.width = active.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + active.offsetLeft + 'px) translateY(-50%)';
  }
  new MutationObserver(place).observe(links, { subtree: true, attributes: true, attributeFilter: ['class'] });
  window.addEventListener('resize', place);
  window.addEventListener('scroll', place, { passive: true });
  setTimeout(place, 200);
  setTimeout(place, 1200);
}

// ============================================
// CONTACT PULSE CANVAS — signals converge on a chip
// ============================================
function initContactPulse() {
  const cv = document.querySelector('.contact-pulse');
  if (!cv) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  function size() {
    const host = cv.parentElement.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = cv.width = Math.max(320, host.width * dpr);
    H = cv.height = Math.max(180, Math.min(460, host.height * .62) * dpr);
  }
  size();
  window.addEventListener('resize', size);
  const pulses = Array.from({ length: 16 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: .2 + Math.random() * .8,
    sp: .0016 + Math.random() * .0032
  }));
  function draw() {
    requestAnimationFrame(draw);
    const r = cv.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2;
    pulses.forEach(p => {
      if (!reduced) {
        p.r -= p.sp;
        if (p.r < .16) { p.r = 1 + Math.random() * .3; p.a = Math.random() * Math.PI * 2; }
      }
      const x = cx + Math.cos(p.a) * p.r * W * .46;
      const y = cy + Math.sin(p.a) * p.r * H * .46;
      const k = Math.max(0, 1 - p.r);
      ctx.fillStyle = 'rgba(0,255,136,' + (0.12 + k * .55).toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(x, y, (1.2 + k * 2.4) * dpr, 0, Math.PI * 2);
      ctx.fill();
    });
    const s = 15 * dpr;
    ctx.strokeStyle = 'rgba(0,255,136,.55)';
    ctx.lineWidth = 1.4 * dpr;
    ctx.strokeRect(cx - s, cy - s, s * 2, s * 2);
    ctx.beginPath();
    ctx.moveTo(cx - s * 2.6, cy); ctx.lineTo(cx - s, cy);
    ctx.moveTo(cx + s, cy); ctx.lineTo(cx + s * 2.6, cy);
    ctx.moveTo(cx, cy - s * 2.6); ctx.lineTo(cx, cy - s);
    ctx.moveTo(cx, cy + s); ctx.lineTo(cx, cy + s * 2.6);
    ctx.stroke();
  }
  draw();
}

// ============================================
// STORY SCENES — each horizontal story gets a small
// live canvas that redraws for the active panel.
// ============================================
function initStoryScenes() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rr(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }
  document.querySelectorAll('.hstory-sticky').forEach(sticky => {
    const cv = document.createElement('canvas');
    cv.className = 'hstory-scene';
    cv.setAttribute('aria-hidden', 'true');
    sticky.appendChild(cv);
    const ctx = cv.getContext('2d');
    const W = 240, H = 120, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    let t = 0;
    function draw() {
      requestAnimationFrame(draw);
      const r = cv.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      t += reduced ? 0 : 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1.2;
      const act = sticky.querySelector('.hstory-panel.active');
      const s = (act && act.dataset.scene) || 'wave';
      if (s === 'arch') {
        const pts = [[30, 30], [82, 20], [132, 34], [40, 92], [96, 98], [152, 84]];
        ctx.strokeStyle = 'rgba(0,255,136,.22)';
        [[0, 1], [1, 2], [0, 3], [3, 4], [4, 5], [2, 5], [1, 4]].forEach(e => {
          ctx.beginPath();
          ctx.moveTo(pts[e[0]][0], pts[e[0]][1]);
          ctx.lineTo(pts[e[1]][0], pts[e[1]][1]);
          ctx.stroke();
        });
        pts.forEach((p, i) => {
          const k = (Math.sin(t * .04 + i * 1.3) + 1) / 2;
          ctx.fillStyle = 'rgba(0,255,136,' + (.3 + k * .55).toFixed(2) + ')';
          ctx.beginPath(); ctx.arc(p[0], p[1], 2.6 + k * 2.2, 0, Math.PI * 2); ctx.fill();
        });
      } else if (s === 'uvm') {
        for (let i = 0; i < 4; i++) {
          const y = 16 + i * 26, k = (Math.sin(t * .03 + i * 1.5) + 1) / 2;
          ctx.strokeStyle = 'rgba(64,196,255,' + (.28 + k * .45).toFixed(2) + ')';
          ctx.strokeRect(26 + (i % 2) * 18, y, 160 - (i % 2) * 36, 18);
          ctx.beginPath(); ctx.moveTo(110, y + 18); ctx.lineTo(110, y + 26); ctx.stroke();
        }
      } else if (s === 'feed') {
        for (let i = 0; i < 5; i++) {
          const y = H + 20 - ((t * 1.1 + i * 30) % (H + 30));
          ctx.strokeStyle = 'rgba(255,51,102,' + (.2 + (i % 2) * .18).toFixed(2) + ')';
          rr(ctx, 26, y, 96, 20, 7); ctx.stroke();
        }
      } else if (s === 'reels') {
        for (let i = 0; i < 3; i++) {
          const off = ((t * .9 + i * 70) % 220) - 30;
          ctx.strokeStyle = 'rgba(255,51,102,.4)';
          rr(ctx, off, 22 + i * 16, 82, 58, 10); ctx.stroke();
        }
      } else if (s === 'funnel') {
        ctx.strokeStyle = 'rgba(255,215,0,.5)';
        ctx.beginPath(); ctx.moveTo(34, 22); ctx.lineTo(108, 64); ctx.lineTo(182, 22); ctx.stroke();
        for (let i = 0; i < 9; i++) {
          const p = (t * .018 + i * .11) % 1;
          const x = 46 + ((i * 31) % 124);
          ctx.fillStyle = 'rgba(255,215,0,' + ((1 - p) * .7).toFixed(2) + ')';
          ctx.beginPath(); ctx.arc(x, 22 + p * 44, 2.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,215,0,.8)';
        ctx.beginPath(); ctx.arc(108, 86, 5, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.strokeStyle = 'rgba(0,255,136,.5)';
        ctx.beginPath();
        for (let x = 12; x < W - 12; x += 3) {
          const y = H / 2 + Math.sin((x + t) * .07) * 20 * ((((x + t) / 28) | 0) % 2 ? 1 : .3);
          if (x === 12) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    draw();
  });
}

function initFinaleGlow() {
  const finale = document.getElementById('indie-finale');
  if (!finale || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) finale.classList.add('glow'); });
  }, { threshold: 0.5 }).observe(finale);
}

// ============================================
// ============================================
// BUG HUNT — active silicon bug scurrying across the page
// Click to catch or let it roam! Always respawns.
// ============================================
function initBugHunt() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const layer = document.getElementById('bug-hunt');
  const wrap = document.getElementById('bug-wrap');
  const svg = document.getElementById('bug-svg');
  const ecomSvg = document.getElementById('ecom-svg');
  const net = document.getElementById('bug-net');
  const stamp = document.getElementById('bug-stamp');
  if (!layer || !wrap || !svg) return;

  let state = 'wait';   // wait | wander | pause | evade | chase | caught
  let raf = 0, dir = 1;
  let pos = { x: 80, y: 140 }, from = { x: 80, y: 140 }, to = { x: 220, y: 200 };
  let moveStart = 0, moveDur = 1000, pauseEnd = 0;
  let bugCount = 20;
  let ecomCount = 100;
  let inEcomMode = false;
  let skillsNetFired = false;
  let ecomMilestoneShown = false;

  function rand(a, b) { return a + Math.random() * (b - a); }

  function updateEntityMode(isEcom) {
    if (inEcomMode === isEcom) return;
    inEcomMode = isEcom;
    if (inEcomMode) {
      if (svg) svg.style.display = 'none';
      if (ecomSvg) ecomSvg.style.display = 'block';
      if (net) net.style.display = 'none';
      wrap.title = 'Shopify E-Commerce win · Click to inspect';
    } else {
      if (svg) svg.style.display = 'block';
      if (ecomSvg) ecomSvg.style.display = 'none';
      if (net) net.style.display = 'block';
      wrap.title = 'Click to inspect';
    }
  }
  window.setCompanionEcomMode = updateEntityMode;

  function pickTarget(evadeFromX, evadeFromY) {
    const w = window.innerWidth, h = window.innerHeight;
    from = { x: pos.x, y: pos.y };

    if (evadeFromX !== undefined && evadeFromY !== undefined) {
      // Scurry away from the cursor
      const dx = pos.x - evadeFromX;
      const dy = pos.y - evadeFromY;
      const angle = Math.atan2(dy, dx) + rand(-0.4, 0.4);
      const dist = rand(130, 260);
      let nx = pos.x + Math.cos(angle) * dist;
      let ny = pos.y + Math.sin(angle) * dist;
      nx = Math.max(30, Math.min(w - 70, nx));
      ny = Math.max(70, Math.min(h - 70, ny));
      to = { x: nx, y: ny };
      moveDur = rand(450, 850);
      state = 'evade';
    } else {
      to = { x: rand(40, Math.max(80, w - 80)), y: rand(70, Math.max(120, h - 90)) };
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      moveDur = Math.max(700, Math.min(3000, (dist / 160) * 1000));
      state = 'wander';
    }

    moveStart = performance.now();
    if (Math.abs(to.x - from.x) > 3) dir = to.x > from.x ? 1 : -1;
    wrap.classList.add('moving');
  }

  function paint() {
    wrap.style.transform = 'translate(' + pos.x.toFixed(1) + 'px,' + pos.y.toFixed(1) + 'px) scaleX(' + dir + ')';
  }

  function showStamp() {
    if (!stamp) return;
    if (inEcomMode) {
      stamp.innerHTML = '5★ SHOPIFY REVIEW ✓<small>Birdchime &amp; Tradexa · ' + ecomCount + '+ five-star reviews! ⭐⭐⭐⭐⭐</small>';
      stamp.style.borderColor = 'var(--accent-builder)';
      stamp.style.color = 'var(--accent-builder)';
      stamp.style.boxShadow = '0 0 24px rgba(255, 107, 53, 0.6)';
    } else {
      stamp.innerHTML = 'BUG CAUGHT ✓<small>RTL-bug-0' + bugCount + ' · closed! 🐞</small>';
      stamp.style.borderColor = 'var(--accent-silicon)';
      stamp.style.color = 'var(--accent-silicon)';
      stamp.style.boxShadow = '0 0 24px rgba(0, 255, 136, 0.6)';
    }
    stamp.style.left = (pos.x + 18) + 'px';
    stamp.style.top = (pos.y + 10) + 'px';
    stamp.classList.add('show');
  }

  function respawn() {
    const w = window.innerWidth, h = window.innerHeight;
    // Pick an edge to enter from
    const edge = Math.floor(Math.random() * 4);
    if (edge === 0) { pos.x = rand(50, w - 50); pos.y = -35; }
    else if (edge === 1) { pos.x = rand(50, w - 50); pos.y = h + 15; }
    else if (edge === 2) { pos.x = -35; pos.y = rand(80, h - 80); }
    else { pos.x = w + 15; pos.y = rand(80, h - 80); }

    if (svg) svg.classList.remove('caught');
    if (ecomSvg) ecomSvg.classList.remove('caught');
    if (stamp) stamp.classList.remove('show');
    if (net) net.classList.remove('lunge');
    wrap.classList.remove('moving');
    wrap.classList.add('on');
    layer.classList.remove('gone');

    paint();
    pickTarget();
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function caught(withNet) {
    if (state === 'caught' || state === 'chase') return;

    if (inEcomMode) {
      ecomCount++;
      state = 'caught';
      wrap.classList.remove('moving');
      showStamp();
      setTimeout(respawn, 2400);
      return;
    }

    bugCount++;
    wrap.classList.remove('moving');

    if (withNet && net) {
      state = 'chase';
      net.style.left = (pos.x + 18 - 37) + 'px';
      net.style.top = (pos.y + 18 - 37) + 'px';
      net.classList.add('lunge');
      setTimeout(() => {
        state = 'caught';
        if (svg) svg.classList.add('caught');
        showStamp();
        setTimeout(respawn, 2600);
      }, 480);
    } else {
      state = 'caught';
      if (svg) svg.classList.add('caught');
      showStamp();
      setTimeout(respawn, 2200);
    }
  }

  function tick(now) {
    raf = requestAnimationFrame(tick);
    if (state === 'caught' || state === 'chase' || document.hidden) return;

    if (state === 'wander' || state === 'evade') {
      const t = Math.min(1, (now - moveStart) / moveDur);
      const jx = Math.sin(now * 0.05) * 2.2;
      const jy = Math.cos(now * 0.04) * 1.8;
      pos.x = from.x + (to.x - from.x) * t + jx;
      pos.y = from.y + (to.y - from.y) * t + jy;

      if (t >= 1) {
        pos.x = to.x; pos.y = to.y;
        wrap.classList.remove('moving');
        state = 'pause';
        pauseEnd = now + rand(600, 2000);
      }
    } else if (state === 'pause' && now >= pauseEnd) {
      pickTarget();
    }
    paint();
  }

  function start() {
    layer.classList.remove('gone');
    const w = window.innerWidth, h = window.innerHeight;
    pos = { x: Math.max(60, w * 0.22), y: Math.max(100, h * 0.35) };
    wrap.classList.add('on');
    paint();
    pickTarget();
    if (!raf) raf = requestAnimationFrame(tick);
  }

  // Interactive catch on click
  wrap.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state === 'wander' || state === 'pause' || state === 'evade') {
      caught(false);
    }
  });

  // Cursor evasion: scurry away when mouse approaches
  window.addEventListener('mousemove', (e) => {
    if (state !== 'wander' && state !== 'pause') return;
    const dist = Math.hypot(e.clientX - (pos.x + 17), e.clientY - (pos.y + 17));
    if (dist < 65) {
      pickTarget(e.clientX, e.clientY);
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (state === 'wander' || state === 'pause') pickTarget();
  }, { passive: true });
  window.addEventListener('pagehide', () => { if (raf) cancelAnimationFrame(raf); });

  // Fun scripted net capture in verification skills
  const skills = document.getElementById('skills');
  if (skills && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(en => {
      if (!en[0].isIntersecting || skillsNetFired || inEcomMode) return;
      skillsNetFired = true;
      obs.disconnect();
      if (state === 'wander' || state === 'pause') {
        caught(true);
      }
    }, { threshold: 0.25 });
    obs.observe(skills);
  }

  // Monitor scroll for transition past bridge into E-Commerce / Indie
  const bridgeSec = document.getElementById('bridge');
  const indieSec = document.getElementById('indie-projects');
  function checkEcomScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const triggerY = bridgeSec ? (bridgeSec.offsetTop + (bridgeSec.offsetHeight * 0.52)) : (indieSec ? indieSec.offsetTop - 200 : 3000);
    updateEntityMode(scrollY >= triggerY);
  }
  window.addEventListener('scroll', checkEcomScroll, { passive: true });
  checkEcomScroll();

  // Milestone unlock toast when entering E-Commerce section
  if (indieSec && 'IntersectionObserver' in window) {
    const ecomObs = new IntersectionObserver(en => {
      if (!en[0].isIntersecting || ecomMilestoneShown) return;
      ecomMilestoneShown = true;
      updateEntityMode(true);
      if (stamp) {
        stamp.innerHTML = '🛍️ E-COMMERCE CHAPTER UNLOCKED<small>100+ 5-Star Reviews on Shopify · Birdchime &amp; Tradexa</small>';
        stamp.style.left = Math.min(window.innerWidth - 120, Math.max(140, pos.x + 20)) + 'px';
        stamp.style.top = (pos.y + 10) + 'px';
        stamp.style.borderColor = 'var(--accent-builder)';
        stamp.style.color = 'var(--accent-builder)';
        stamp.style.boxShadow = '0 0 28px rgba(255, 107, 53, 0.7)';
        stamp.classList.add('show');
        setTimeout(() => stamp.classList.remove('show'), 3500);
      }
    }, { threshold: 0.15 });
    ecomObs.observe(indieSec);
  }

  // Spawn quickly after load
  setTimeout(start, 500);
}
