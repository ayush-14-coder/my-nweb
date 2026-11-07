/**
 * AYUSH MOGAVEERA — PORTFOLIO & GROWTH SHOWCASE
 * Client Architecture & Interactive Engines (Pure JavaScript)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initRoiSimulator();
  init3DCardTilt();
  initBeforeAfterSlider();
  initMetricsCounters();
  initCapabilityFilters();
  initPortfolioFilters();
  initScopeBuilder();
  initModalSystem();
  initNavigation();
});

/* ==========================================================================
   1. HERO CANVAS PARTICLE & STRATEGY NETWORK ENGINE
   ========================================================================== */

function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width = 0;
  let height = 0;
  let particles = [];
  const mouse = { x: -1000, y: -1000, radius: 140 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
    height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
    createParticles();
  }

  function createParticles() {
    particles = [];
    // Balanced count for ultra-smooth 60fps on all devices
    const count = Math.min(Math.floor((width * height) / 18000), 55);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 2 + 1.5,
        color: Math.random() > 0.4 ? 'rgba(6, 182, 212, ' : 'rgba(15, 23, 42, ',
        baseAlpha: Math.random() * 0.25 + 0.12,
      });
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around screen boundaries
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse interactivity: gentle repelling
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= (dx / dist) * force * 1.5;
        p.y -= (dy / dist) * force * 1.5;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.baseAlpha + ')';
      ctx.fill();

      // Connect nodes within proximity
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
        const maxDist = 125;

        if (dist2 < maxDist) {
          const alpha = (1 - dist2 / maxDist) * 0.14;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  animate();
}

/* ==========================================================================
   2. INTERACTIVE REVENUE & ROI CALCULATION ENGINE
   ========================================================================== */

function initRoiSimulator() {
  const visitorsSlider = document.getElementById('slider-visitors');
  const cvrSlider = document.getElementById('slider-cvr');
  const aovSlider = document.getElementById('slider-aov');
  const tierButtons = document.querySelectorAll('.tier-btn');
  const resetBtn = document.getElementById('roi-reset-btn');
  const applyBtn = document.getElementById('roi-apply-btn');

  if (!visitorsSlider || !cvrSlider || !aovSlider) return;

  // Output elements
  const valVisitors = document.getElementById('val-visitors');
  const valCvr = document.getElementById('val-cvr');
  const valAov = document.getElementById('val-aov');
  const activeTierTag = document.getElementById('active-tier-tag');

  const resultMonthlyGain = document.getElementById('result-monthly-gain');
  const resultAnnualGain = document.getElementById('result-annual-gain');
  const resultCurrentRev = document.getElementById('result-current-rev');
  const resultProjectedRev = document.getElementById('result-projected-rev');
  const resultProjectedCvr = document.getElementById('result-projected-cvr');
  const resultExtraOrders = document.getElementById('result-extra-orders');
  const resultRoiPercent = document.getElementById('result-roi-percent');
  const resultPaybackDays = document.getElementById('result-payback-days');

  const barCurrent = document.getElementById('bar-current');
  const barProjected = document.getElementById('bar-projected');
  const barLiftBadge = document.getElementById('bar-lift-badge');

  let activeLift = 55; // Default +55%
  const benchmarkRetainer = 4500;

  function formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num);
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  }

  function update() {
    const visitors = parseInt(visitorsSlider.value, 10);
    const cvr = parseFloat(cvrSlider.value);
    const aov = parseInt(aovSlider.value, 10);

    // Update Label Badges
    if (valVisitors) valVisitors.textContent = formatNumber(visitors);
    if (valCvr) valCvr.textContent = cvr.toFixed(1) + '%';
    if (valAov) valAov.textContent = '$' + formatNumber(aov);

    // Mathematical Funnel Projection
    const currentOrders = Math.round(visitors * (cvr / 100));
    const currentMonthlyRevenue = currentOrders * aov;

    const projectedCvr = parseFloat((cvr * (1 + activeLift / 100)).toFixed(2));
    const projectedOrders = Math.round(visitors * (projectedCvr / 100));
    const projectedMonthlyRevenue = projectedOrders * aov;

    const monthlyGain = Math.max(0, projectedMonthlyRevenue - currentMonthlyRevenue);
    const annualGain = monthlyGain * 12;
    const extraOrders = Math.max(0, projectedOrders - currentOrders);

    // ROI on advisory retainer
    const roiPercent = benchmarkRetainer > 0 ? Math.round((monthlyGain / benchmarkRetainer) * 100) : 0;
    const paybackDays = monthlyGain > 0 ? ((benchmarkRetainer / monthlyGain) * 30).toFixed(1) : '0';

    // Update Output Numbers
    if (resultMonthlyGain) resultMonthlyGain.textContent = '+' + formatCurrency(monthlyGain);
    if (resultAnnualGain) {
      resultAnnualGain.innerHTML = `Annualized Upside: <strong>+${formatCurrency(annualGain)} / year</strong>`;
    }
    if (resultCurrentRev) resultCurrentRev.textContent = formatCurrency(currentMonthlyRevenue);
    if (resultProjectedRev) resultProjectedRev.textContent = formatCurrency(projectedMonthlyRevenue);
    if (resultProjectedCvr) resultProjectedCvr.textContent = projectedCvr.toFixed(2) + '%';
    if (resultExtraOrders) resultExtraOrders.textContent = `+${formatNumber(extraOrders)} orders/mo`;
    if (resultRoiPercent) resultRoiPercent.textContent = formatNumber(roiPercent) + '%';
    if (resultPaybackDays) resultPaybackDays.textContent = `${paybackDays} Days`;

    // Dynamic Comparative Visual Bars
    if (barCurrent && barProjected) {
      const maxVal = Math.max(projectedMonthlyRevenue, 1);
      const currentPct = Math.min(100, Math.max(12, Math.round((currentMonthlyRevenue / maxVal) * 100)));
      barCurrent.style.width = currentPct + '%';
      barProjected.style.width = '100%';
    }
    if (barLiftBadge) {
      barLiftBadge.textContent = `+${activeLift}% Gain`;
    }
  }

  // Tier buttons listener
  tierButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tierButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      activeLift = parseInt(btn.getAttribute('data-lift'), 10);
      if (activeTierTag) {
        activeTierTag.textContent = `+${activeLift}% Growth Model`;
      }
      update();
    });
  });

  // Slider change listeners
  [visitorsSlider, cvrSlider, aovSlider].forEach((slider) => {
    slider.addEventListener('input', update);
  });

  // Reset Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      visitorsSlider.value = '45000';
      cvrSlider.value = '1.8';
      aovSlider.value = '160';

      tierButtons.forEach((b) => {
        const isCore = b.getAttribute('data-lift') === '55';
        b.classList.toggle('active', isCore);
        b.setAttribute('aria-checked', isCore ? 'true' : 'false');
      });
      activeLift = 55;
      if (activeTierTag) activeTierTag.textContent = '+55% Growth Model';

      update();
      showToast('Baseline metrics reset to industry defaults.');
    });
  }

  // Apply Button (Scrolls to scope portal and prepares traffic)
  if (applyBtn) {
    applyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const scopeSection = document.getElementById('scope-portal');
      if (scopeSection) {
        scopeSection.scrollIntoView({ behavior: 'smooth' });
        showToast('Growth metrics pre-loaded into Clear Scope Portal!');
      }
    });
  }

  // Initial calculation
  update();
}

/* ==========================================================================
   3. 3D CARD TILT EFFECT & MOUSE PHYSICS
   ========================================================================== */

function init3DCardTilt() {
  // Check if pointer device supports hover
  if (!window.matchMedia('(hover: hover)').matches) return;

  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle, refined tilt angles (max +/- 6 deg)
      const rotateX = ((centerY - y) / centerY) * 6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE BEFORE/AFTER COMPARISON SLIDER
   ========================================================================== */

function initBeforeAfterSlider() {
  const container = document.getElementById('aurametrics-comparison');
  const beforeLayer = document.getElementById('comp-before-layer');
  const handle = document.getElementById('comp-handle');

  if (!container || !beforeLayer || !handle) return;

  let isDragging = false;

  function setSliderPosition(clientX) {
    const rect = container.getBoundingClientRect();
    let offsetX = clientX - rect.left;

    // Constrain to container bounds
    offsetX = Math.max(0, Math.min(offsetX, rect.width));
    const percent = (offsetX / rect.width) * 100;

    beforeLayer.style.width = percent + '%';
    handle.style.left = percent + '%';
  }

  function onMouseDown(e) {
    isDragging = true;
    setSliderPosition(e.clientX);
  }

  function onTouchStart(e) {
    if (e.touches.length > 0) {
      isDragging = true;
      setSliderPosition(e.touches[0].clientX);
    }
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  }

  function onTouchMove(e) {
    if (!isDragging || e.touches.length === 0) return;
    setSliderPosition(e.touches[0].clientX);
  }

  function onStop() {
    isDragging = false;
  }

  container.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onStop);

  container.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onStop);
}

/* ==========================================================================
   5. ANIMATED DATA COUNTERS ON SCROLL
   ========================================================================== */

function initMetricsCounters() {
  const counters = document.querySelectorAll('.metric-number, .stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  counters.forEach((c) => observer.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    const duration = 1400;
    let startTime = null;

    function updateCounter(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = Math.max(0, currentTime - startTime);
      const progress = Math.min(Math.max(0, elapsed / duration), 1);

      // Smooth Ease-Out Quart curve: f(p) = 1 - (1 - p)^4
      const ease = 1 - Math.pow(1 - progress, 4);
      const current = Math.min(target, Math.max(0, Math.round(ease * target)));

      el.textContent = current.toLocaleString('en-US');

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = target.toLocaleString('en-US');
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ==========================================================================
   6. CAPABILITY MATRIX TAB SWITCHER
   ========================================================================== */

function initCapabilityFilters() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const columns = document.querySelectorAll('.capability-column-card');

  if (!tabButtons.length || !columns.length) return;

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-cap');

      columns.forEach((col) => {
        const domain = col.getAttribute('data-domain');
        if (filter === 'all' || filter === domain) {
          col.style.display = 'block';
        } else {
          col.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. PORTFOLIO CASE STUDIES FILTER
   ========================================================================== */

function initPortfolioFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterPills.length || !projectCards.length) return;

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').split(',');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. MULTI-STEP SCOPE BUILDER & BLUEPRINT GENERATOR
   ========================================================================== */

function initScopeBuilder() {
  const form = document.getElementById('scope-form');
  const stepPanels = document.querySelectorAll('.form-step-panel');
  const stepNavItems = document.querySelectorAll('.step-nav-item');
  const nextBtns = document.querySelectorAll('.step-next-btn');
  const prevBtns = document.querySelectorAll('.step-prev-btn');

  // Interactive selection elements
  const scopeOptions = document.querySelectorAll('.scope-option-card');
  const trafficPills = document.querySelectorAll('#traffic-pills .pill-choice');
  const bottleneckPills = document.querySelectorAll('#bottleneck-pills .pill-choice');

  // Blueprint live elements
  const bpTitle = document.getElementById('blueprint-engagement-title');
  const bpSummary = document.getElementById('blueprint-summary-text');
  const bpTraffic = document.getElementById('bp-traffic-val');
  const bpBottleneck = document.getElementById('bp-bottleneck-val');
  const bpTimeline = document.getElementById('bp-timeline-val');
  const bpLift = document.getElementById('bp-lift-val');

  if (!form) return;

  let currentStep = 1;
  let selectedEngagement = 'Full Web Engineering Overhaul';
  let selectedTraffic = '15k - 75k / mo';
  let selectedBottleneck = 'Low CVR on Paid Ads';

  function updateBlueprint() {
    if (bpTitle) bpTitle.textContent = selectedEngagement;
    if (bpTraffic) bpTraffic.textContent = selectedTraffic;
    if (bpBottleneck) bpBottleneck.textContent = selectedBottleneck;

    if (selectedEngagement.includes('Engineering Overhaul')) {
      if (bpSummary) bpSummary.textContent = 'Complete 2-3 week sprint targeting sub-400ms Core Web Vitals, frictionless customer acquisition, and mathematical CRO lifts.';
      if (bpTimeline) bpTimeline.textContent = '14 Business Days';
      if (bpLift) bpLift.textContent = '+45% to +80% CVR';
    } else if (selectedEngagement.includes('Growth Sprint') || selectedEngagement.includes('Retainer')) {
      if (bpSummary) bpSummary.textContent = 'High-velocity bi-weekly sprint cycle focused on multivariate funnel testing, copy clarity, and checkout abandonment reduction.';
      if (bpTimeline) bpTimeline.textContent = 'Ongoing 30-Day Sprint';
      if (bpLift) bpLift.textContent = '+30% to +60% Lift';
    } else {
      if (bpSummary) bpSummary.textContent = 'Zero-to-one product development: interactive simulators, high-impact landing page, and automated lead capture engine.';
      if (bpTimeline) bpTimeline.textContent = '10 Business Days';
      if (bpLift) bpLift.textContent = 'Launch-Ready MVP';
    }
  }

  // Radio selection on Step 1
  scopeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      scopeOptions.forEach((o) => o.classList.remove('selected'));
      option.classList.add('selected');
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        selectedEngagement = radio.value;
        updateBlueprint();
      }
    });
  });

  // Traffic pills
  trafficPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      trafficPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      selectedTraffic = pill.getAttribute('data-traffic');
      updateBlueprint();
    });
  });

  // Bottleneck pills
  bottleneckPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      bottleneckPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      selectedBottleneck = pill.getAttribute('data-bottleneck');
      updateBlueprint();
    });
  });

  // Step navigation helper
  function goToStep(step) {
    currentStep = step;

    stepPanels.forEach((panel) => {
      const panelId = panel.id;
      if (panelId === `step-panel-${step}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    stepNavItems.forEach((navItem) => {
      const itemStep = parseInt(navItem.getAttribute('data-step'), 10);
      navItem.classList.toggle('active', itemStep <= step);
    });
  }

  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.getAttribute('data-goto'), 10);
      goToStep(next);
    });
  });

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const prev = parseInt(btn.getAttribute('data-goto'), 10);
      goToStep(prev);
    });
  });

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const url = document.getElementById('contact-url')?.value.trim();

    if (!name || !email || !url) {
      showToast('Please fill in your name, work email, and company URL.');
      return;
    }

    const submitBtn = document.getElementById('submit-scope-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting Blueprint...</span>';
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Blueprint Generated ✓</span>';
      }

      showToast(`Blueprint dispatched! Ayush will reach out to ${email} within 12 hours.`);

      // Update blueprint status tag
      const statusBadge = document.getElementById('blueprint-status');
      if (statusBadge) {
        statusBadge.textContent = 'DISPATCHED & RESERVED';
        statusBadge.style.background = '#ECFDF5';
        statusBadge.style.color = '#047857';
      }
    }, 800);
  });
}

/* ==========================================================================
   9. MODAL CASE STUDY TEARDOWN SYSTEM
   ========================================================================== */

const caseStudiesData = {
  aurametrics: {
    niche: 'ENTERPRISE SAAS',
    lift: '+164% Conversion Lift',
    title: 'AuraMetrics Product Intelligence',
    subtitle: 'Zero-Bloat Frontend Re-architecture & Instant Sandbox Engine',
    problem:
      'AuraMetrics was spending $35k/month on performance ad campaigns, but 72% of prospective enterprise buyers bounced prior to page load. Their legacy single-page bundle was 4.2MB, resulting in a 3.2-second Largest Contentful Paint (LCP) and severe dropoffs.',
    execution:
      'Ayush completely ripped out bloated charting packages and implemented a bespoke, dependency-free HTML5 Canvas telemetry engine running at 60 FPS. Combined with critical path CSS inlining and high-clarity value propositions, LCP dropped to 340ms.',
    stat1Num: '0.34s',
    stat1Lbl: 'LCP (Down from 3.2s)',
    stat2Num: '+164%',
    stat2Lbl: 'Free Trial Signups',
    stat3Num: '99/100',
    stat3Lbl: 'Core Web Vitals',
    tech: ['#CanvasSimulation', '#SubSecondLoad', '#ZeroBloatJS', '#HighIntentCRO', '#EdgeDeployment'],
  },
  lumina: {
    niche: 'D2C LUXURY E-COMMERCE',
    lift: '-$420K Cart Abandonment',
    title: 'Lumina Luxury Direct-to-Consumer',
    subtitle: 'Checkout Latency Elimination & Mobile Frictionless Funnel',
    problem:
      'Lumina suffered from high-ticket cart abandonment exceeding 78% on mobile devices. Heavy scripts and multiple app trackers created cumulative layout shifts, causing customers to abandon checkout during payment gateway transitions.',
    execution:
      'Ayush re-engineered the mobile cart drawer with asynchronous pre-fetching, eliminated third-party render-blocking tags, and designed a haptic one-thumb mobile checkout flow with instant validation.',
    stat1Num: '-68%',
    stat1Lbl: 'Cart Abandonment Drop',
    stat2Num: '+42%',
    stat2Lbl: 'Mobile Checkout Rate',
    stat3Num: '0.42s',
    stat3Lbl: 'Product Detail LCP',
    tech: ['#PerformanceJS', '#HapticCheckout', '#MobileFirstCRO', '#ZeroCLS', '#ShopifyCustomJS'],
  },
  finedge: {
    niche: 'B2B FINTECH & WEALTH',
    lift: '3.8x High-Net-Worth Inquiries',
    title: 'FinEdge Wealth Advisory Portal',
    subtitle: 'Interactive Allocation Simulator & Dynamic Lead Discovery',
    problem:
      'High-net-worth investors were landing on generic corporate overview pages and failing to contact the advisory team. Standard lead capture forms experienced an 88% abandonment rate due to lack of immediate interactive value.',
    execution:
      'Engineered an interactive asset allocation simulator that calculates projected tax-adjusted alpha in real-time as users adjust portfolio horizons. Users unlock their custom portfolio breakdown by connecting their work email.',
    stat1Num: '3.8x',
    stat1Lbl: 'Qualified Inbound Leads',
    stat2Num: '-54%',
    stat2Lbl: 'Customer Acquisition Cost',
    stat3Num: '4.8 min',
    stat3Lbl: 'Average Session Depth',
    tech: ['#InteractiveAssessment', '#FinancialModeling', '#ModularJS', '#B2BLeadGen', '#ClientValueScoring'],
  },
  pulsehealth: {
    niche: 'TELEHEALTH PORTAL',
    lift: '+118% Completed Consultations',
    title: 'PulseHealth Telehealth Flow',
    subtitle: 'Accessible Patient Intake & Sub-300ms Transitions',
    problem:
      'Patient triage intake was fractured across three disjointed domains, creating confusion and dropoffs during urgent medical appointment booking flows.',
    execution:
      'Rebuilt the entire patient onboarding flow as a seamless, high-speed single-page application with 100% WCAG accessibility compliance and sub-300ms step transitions.',
    stat1Num: '+118%',
    stat1Lbl: 'Booking Rate Lift',
    stat2Num: '100/100',
    stat2Lbl: 'Accessibility Score',
    stat3Num: '< 300ms',
    stat3Lbl: 'Step Transitions',
    tech: ['#AccessibleWeb', '#Sub300msTransitions', '#FrictionlessForm', '#WCAGCompliance', '#PerformanceArchitecture'],
  },
};

function initModalSystem() {
  const modal = document.getElementById('case-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-modal-btn');

  if (!modal || !closeBtn) return;

  function openModal(projectId) {
    const data = caseStudiesData[projectId] || caseStudiesData.aurametrics;

    document.getElementById('modal-client-niche').textContent = data.niche;
    document.getElementById('modal-key-lift').textContent = data.lift;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-subtitle').textContent = data.subtitle;
    document.getElementById('modal-problem').textContent = data.problem;
    document.getElementById('modal-execution').textContent = data.execution;

    document.getElementById('modal-stat-1').textContent = data.stat1Num;
    document.getElementById('modal-stat-1').nextElementSibling.textContent = data.stat1Lbl;

    document.getElementById('modal-stat-2').textContent = data.stat2Num;
    document.getElementById('modal-stat-2').nextElementSibling.textContent = data.stat2Lbl;

    document.getElementById('modal-stat-3').textContent = data.stat3Num;
    document.getElementById('modal-stat-3').nextElementSibling.textContent = data.stat3Lbl;

    const techContainer = document.getElementById('modal-tech-list');
    if (techContainer) {
      techContainer.innerHTML = data.tech.map((t) => `<span class="tech-tag">${t}</span>`).join(' ');
    }

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const project = btn.getAttribute('data-project');
      openModal(project);
    });
  });

  closeBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  const modalCta = document.getElementById('modal-cta-btn');
  if (modalCta) {
    modalCta.addEventListener('click', () => {
      closeModal();
    });
  }
}

/* ==========================================================================
   10. NAVIGATION, SMOOTH SCROLL & ACTIVE LINK HIGHLIGHTING
   ========================================================================== */

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    // Close drawer on link click
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // Active link observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach((s) => observer.observe(s));
}

/* ==========================================================================
   GLOBAL TOAST UTILITY
   ========================================================================== */

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
