// ============================================
// ANKIT GUPTA PORTFOLIO — INTERACTIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar ---
  const progressBar = document.getElementById('progress-bar');
  const nav = document.querySelector('nav');

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

  // --- Fade-up on Scroll (IntersectionObserver) ---
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  fadeEls.forEach(el => fadeObserver.observe(el));

  // --- Skill Chips Stagger Animation ---
  const chipObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const chips = entry.target.querySelectorAll('.skill-chip');
        chips.forEach((chip, i) => {
          setTimeout(() => chip.classList.add('visible'), i * 45);
        });
        chipObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skills-track').forEach(t => chipObserver.observe(t));

  // --- Counter Animation ---
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
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

  // --- Experience Timeline Tabs ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const timelinePanels = document.querySelectorAll('.timeline-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      timelinePanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Timeline Card Expand/Collapse ---
  document.querySelectorAll('.timeline-card').forEach(card => {
    card.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      // Collapse all first
      document.querySelectorAll('.timeline-card.expanded').forEach(c => c.classList.remove('expanded'));
      if (!isExpanded) card.classList.add('expanded');
    });
  });

  // --- Certifications Tabs ---
  const certTabs = document.querySelectorAll('.cert-tab');
  const certPanels = document.querySelectorAll('.cert-panel');
  certTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.cert;
      certTabs.forEach(t => t.classList.remove('active'));
      certPanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // --- Smooth Scroll for Nav Links ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Hero Name Letter Animation (typing feel on load) ---
  const heroName = document.querySelector('.hero-name');
  if (heroName) {
    heroName.style.opacity = '0';
    heroName.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroName.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroName.style.opacity = '1';
      heroName.style.transform = 'translateY(0)';
    }, 200);
  }

  // --- Stagger hero elements ---
  const heroEls = document.querySelectorAll('.hero-stagger');
  heroEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.6s ease ${i * 0.1 + 0.4}s, transform 0.6s ease ${i * 0.1 + 0.4}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 50);
  });

  // --- Mobile Navigation Toggle ---
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
    
    // Close mobile nav when clicking any link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
      });
    });
  }

});
