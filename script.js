/* ============================================================
   AMR ASHRAF PORTFOLIO — script.js
   Handles: Navbar, Scroll reveals, Skill bars, Filters,
            Project/Service/Course Modals, Forms, Floating UI
   ============================================================ */
 
/* ──────────────────────────────────────────────────────────────
   1. NAVBAR — scroll shrink + mobile toggle
────────────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');
 
  // Shrink on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    // Show/hide back-to-top button
    const fabTop = document.querySelector('.fab-top');
    if (fabTop) fabTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
 
  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }
 
  // Active link on scroll
  const sections  = document.querySelectorAll('section[id]');
  const allLinks  = document.querySelectorAll('.nav-links a[href^="#"]');
 
  const setActive = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    allLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };
 
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
 
 
/* ──────────────────────────────────────────────────────────────
   2. SCROLL REVEAL
────────────────────────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
 
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
 
  els.forEach(el => io.observe(el));
})();
 
 
/* ──────────────────────────────────────────────────────────────
   3. SKILL BARS — animate on entering viewport
────────────────────────────────────────────────────────────── */
(function initSkillBars() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fills = e.target.querySelectorAll('.skill-bar-fill');
        fills.forEach(f => {
          f.style.width = f.dataset.pct + '%';
        });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
 
  const container = document.querySelector('#skills');
  if (container) io.observe(container);
})();
 
 
/* ──────────────────────────────────────────────────────────────
   4. SKILLS TABS
────────────────────────────────────────────────────────────── */
(function initSkillTabs() {
  const tabs   = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skills-panel');
 
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`skills-${target}`);
      if (panel) panel.classList.add('active');
    });
  });
})();
 
 
/* ──────────────────────────────────────────────────────────────
   5. PROJECT FILTER
────────────────────────────────────────────────────────────── */
(function initProjectFilter() {
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
 
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
 
      projectCards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.dataset.hidden = match ? 'false' : 'true';
        // Animate re-entry
        if (match) {
          card.style.animation = 'fadeInUp 0.4s ease both';
          setTimeout(() => { card.style.animation = ''; }, 500);
        }
      });
    });
  });
})();
 
 
/* ──────────────────────────────────────────────────────────────
   6. MODAL SYSTEM
────────────────────────────────────────────────────────────── */
const ModalSystem = (() => {
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal');
  if (!overlay || !modal) return { open: () => {} };
 
  const closeBtn = modal.querySelector('.modal-close');
 
  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };
 
  const open = (html) => {
    const contentEl = modal.querySelector('.modal-content');
    if (contentEl) contentEl.innerHTML = html;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
 
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
 
  return { open, close };
})();
 
 
/* ──────────────────────────────────────────────────────────────
   7. SERVICE MODALS — data definitions + trigger
────────────────────────────────────────────────────────────── */

// Global language state (kept in sync by initLangToggle)
let currentLang = localStorage.getItem('lang') || 'en';

// Bilingual labels used inside all modals
const modalTranslations = {
  en: {
    workflow: 'Workflow Steps',
    tools:    'Tools Used',
    example:  'Real Example',
    problem:  'The Problem',
    solution: 'The Solution',
    outcome:  'Outcome',
    topics:   'Topics Covered',
    email:    'Email Me',
    discuss:  'Discuss a Project',
    ask:      'Ask About This',
  },
  ar: {
    workflow: 'خطوات العمل',
    tools:    'الأدوات المستخدمة',
    example:  'مثال عملي',
    problem:  'المشكلة',
    solution: 'الحل',
    outcome:  'النتيجة',
    topics:   'المواضيع',
    email:    'تواصل عبر البريد',
    discuss:  'ناقش مشروعك',
    ask:      'استفسر عن الدورة',
  },
};

// Helper: get translated field (string or {en,ar} object)
const t = (field) => (field && typeof field === 'object') ? (field[currentLang] || field.en) : field;

const SERVICES = {
  s1: {
    tag:   { en: 'Accounting',           ar: 'محاسبة' },
    title: { en: 'Accounting Systems Setup', ar: 'إعداد الأنظمة المحاسبية' },
    desc:  { en: 'End-to-end implementation and configuration of cloud accounting platforms (Daftra, Qoyod, Rawa, Wafiq, Phenix) tailored for small and medium enterprises in Saudi Arabia. From initial setup to ongoing monthly reporting.',
             ar: 'تنفيذ وتهيئة منصات المحاسبة السحابية (دفترة، قيود، رواء، وافق، فينيكس) المخصصة للمنشآت الصغيرة والمتوسطة في المملكة العربية السعودية. من الإعداد الأولي إلى التقارير الشهرية الدورية.' },
    steps: {
      en: ['Assess current business workflow and data structure', 'Configure chart of accounts aligned with GAAP & ZATCA requirements', 'Migrate historical data and opening balances', 'Set up automated invoicing, purchase orders and expense tracking', 'Build monthly reporting templates for management review', 'Train staff on daily usage and best practices'],
      ar: ['تقييم سير العمل الحالي وهيكل البيانات', 'تهيئة دليل الحسابات وفق متطلبات المعايير المحاسبية وزاتكا', 'ترحيل البيانات التاريخية والأرصدة الافتتاحية', 'إعداد الفواتير الآلية وأوامر الشراء وتتبع المصروفات', 'بناء نماذج التقارير الشهرية لمراجعة الإدارة', 'تدريب الموظفين على الاستخدام اليومي وأفضل الممارسات'],
    },
    tools: ['Daftra', 'Qoyod', 'Rawa', 'Wafiq', 'Phenix', 'Excel', 'ZATCA Portal'],
    example: { en: 'Migrated a contracting firm from spreadsheets to Daftra in under 3 weeks, reducing monthly close time by 60%.',
               ar: 'تم ترحيل شركة مقاولات من جداول بيانات إلى دفترة في أقل من 3 أسابيع، مما قلّص وقت الإغلاق الشهري بنسبة 60%.' },
  },
  s2: {
    tag:   { en: 'Tax & Compliance', ar: 'ضريبة وامتثال' },
    title: { en: 'VAT & ZATCA Compliance', ar: 'الامتثال لضريبة القيمة المضافة وزاتكا' },
    desc:  { en: 'Monthly and quarterly VAT filing, account reconciliation and audit-ready documentation. Ensuring full compliance with ZATCA regulations so businesses avoid penalties and pass audits confidently.',
             ar: 'تقديم إقرارات ضريبة القيمة المضافة الشهرية والربعية، ومطابقة الحسابات، وإعداد المستندات الجاهزة للتدقيق. ضمان الامتثال الكامل للوائح زاتكا لتجنب الغرامات.' },
    steps: {
      en: ['Review and categorise all taxable transactions', 'Reconcile VAT ledger with sales and purchase registers', 'Prepare VAT return (Form 101) on the ZATCA portal', 'Generate supporting schedules and exception reports', 'Document all adjustments with proper audit trails', 'Deliver a clean compliance summary to management'],
      ar: ['مراجعة وتصنيف جميع المعاملات الخاضعة للضريبة', 'تسوية دفتر ضريبة القيمة المضافة مع سجلات المبيعات والمشتريات', 'إعداد الإقرار الضريبي (النموذج 101) على بوابة زاتكا', 'إنشاء الجداول الداعمة وتقارير الاستثناءات', 'توثيق جميع التسويات بمسارات تدقيق سليمة', 'تسليم ملخص امتثال نظيف للإدارة'],
    },
    tools: ['ZATCA Portal', 'Excel', 'Qoyod', 'Daftra', 'Power Query'],
    example: { en: 'Standardised the VAT workflow for a water company, reducing filing errors to near-zero across 9 consecutive months.',
               ar: 'توحيد سير عمل ضريبة القيمة المضافة لشركة مياه، مما أدى إلى خفض أخطاء التقديم إلى شبه صفر على مدى 9 أشهر متتالية.' },
  },
  s3: {
    tag:   { en: 'Finance', ar: 'تحليل مالي' },
    title: { en: 'Financial Reporting & Analysis', ar: 'إعداد التقارير والتحليل المالي' },
    desc:  { en: 'Custom Excel dashboards, cost models, and pricing analyses that transform raw journal entries into actionable management decisions. Covers income statements, balance sheets, cash flow projections, and job-costing.',
             ar: 'لوحات تحكم Excel مخصصة، ونماذج التكاليف، وتحليلات التسعير التي تحوّل القيود المحاسبية الخام إلى قرارات إدارية قابلة للتنفيذ. تشمل قوائم الدخل والميزانيات وتوقعات التدفق النقدي ومحاسبة الوظائف.' },
    steps: {
      en: ['Gather and clean source data from accounting systems', 'Build structured Excel models with automated formulas', 'Create pivot-table dashboards with KPI summaries', 'Conduct variance analysis and cost-driver identification', 'Prepare executive summary with visual charts', 'Schedule recurring model updates for ongoing monitoring'],
      ar: ['جمع وتنظيف البيانات المصدرية من الأنظمة المحاسبية', 'بناء نماذج Excel منظمة بمعادلات آلية', 'إنشاء لوحات تحكم بالجداول المحورية وملخصات مؤشرات الأداء', 'إجراء تحليل الانحرافات وتحديد محركات التكاليف', 'إعداد ملخص تنفيذي مع مخططات بيانية', 'جدولة تحديثات دورية للنموذج للمتابعة المستمرة'],
    },
    tools: ['Excel (Advanced)', 'Power Query', 'Pivot Tables', 'Daftra', 'Qoyod'],
    example: { en: 'Built a manufacturing cost model linking 5 production stages to project-level profitability for a steel contracting firm.',
               ar: 'بناء نموذج تكاليف تصنيع يربط 5 مراحل إنتاجية بربحية المشروع لشركة مقاولات فولاذية.' },
  },
  s4: {
    tag:   { en: 'Design', ar: 'تصميم' },
    title: { en: 'UI / UX Design', ar: 'تصميم واجهات المستخدم وتجربته' },
    desc:  { en: 'Wireframes and high-fidelity Figma mockups for finance tools, admin dashboards, and SME web apps — with full Arabic/RTL support. Clean, user-tested designs ready for developer handoff.',
             ar: 'إطارات سلكية ونماذج Figma عالية الدقة لأدوات المالية ولوحات التحكم الإدارية وتطبيقات الويب للمنشآت الصغيرة — مع دعم كامل للعربية وRTL. تصاميم نظيفة جاهزة للتسليم للمطورين.' },
    steps: {
      en: ['Conduct stakeholder interview to define user needs', 'Sketch low-fidelity wireframes for key user flows', 'Design high-fidelity Figma screens with design system', 'Apply Arabic-first typography and RTL layout rules', 'Prototype interactive flows for usability testing', 'Package and deliver Figma file with style guide'],
      ar: ['إجراء مقابلات مع أصحاب المصلحة لتحديد احتياجات المستخدمين', 'رسم إطارات سلكية منخفضة الدقة للمسارات الرئيسية', 'تصميم شاشات Figma عالية الدقة بنظام تصميم متكامل', 'تطبيق الطباعة العربية أولاً وقواعد تخطيط RTL', 'إنشاء نماذج أولية تفاعلية لاختبار قابلية الاستخدام', 'تغليف وتسليم ملف Figma مع دليل الأنماط'],
    },
    tools: ['Figma', 'FigJam', 'Auto Layout', 'RTL Design', 'Iconify'],
    example: { en: 'Designed a bilingual finance dashboard concept for Saudi SMEs — mobile-first, RTL-aware, with dark mode.',
               ar: 'تصميم لوحة تحكم مالية ثنائية اللغة للمنشآت السعودية الصغيرة — جوال أولاً، وعي بـRTL، مع وضع داكن.' },
  },
  s5: {
    tag:   { en: 'Frontend', ar: 'تطوير الواجهات' },
    title: { en: 'Simple Websites & Landing Pages', ar: 'مواقع ويب وصفحات هبوط بسيطة' },
    desc:  { en: 'Responsive, fast-loading landing pages and small dashboards built with clean HTML, CSS, and JavaScript — or React/Tailwind for more interactive needs. No bloated frameworks, just solid code.',
             ar: 'صفحات هبوط سريعة التحميل ومتجاوبة ولوحات تحكم صغيرة مبنية بـHTML وCSS وJavaScript النظيفة — أو React/Tailwind للاحتياجات التفاعلية. لا أطر منتفخة، فقط كود متين.' },
    steps: {
      en: ['Define scope: pages, sections, and interactive features', 'Design component structure and responsive breakpoints', 'Build semantic HTML with accessible markup', 'Style with CSS variables or Tailwind utility classes', 'Add smooth animations and micro-interactions', 'Test across devices, optimise and deliver source files'],
      ar: ['تحديد النطاق: الصفحات والأقسام والميزات التفاعلية', 'تصميم هيكل المكونات ونقاط التوقف المتجاوبة', 'بناء HTML دلالي مع ترميز يسهل الوصول إليه', 'التنسيق بمتغيرات CSS أو فئات Tailwind', 'إضافة حركات سلسة وتفاعلات دقيقة', 'الاختبار عبر الأجهزة والتحسين وتسليم الملفات المصدرية'],
    },
    tools: ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'React', 'Vercel / Netlify'],
    example: { en: 'Built this portfolio site as a fully bilingual (EN/AR) responsive site — 100 Lighthouse performance score on desktop.',
               ar: 'بناء موقع المحفظة هذا كموقع ثنائي اللغة (EN/AR) متجاوب — نتيجة Lighthouse 100 على سطح المكتب.' },
  },
  s6: {
    tag:   { en: 'Training', ar: 'تدريب' },
    title: { en: 'Excel Training Sessions', ar: 'جلسات تدريب Excel' },
    desc:  { en: 'Practical, hands-on Excel training tailored to finance and accounting teams. Covering advanced formulas, pivot tables, financial automation and dashboard building — sessions in Arabic or English.',
             ar: 'تدريب عملي على Excel مخصص لفرق المالية والمحاسبة. يشمل المعادلات المتقدمة والجداول المحورية والأتمتة المالية وبناء لوحات التحكم — جلسات بالعربية أو الإنجليزية.' },
    steps: {
      en: ['Assess current team skill level and pain points', 'Design curriculum around real daily accounting tasks', 'Deliver interactive session with live worked examples', 'Provide take-home practice files and formula cheat-sheet', 'Follow-up Q&A session one week later', 'Optional: build a custom template for the team'],
      ar: ['تقييم مستوى مهارات الفريق ونقاط الألم الحالية', 'تصميم منهج حول مهام المحاسبة اليومية الفعلية', 'تقديم جلسة تفاعلية مع أمثلة عملية مباشرة', 'توفير ملفات تدريبية وورقة مرجعية للمعادلات', 'جلسة متابعة وأسئلة وأجوبة بعد أسبوع', 'اختياري: بناء قالب مخصص للفريق'],
    },
    tools: ['Excel (Advanced)', 'Power Query', 'Pivot Tables', 'XLOOKUP', 'Power BI (intro)'],
    example: { en: 'Ran a 3-session Excel course for a 6-person accounting team, helping them reduce manual report time by 70%.',
               ar: 'تنفيذ دورة Excel من 3 جلسات لفريق محاسبة من 6 أشخاص، مما أسهم في تقليص وقت التقارير اليدوية بنسبة 70%.' },
  },
};
 
(function initServiceModals() {
  function openServiceModal(id) {
    const svc = SERVICES[id];
    if (!svc) return;
    const mt = modalTranslations[currentLang];

    const stepsHTML = t(svc.steps).map((s, i) => `
      <div class="modal-step">
        <span class="step-num">${i + 1}</span>
        <span>${s}</span>
      </div>
    `).join('');

    const toolsHTML = svc.tools.map(tool => `<span class="modal-tool">${tool}</span>`).join('');

    const html = `
      <div class="modal-header">
        <div class="modal-tag">${t(svc.tag)}</div>
        <h2 class="modal-title">${t(svc.title)}</h2>
        <p class="modal-desc">${t(svc.desc)}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${mt.workflow}</div>
        <div class="modal-steps">${stepsHTML}</div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${mt.tools}</div>
        <div class="modal-tools-list">${toolsHTML}</div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${mt.example}</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;font-style:italic;">"${t(svc.example)}"</p>
      </div>
      <div class="modal-ctas">
        <a href="mailto:amrashraf631@gmail.com?subject=Inquiry: ${t(svc.title)}" class="btn btn-primary">✉ ${mt.email}</a>
        <a href="https://wa.me/966569621221?text=Hi Amr, I'm interested in your ${t(svc.title)} service." target="_blank" class="btn btn-ghost">💬 WhatsApp</a>
      </div>
    `;

    ModalSystem.open(html);
  }

  document.querySelectorAll('.service-card[data-service]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const id = card.dataset.service;
      window._activeModal = { type: 'service', id };
      openServiceModal(id);
    });
  });

  window._openServiceModal = openServiceModal;
})();
 
 
/* ──────────────────────────────────────────────────────────────
   8. PROJECT MODALS
────────────────────────────────────────────────────────────── */
const PROJECTS = {
  p1: {
    tag:     { en: 'Accounting', ar: 'محاسبة' },
    title:   { en: 'Daftra Implementation — Modern Supplies', ar: 'تطبيق دفترة — موديرن سبلايز' },
    problem: { en: 'A contracting company was managing all financial transactions in unstructured spreadsheets, causing delayed reports, reconciliation errors, and zero visibility into job-level costs.',
               ar: 'كانت شركة مقاولات تدير جميع معاملاتها المالية في جداول بيانات غير منظمة، مما أدى إلى تأخر التقارير وأخطاء التسوية وغياب أي رؤية لتكاليف الوظائف.' },
    solution:{ en: 'Migrated all data to Daftra, rebuilt the chart of accounts from scratch aligned with Saudi GAAP, automated recurring entries, and established a monthly close checklist.',
               ar: 'تم ترحيل جميع البيانات إلى دفترة، وإعادة بناء دليل الحسابات من الصفر وفق المعايير السعودية، وأتمتة القيود المتكررة، وإنشاء قائمة تحقق للإغلاق الشهري.' },
    tools: ['Daftra', 'Excel', 'ZATCA Portal', 'Power Query'],
    outcome: { en: 'Monthly close time reduced from 5 days to under 1. Management reports delivered by the 3rd of each month without exception.',
               ar: 'انخفض وقت الإغلاق الشهري من 5 أيام إلى أقل من يوم واحد. تُسلَّم تقارير الإدارة بحلول الثالث من كل شهر دون استثناء.' },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  },
  p2: {
    tag:     { en: 'Tax & Compliance', ar: 'ضريبة وامتثال' },
    title:   { en: 'VAT Returns Workflow (ZATCA)', ar: 'سير عمل إقرارات ضريبة القيمة المضافة (زاتكا)' },
    problem: { en: 'Monthly VAT filings were inconsistent, error-prone, and often late — with no standardised checklist or audit trail.',
               ar: 'كانت تقديمات ضريبة القيمة المضافة الشهرية غير متسقة وعرضة للأخطاء ومتأخرة في الغالب — دون قائمة تحقق موحدة أو مسار تدقيق.' },
    solution:{ en: 'Designed a repeatable 6-step monthly VAT workflow: transaction categorisation → ledger reconciliation → portal submission → documentation → manager sign-off → archive.',
               ar: 'تصميم سير عمل شهري متكرر من 6 خطوات لضريبة القيمة المضافة: تصنيف المعاملات ← تسوية الدفتر ← التقديم عبر البوابة ← التوثيق ← موافقة المدير ← الأرشفة.' },
    tools: ['ZATCA Portal', 'Excel', 'Qoyod', 'Internal Controls'],
    outcome: { en: 'Tax filing errors dropped to near-zero across 9 consecutive months. First audit passed without queries.',
               ar: 'انخفضت أخطاء تقديم الضريبة إلى شبه صفر على مدى 9 أشهر متتالية. اجتيز أول تدقيق دون ملاحظات.' },
    image: 'https://images.pexels.com/photos/7735778/pexels-photo-7735778.jpeg?w=1200',
  },
  p3: {
    tag:     { en: 'Cost Accounting', ar: 'محاسبة تكاليف' },
    title:   { en: 'Cost Analysis Model — Manufacturing', ar: 'نموذج تحليل التكاليف — التصنيع' },
    problem: { en: 'A steel manufacturing & installation firm had no visibility into which jobs were profitable. All costing was done manually by memory.',
               ar: 'لم تكن لدى شركة تصنيع وتركيب الفولاذ أي رؤية للوظائف المربحة. كان تحديد التكاليف يتم يدوياً من الذاكرة.' },
    solution:{ en: 'Built a multi-stage Excel cost model covering: raw material procurement, cutting, painting, galvanising, installation and packaging — linked to job numbers and client invoices.',
               ar: 'بناء نموذج تكاليف Excel متعدد المراحل يشمل: شراء المواد الخام والقطع والطلاء والجلفنة والتركيب والتغليف — مرتبطاً بأرقام الوظائف وفواتير العملاء.' },
    tools: ['Excel (Advanced)', 'Pivot Tables', 'Power Query', 'Named Ranges'],
    outcome: { en: 'Identified 3 loss-making job types. Pricing strategy adjusted, improving average project margin by an estimated 12%.',
               ar: 'تم تحديد 3 أنواع من الوظائف الخاسرة. تعديل استراتيجية التسعير، مما حسّن متوسط هامش المشروع بنسبة تقديرية 12%.' },
    image: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=1200&q=80',
  },
  p4: {
    tag:     { en: 'UI Design', ar: 'تصميم UI' },
    title:   { en: 'Finance Dashboard — UI Concept', ar: 'لوحة تحكم مالية — تصميم مفاهيمي' },
    problem: { en: 'Most Arabic-language accounting tools have poor UI — cluttered layouts, poor RTL support and no mobile consideration.',
               ar: 'معظم أدوات المحاسبة باللغة العربية لديها واجهة مستخدم رديئة — تصميمات مزدحمة ودعم ضعيف لـRTL وعدم مراعاة الجوال.' },
    solution:{ en: 'Designed a clean, Arabic-first finance dashboard in Figma. Used a card-based layout, dark mode, and clear visual hierarchy for KPIs, recent transactions, and budget tracking.',
               ar: 'تصميم لوحة تحكم مالية نظيفة بالعربية أولاً في Figma. استخدام تصميم قائم على البطاقات والوضع الداكن وتسلسل هرمي بصري واضح لمؤشرات الأداء والمعاملات الأخيرة وتتبع الميزانية.' },
    tools: ['Figma', 'Auto Layout', 'RTL Design', 'Iconify', 'Google Fonts (Cairo)'],
    outcome: { en: 'Personal concept project — received positive feedback from peers on LinkedIn. Used as portfolio reference for UI/UX capability.',
               ar: 'مشروع مفاهيمي شخصي — حصل على ردود فعل إيجابية من الأقران على LinkedIn. يُستخدم كمرجع في المحفظة لإظهار قدرات UI/UX.' },
    image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&q=80',
  },
  p5: {
    tag:     { en: 'Frontend', ar: 'تطوير الواجهات' },
    title:   { en: 'Personal Portfolio Site', ar: 'موقع المحفظة الشخصية' },
    problem: { en: 'Needed a professional online presence that showcases both accounting expertise and frontend development skills — without relying on generic templates.',
               ar: 'الحاجة إلى حضور احترافي على الإنترنت يعرض كلاً من الخبرة المحاسبية ومهارات تطوير الواجهات — دون الاعتماد على قوالب جاهزة.' },
    solution:{ en: 'Designed and built this portfolio from scratch: bilingual (EN/AR), responsive, single-page app with modular structure. Used Fraunces + DM Sans for a finance-meets-tech aesthetic.',
               ar: 'تصميم وبناء هذه المحفظة من الصفر: ثنائية اللغة (EN/AR)، متجاوبة، تطبيق صفحة واحدة بهيكل وحدوي. استخدام Fraunces + DM Sans لجمالية تجمع بين المالية والتكنولوجيا.' },
    tools: ['HTML5', 'CSS3 (Variables)', 'JavaScript (Vanilla)', 'Google Fonts', 'Netlify'],
    outcome: { en: 'Live portfolio site — clean, fast, and SEO-optimised. Serves as a real working reference for frontend skills.',
               ar: 'موقع محفظة مباشر — نظيف وسريع ومُحسَّن لمحركات البحث. يعمل كمرجع فعلي لمهارات تطوير الواجهات.' },
    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80',
  },
  p6: {
    tag:     { en: 'Inventory', ar: 'مخزون' },
    title:   { en: 'Inventory Control Revamp — Masafi', ar: 'إعادة هيكلة مراقبة المخزون — مصافي' },
    problem: { en: 'High stock variance in monthly inventory counts at a bottled water company — caused by poor reconciliation cadence and inconsistent counting procedures.',
               ar: 'تباين مخزون مرتفع في الجرد الشهري لشركة مياه معبأة — ناجم عن إيقاع تسوية ضعيف وإجراءات عد غير متسقة.' },
    solution:{ en: 'Redesigned the stock-count procedure: introduced cycle counting, established reconciliation deadlines, and built an Excel tracker linking physical counts to system records.',
               ar: 'إعادة تصميم إجراءات جرد المخزون: إدخال الجرد الدوري وتحديد مواعيد نهائية للتسوية وبناء متتبع Excel يربط الجرد الفعلي بسجلات النظام.' },
    tools: ['Excel', 'Internal Controls', 'Qoyod', 'Variance Analysis'],
    outcome: { en: 'Stock variance reduced by an estimated 70% within 2 months. Zero stock-related audit findings in the following quarter.',
               ar: 'انخفض تباين المخزون بنسبة تقديرية 70% خلال شهرين. لا نتائج تدقيق متعلقة بالمخزون في الربع التالي.' },
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  },
};
 
(function initProjectModals() {
  function openProjectModal(id) {
    const prj = PROJECTS[id];
    if (!prj) return;
    const mt = modalTranslations[currentLang];

    const toolsHTML = prj.tools.map(tool => `<span class="modal-tool">${tool}</span>`).join('');

    const html = `
      <div class="modal-header">
        <div class="modal-tag">${t(prj.tag)}</div>
        <h2 class="modal-title">${t(prj.title)}</h2>
      </div>
      <img src="${prj.image}" alt="${t(prj.title)}" style="width:100%;height:200px;object-fit:cover;border-radius:12px;margin-bottom:1.5rem;filter:brightness(0.8) saturate(0.7);">
      <div class="modal-section">
        <div class="modal-section-title">${mt.problem}</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">${t(prj.problem)}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${mt.solution}</div>
        <p style="font-size:0.9rem;color:var(--text-secondary);line-height:1.7;">${t(prj.solution)}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${mt.outcome}</div>
        <p style="font-size:0.9rem;color:var(--gold-light);line-height:1.7;font-style:italic;">"${t(prj.outcome)}"</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${mt.tools}</div>
        <div class="modal-tools-list">${toolsHTML}</div>
      </div>
      <div class="modal-ctas">
        <a href="mailto:amrashraf631@gmail.com?subject=Project Inquiry" class="btn btn-primary">✉ ${mt.discuss}</a>
        <a href="https://wa.me/966569621221" target="_blank" class="btn btn-ghost">💬 WhatsApp</a>
      </div>
    `;

    ModalSystem.open(html);
  }

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const id = card.dataset.project;
      window._activeModal = { type: 'project', id };
      openProjectModal(id);
    });
  });

  window._openProjectModal = openProjectModal;
})();
 
 
/* ──────────────────────────────────────────────────────────────
   9. COURSE MODALS
────────────────────────────────────────────────────────────── */
const COURSES = {
  c1: {
    icon: '📊',
    title:  { en: 'Advanced Excel for Finance',              ar: 'Excel المتقدم للمالية' },
    source: { en: 'Edraak Platform',                         ar: 'منصة إدراك' },
    desc:   { en: 'Comprehensive course covering advanced formulas (XLOOKUP, INDEX-MATCH, array formulas), Power Query for data transformation, Pivot Tables for financial reporting, and dashboard automation.',
              ar: 'دورة شاملة تغطي المعادلات المتقدمة (XLOOKUP، INDEX-MATCH، صيغ المصفوفات)، وPower Query لتحويل البيانات، والجداول المحورية للتقارير المالية، وأتمتة لوحات التحكم.' },
    topics: {
      en: ['XLOOKUP & Dynamic Arrays', 'Power Query & Data Cleaning', 'Financial Dashboards', 'VBA Macro Basics', 'Scenario & Sensitivity Analysis'],
      ar: ['XLOOKUP والمصفوفات الديناميكية', 'Power Query وتنظيف البيانات', 'لوحات التحكم المالية', 'أساسيات ماكرو VBA', 'تحليل السيناريو والحساسية'],
    },
  },
  c2: {
    icon: '🎓',
    title:  { en: 'Financial Accounting Fundamentals',       ar: 'أساسيات المحاسبة المالية' },
    source: { en: 'Mansoura University',                     ar: 'جامعة المنصورة' },
    desc:   { en: 'Formal university curriculum covering the full accounting cycle: journal entries, ledgers, trial balance, income statement, balance sheet and cash flow statement preparation.',
              ar: 'منهج جامعي رسمي يغطي دورة المحاسبة الكاملة: قيود اليومية والدفاتر وميزان المراجعة وقائمة الدخل والميزانية العمومية وإعداد قائمة التدفقات النقدية.' },
    topics: {
      en: ['Double-Entry Bookkeeping', 'Financial Statements', 'Adjusting Entries', 'Closing Entries', 'Accounting Ethics'],
      ar: ['القيد المزدوج', 'القوائم المالية', 'قيود التسوية', 'قيود الإقفال', 'أخلاقيات المحاسبة'],
    },
  },
  c3: {
    icon: '🏭',
    title:  { en: 'Cost Accounting for Industrial Companies', ar: 'محاسبة التكاليف للشركات الصناعية' },
    source: { en: 'Professional Certificate',                ar: 'شهادة مهنية' },
    desc:   { en: 'Specialised course covering job-order costing, process costing, overhead allocation, standard costing, variance analysis and cost-volume-profit analysis for manufacturing firms.',
              ar: 'دورة متخصصة تغطي تكاليف أوامر العمل والتكاليف المرحلية وتوزيع التكاليف العامة والتكاليف المعيارية وتحليل الانحرافات وتحليل التعادل للشركات الصناعية.' },
    topics: {
      en: ['Job-Order vs Process Costing', 'Overhead Allocation', 'Standard Costs & Variances', 'CVP Analysis', 'Activity-Based Costing'],
      ar: ['تكاليف الأوامر مقابل التكاليف المرحلية', 'توزيع التكاليف العامة', 'التكاليف المعيارية والانحرافات', 'تحليل التعادل', 'التكاليف على أساس الأنشطة'],
    },
  },
  c4: {
    icon: '🏗️',
    title:  { en: 'Contracting Accounting',                  ar: 'محاسبة المقاولات' },
    source: { en: 'Professional Certificate',                ar: 'شهادة مهنية' },
    desc:   { en: 'Industry-specific accounting for construction and contracting companies — covering percentage-of-completion method, contract cost tracking, retention management, and project profitability analysis.',
              ar: 'محاسبة متخصصة لشركات البناء والمقاولات — تشمل طريقة نسبة الإنجاز وتتبع تكاليف العقود وإدارة الاستقطاعات وتحليل ربحية المشاريع.' },
    topics: {
      en: ['Percentage-of-Completion Method', 'Contract Cost Tracking', 'Retention & Milestone Billing', 'Subcontractor Management', 'Project P&L Reporting'],
      ar: ['طريقة نسبة الإنجاز', 'تتبع تكاليف العقود', 'الاستقطاعات والفوترة المرحلية', 'إدارة المقاولين من الباطن', 'تقارير الأرباح والخسائر للمشاريع'],
    },
  },
  c5: {
    icon: '💼',
    title:  { en: 'Full Financial Accounting Course',        ar: 'دورة المحاسبة المالية الكاملة' },
    source: { en: 'Professional Certificate',                ar: 'شهادة مهنية' },
    desc:   { en: 'End-to-end practical accounting course covering everything from recording the first entry to preparing audited financial statements — with hands-on case studies using real Saudi company scenarios.',
              ar: 'دورة محاسبية عملية شاملة من البداية إلى النهاية تغطي كل شيء من تسجيل أول قيد إلى إعداد القوائم المالية المدققة — مع دراسات حالة عملية باستخدام سيناريوهات شركات سعودية حقيقية.' },
    topics: {
      en: ['Accounting Cycle Mastery', 'VAT Treatment', 'Bank Reconciliation', 'Payroll Accounting', 'Financial Statement Analysis'],
      ar: ['إتقان الدورة المحاسبية', 'معالجة ضريبة القيمة المضافة', 'تسوية الحسابات المصرفية', 'محاسبة الرواتب', 'تحليل القوائم المالية'],
    },
  },
  c6: {
    icon: '📋',
    title:  { en: 'VAT Accounting & Tax Returns',            ar: 'محاسبة ضريبة القيمة المضافة والإقرارات' },
    source: { en: 'Professional Certificate',                ar: 'شهادة مهنية' },
    desc:   { en: 'Saudi-specific VAT course covering ZATCA regulations, input/output tax, VAT filing procedures, exemptions, penalties, and end-to-end return preparation using the ZATCA e-portal.',
              ar: 'دورة ضريبة القيمة المضافة الخاصة بالمملكة العربية السعودية تغطي لوائح زاتكا والضريبة المدخلة والمخرجة وإجراءات تقديم الإقرارات والإعفاءات والغرامات وإعداد الإقرارات بشكل كامل عبر بوابة زاتكا الإلكترونية.' },
    topics: {
      en: ['VAT Fundamentals (ZATCA)', 'Input vs Output Tax', 'VAT Return Filing', 'Exempt & Zero-Rated Supplies', 'Audit Preparation'],
      ar: ['أساسيات ضريبة القيمة المضافة (زاتكا)', 'الضريبة المدخلة مقابل المخرجة', 'تقديم الإقرار الضريبي', 'التوريدات المعفاة والخاضعة للصفر', 'الاستعداد للتدقيق'],
    },
  },
};
 
(function initCourseModals() {
  function openCourseModal(id) {
    const crs = COURSES[id];
    if (!crs) return;
    const mt = modalTranslations[currentLang];

    const topicsHTML = t(crs.topics).map(topic => `
      <div class="modal-step">
        <span style="color:var(--gold);flex-shrink:0;">✓</span>
        <span>${topic}</span>
      </div>
    `).join('');

    const html = `
      <div class="modal-header">
        <div style="font-size:3rem;margin-bottom:0.75rem;">${crs.icon}</div>
        <div class="modal-tag">${t(crs.source)}</div>
        <h2 class="modal-title">${t(crs.title)}</h2>
        <p class="modal-desc">${t(crs.desc)}</p>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">${mt.topics}</div>
        <div class="modal-steps">${topicsHTML}</div>
      </div>
      <div class="modal-ctas">
        <a href="mailto:amrashraf631@gmail.com" class="btn btn-primary">✉ ${mt.ask}</a>
      </div>
    `;

    ModalSystem.open(html);
  }

  document.querySelectorAll('.course-card[data-course]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.course;
      window._activeModal = { type: 'course', id };
      openCourseModal(id);
    });
  });

  window._openCourseModal = openCourseModal;
})();
 
 
/* ──────────────────────────────────────────────────────────────
   10. CONTACT FORM
────────────────────────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
 
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const subject = form.querySelector('[name="subject"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
 
    if (!name || !email || !message) {
      showToast(window._langToastMsg || 'Please fill in all required fields.', 'error');
      return;
    }
 
    // Open mailto — works without a backend
    const mailtoLink = `mailto:amrashraf631@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
    showToast(window._langEmailMsg || 'Opening your email client…', 'success');
    form.reset();
  });
})();
 
 
/* ──────────────────────────────────────────────────────────────
   11. TOAST NOTIFICATION
────────────────────────────────────────────────────────────── */
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
 
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    background: type === 'error' ? 'var(--red)' : 'var(--gold)',
    color: 'var(--bg)',
    padding: '0.75rem 1.5rem',
    borderRadius: '100px',
    fontSize: '0.88rem',
    fontWeight: '600',
    zIndex: '9999',
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    animation: 'fadeInUp 0.3s ease',
  });
 
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}
 
 
/* ──────────────────────────────────────────────────────────────
   12. BACK TO TOP
────────────────────────────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.querySelector('.fab-top');
  if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
 

/* ══════════════════════════════════════════════════════════════
   13. THEME TOGGLE — dark / light
   Saves preference to localStorage. Default = dark.
══════════════════════════════════════════════════════════════ */
(function initThemeToggle() {
  const btn      = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-icon-dark');
  const iconLight= document.getElementById('theme-icon-light');
  const html     = document.documentElement;

  // Restore saved preference
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') applyLight();

  function applyLight() {
    html.classList.add('light-theme');
    if (iconDark)  iconDark.style.display  = 'none';
    if (iconLight) iconLight.style.display = 'block';
  }
  function applyDark() {
    html.classList.remove('light-theme');
    if (iconDark)  iconDark.style.display  = 'block';
    if (iconLight) iconLight.style.display = 'none';
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const isLight = html.classList.contains('light-theme');
      if (isLight) {
        applyDark();
        localStorage.setItem('theme', 'dark');
      } else {
        applyLight();
        localStorage.setItem('theme', 'light');
      }
    });
  }
})();


/* ══════════════════════════════════════════════════════════════
   14. LANGUAGE TOGGLE — English / Arabic (full-site i18n)
   Uses data-key attributes + translations object.
   Sets html lang + dir. Saves to localStorage.
══════════════════════════════════════════════════════════════ */

// ── Translations object ──────────────────────────────────────
const TRANSLATIONS = {
  en: {
    // ── Navbar
    nav_about:      'About',
    nav_skills:     'Skills',
    nav_experience: 'Experience',
    nav_services:   'Services',
    nav_projects:   'Projects',
    nav_courses:    'Courses',
    nav_contact:    'Contact',

    // ── Hero
    hero_badge:       'Available for work · Jeddah, Saudi Arabia',
    hero_title_role:  'Financial Accountant',
    hero_title_extra: 'UI/UX · Frontend',
    hero_desc:        'Detail-oriented accountant with hands-on experience in cost analysis, inventory control and ZATCA-compliant VAT reporting — with a curious mind for design and code.',
    btn_contact:      'Get in Touch',
    btn_cv:           'Download CV',
    btn_linkedin:     'LinkedIn ↗',
    stat_years:       'Years Experience',
    stat_systems:     'Accounting Systems',
    stat_accounts:    'Accounts Built',
    stat_zatca:       'ZATCA Compliant',

    // ── About
    about_label:      'About Me',
    about_h2_1:       'Numbers',
    about_h2_2:       'Interfaces',
    about_loc_label:  'Location',
    about_nat_label:  'Nationality',
    about_deg_label:  'Degree',
    about_deg_val:    'B.Com Accounting — Mansoura Univ.',
    about_email_label:'Email',
    about_phone_label:'Phone',
    about_lang_label: 'Languages',
    about_lang_val:   'Arabic (Native) · English (Professional)',
    about_p1: "I\'m Amr — a Financial Accountant based in Jeddah with a Bachelor of Commerce (Accounting) from Mansoura University. I work daily with accounting systems like Daftra, Qoyod, Rawa, Wafiq and Phenix, and genuinely enjoy turning messy numbers into reports a manager can read in 30 seconds.",
    about_p2: "My experience spans contracting companies and industrial manufacturers — from implementing accounting systems from scratch to managing full cost models, inventory controls, and ZATCA-compliant VAT workflows. I\'ve also worked as a storekeeper / warehouse keeper, which gave me deep practical insight into inventory management from the floor up.",
    about_p3: "On the side, I tinker with UI/UX design and frontend development — because building clean, useful interfaces is just another form of structuring information, which is exactly what accounting taught me to love.",

    // ── Skills
    skills_label:   'Skills',
    skills_h2:      'What I',
    skills_h2_b:    'Do Well',
    skills_sub:     'A blend of financial expertise, design sensibility and frontend capability.',
    tab_accounting: 'Accounting',
    tab_tools:      'Tools & Software',
    tab_frontend:   'Frontend',
    tab_design:     'Design',

    // ── Skill names
    sk_fin_rep: 'Financial Reporting & Analysis',
    sk_vat:     'VAT Reporting (ZATCA)',
    sk_cost:    'Cost Accounting & Inventory',
    sk_fs:      'Financial Statements',
    sk_inv:     'Inventory Management',
    sk_cont:    'Contracting Accounting',
    sk_excel:   'Microsoft Excel (Advanced)',
    sk_oracle:  'Oracle ERP (Intro)',
    sk_peach:   'Peachtree (Intro)',
    sk_html:    'HTML5 & Semantic Markup',
    sk_css:     'CSS3 & Responsive Layouts',
    sk_js:      'JavaScript Fundamentals',
    sk_tailwind:'Tailwind CSS',
    sk_react:   'React (Learning)',
    sk_ux:      'UI / UX Principles',
    sk_wire:    'Wireframing & Prototyping',
    sk_color:   'Color & Typography',

    // ── Experience
    exp_label:    'Experience',
    exp_h2:       "Where I\'ve",
    exp_h2_b:     'Worked',
    badge_current:'● Current',
    edu_label:    'Education',
    edu_degree:   'Bachelor of Commerce — Accounting',

    exp1_co:     'Modern Supplies & Construction for General Contracting Est.',
    exp1_role:   'Financial Accountant',
    exp1_period: 'April 2025 — Present',
    exp1_loc:    'Jeddah, Saudi Arabia',
    exp1_b1:     'Implemented Daftra Accounting System, improving organisation and reporting efficiency',
    exp1_b2:     'Recorded daily transactions: sales, purchases, expenses and cash receipts',
    exp1_b3:     'Managed customer & supplier accounts and ran regular reconciliations',
    exp1_b4:     'Prepared revenue, expense and periodic financial reports for management',
    exp1_b5:     'Participated in pricing analysis and profit-margin calculations',
    exp1_b6:     'Coordinated with production to link manufacturing stages to cost accounting',

    exp2_co:     'Masafi Bottled Drinking Water Company',
    exp2_role:   'Financial Accountant',
    exp2_period: 'July 2024 — March 2025',
    exp2_loc:    'Qassim, Saudi Arabia',
    exp2_b1:     'Prepared journal entries with high accuracy, reducing accounting errors',
    exp2_b2:     'Cleared delayed invoices within one month, improving cash flow',
    exp2_b3:     'Expanded the chart of accounts by adding 20+ new accounts',
    exp2_b4:     'Performed supplier reconciliations and resolved financial discrepancies',
    exp2_b5:     'Improved inventory control procedures and reduced stock variances by ~70%',
    exp2_b6:     'Assisted in VAT reporting and minimised tax-related errors',

    exp3_co:     'Egy Drill Misr',
    exp3_role:   'Storekeeper / Warehouse Keeper',
    exp3_period: 'January 2021 - February 2022',
    exp3_loc:    'Egypt',
    exp3_b1:     'Managed warehouse inventory — receiving, organising, issuing and tracking stock',
    exp3_b2:     'Maintained accurate stock records and conducted regular physical counts',
    exp3_b3:     'Coordinated with procurement and accounting teams on purchase orders and invoices',
    exp3_b4:     'Identified discrepancies between physical and system stock counts',
    exp3_b5:     'Hands-on experience that informs my accounting approach to inventory management',

    // ── Services
    svc_label: 'Services',
    svc_h2:    'How I Can',
    svc_h2_b:  'Help You',
    svc_sub:   'Click any service to see the full scope, workflow steps, tools and a real example.',
    s1_title:  'Accounting Systems Setup',
    s1_desc:   'Implementing and configuring Daftra, Qoyod, Rawa, Wafiq or Phenix for SMEs — from chart of accounts to monthly reporting.',
    s2_title:  'VAT & ZATCA Compliance',
    s2_desc:   'Monthly/quarterly VAT returns, reconciliation checklists and clean documentation that survives any audit.',
    s3_title:  'Financial Reporting & Analysis',
    s3_desc:   'Custom Excel dashboards, cost models and pricing analyses that turn raw entries into decisions.',
    s4_title:  'UI / UX Design',
    s4_desc:   'Wireframes and Figma mockups for finance and admin tools — clean, Arabic-friendly, RTL-aware.',
    s5_title:  'Simple Websites',
    s5_desc:   'Responsive landing pages and small dashboards using HTML, CSS, JavaScript and Tailwind.',
    s6_title:  'Excel Training',
    s6_desc:   'Practical sessions on advanced formulas, pivot tables and financial automation tailored to your team.',

    // ── Projects
    proj_label:      'Projects',
    proj_h2:         'Selected',
    proj_h2_b:       'Work',
    proj_sub:        'Click any project for the full problem → solution → outcome breakdown.',
    filter_all:      'All',
    filter_accounting:'Accounting',
    filter_design:   'UI Design',
    filter_frontend: 'Frontend',

    // ── Expertise tags
    tag_fin:  'Financial Accounting',
    tag_cost: 'Cost Accounting',
    tag_inv:  'Inventory Management',
    tag_vat:  'VAT Reports (ZATCA)',
    tag_cont: 'Contracting Accounting',
    tag_excel:'Excel (Advanced)',
    tag_erp:  'ERP Systems',
    tag_uiux: 'UI / UX Design',
    tag_fe:   'Frontend (HTML/CSS/JS)',
    tag_react:'React (Learning)',

    // ── Project cards
    p1_tag:   'Accounting',
    p1_title: 'Daftra Implementation — Modern Supplies',
    p1_sum:   'Migrated a contracting firm from spreadsheets to Daftra, structured the chart of accounts and automated monthly reporting.',
    p2_tag:   'Tax & Compliance',
    p2_title: 'VAT Returns Workflow (ZATCA)',
    p2_sum:   'Designed a repeatable monthly VAT-reporting workflow with reconciliation checklists, reducing tax-filing errors significantly.',
    p3_tag:   'Cost Accounting',
    p3_title: 'Cost Analysis Model — Manufacturing',
    p3_sum:   'Built an Excel cost model linking cutting, painting, galvanising, installation and packaging stages to job-level profitability.',
    p4_tag:   'UI Design',
    p4_title: 'Finance Dashboard — UI Concept',
    p4_sum:   'Personal Figma concept for a clean Arabic-first finance dashboard targeting small Saudi businesses.',
    p5_tag:   'Frontend',
    p5_title: 'Personal Portfolio Site',
    p5_sum:   'This portfolio — bilingual (EN/AR), responsive and built as a hands-on frontend exercise with pure HTML/CSS/JS.',
    p6_tag:   'Inventory',
    p6_title: 'Inventory Control Revamp — Masafi',
    p6_sum:   'Redesigned stock-count procedures and reconciliation cadence, materially reducing stock variances.',

    // ── Courses
    courses_label: 'Courses & Certifications',
    courses_h2:    'Continuous',
    courses_h2_b:  'Learning',
    courses_sub:   'Click any course card to see topics covered and details.',
    c1_title: 'Advanced Excel for Finance',
    c1_src:   'Edraak Platform',
    c2_title: 'Financial Accounting',
    c2_src:   'Mansoura University',
    c3_title: 'Cost Accounting (Industrial)',
    c3_src:   'Professional Certificate',
    c4_title: 'Contracting Accounting',
    c4_src:   'Professional Certificate',
    c5_title: 'Full Financial Accounting',
    c5_src:   'Professional Certificate',
    c6_title: 'VAT & Tax Returns',
    c6_src:   'Professional Certificate',

    // ── Downloads
    dl_label: 'Downloads',
    dl_h2:    'Get My',
    dl_h2_b:  'Files',
    dl_sub:   'Download my CV, sample Excel templates, and project files.',
    dl1_name: 'Curriculum Vitae (EN)',
    dl1_desc: 'Full CV — Financial Accountant & UI/UX',
    dl2_name: 'VAT Tracker Template',
    dl2_desc: 'Monthly VAT reconciliation spreadsheet',
    dl3_name: 'Cost Analysis Model',
    dl3_desc: 'Manufacturing cost model template',
    dl4_name: 'Portfolio Source Files',
    dl4_desc: 'HTML, CSS, JS source for this site',

    // ── Testimonials
    test_label: 'Testimonials',
    test_h2:    'What They',
    test_h2_b:  'Say',
    t1_text:   'Amr restructured our chart of accounts in weeks. Monthly reports now land on my desk on the 3rd, every month.',
    t1_author: 'Operations Manager — Modern Supplies',
    t2_text:   'Tax-filing errors dropped to near zero after Amr standardised our VAT workflow. Detail-oriented and reliable.',
    t2_author: 'Finance Lead — Masafi Water',

    // ── Contact
    contact_label: 'Contact',
    contact_h2:    "Let\'s",
    contact_h2_b:  'Talk',
    contact_sub:   "Have a project in mind, need accounting support, or just want to say hello? I\'d love to hear from you.",
    ci_email:      'Email',
    ci_phone:      'Phone / WhatsApp',
    ci_loc:        'Location',
    ci_linkedin:   'LinkedIn',
    btn_whatsapp:  '💬 Message on WhatsApp',
    form_name:     'Name *',
    form_email:    'Email *',
    form_subject:  'Subject',
    form_message:  'Message *',
    btn_send:      'Send Message',

    // ── Footer
    foot_about:    'About',
    foot_services: 'Services',
    foot_projects: 'Projects',
    foot_contact:  'Contact',
    foot_linkedin: 'LinkedIn ↗',
    footer_copy:   '© 2025 Amr Ashraf · Jeddah, Saudi Arabia',
  },

  ar: {
    // ── Navbar
    nav_about:      'عني',
    nav_skills:     'المهارات',
    nav_experience: 'الخبرة',
    nav_services:   'الخدمات',
    nav_projects:   'المشاريع',
    nav_courses:    'الدورات',
    nav_contact:    'تواصل معي',

    // ── Hero
    hero_badge:       'متاح للعمل · جدة، المملكة العربية السعودية',
    hero_title_role:  'محاسب مالي',
    hero_title_extra: 'تصميم UI/UX · تطوير الواجهات',
    hero_desc:        'محاسب دقيق بخبرة عملية في تحليل التكاليف، ومراقبة المخزون، وإعداد تقارير ضريبة القيمة المضافة وفق متطلبات هيئة الزكاة والضريبة — مع شغف حقيقي بالتصميم والبرمجة.',
    btn_contact:      'تواصل معي',
    btn_cv:           'تحميل السيرة الذاتية',
    btn_linkedin:     'لينكد إن ↗',
    stat_years:       'سنوات خبرة',
    stat_systems:     'أنظمة محاسبية',
    stat_accounts:    'حساب منجز',
    stat_zatca:       'متوافق مع الزكاة',

    // ── About
    about_label:      'نبذة عني',
    about_h2_1:       'الأرقام',
    about_h2_2:       'والواجهات',
    about_loc_label:  'الموقع',
    about_nat_label:  'الجنسية',
    about_deg_label:  'الشهادة',
    about_deg_val:    'بكالوريوس تجارة — محاسبة، جامعة المنصورة',
    about_email_label:'البريد الإلكتروني',
    about_phone_label:'الهاتف',
    about_lang_label: 'اللغات',
    about_lang_val:   'العربية (اللغة الأم) · الإنجليزية (مهني)',
    about_p1: 'أنا عمرو — محاسب مالي مقيم في جدة، حاصل على بكالوريوس تجارة تخصص محاسبة من جامعة المنصورة. أعمل يومياً مع أنظمة محاسبية متعددة كدفترة وقيود وراوة ووفيق وفينيكس، وأستمتع حقاً بتحويل الأرقام المبعثرة إلى تقارير يقرأها المدير في ثلاثين ثانية.',
    about_p2: 'تمتد خبرتي بين شركات المقاولات والمصانع الصناعية — من تطبيق أنظمة المحاسبة من الصفر إلى إدارة نماذج التكلفة الكاملة، ومراقبة المخزون، ودورات ضريبة القيمة المضافة وفق اشتراطات هيئة الزكاة. عملت أيضاً أميناً للمستودع مما منحني فهماً عملياً عميقاً لإدارة المخزون من الأرض.',
    about_p3: 'في أوقات الفراغ، أتعمق في تصميم واجهات المستخدم وتطوير الواجهات الأمامية — لأن بناء واجهات نظيفة وفعّالة هو شكل آخر من أشكال تنظيم المعلومات، وهو ما علّمتني المحاسبة أن أحبه.',

    // ── Skills
    skills_label:   'المهارات',
    skills_h2:      'ما أتقنه',
    skills_h2_b:    '',
    skills_sub:     'مزيج من الخبرة المالية والحس التصميمي وقدرات تطوير الواجهات.',
    tab_accounting: 'المحاسبة',
    tab_tools:      'الأدوات والبرامج',
    tab_frontend:   'تطوير الواجهات',
    tab_design:     'التصميم',

    // ── Skill names
    sk_fin_rep: 'التقارير والتحليل المالي',
    sk_vat:     'إقرارات ضريبة القيمة المضافة (زاتكا)',
    sk_cost:    'محاسبة التكاليف والمخزون',
    sk_fs:      'القوائم المالية',
    sk_inv:     'إدارة المخزون',
    sk_cont:    'محاسبة المقاولات',
    sk_excel:   'Microsoft Excel (متقدم)',
    sk_oracle:  'Oracle ERP (مبتدئ)',
    sk_peach:   'Peachtree (مبتدئ)',
    sk_html:    'HTML5 والوسوم الدلالية',
    sk_css:     'CSS3 والتصميم المتجاوب',
    sk_js:      'أساسيات JavaScript',
    sk_tailwind:'Tailwind CSS',
    sk_react:   'React (قيد التعلم)',
    sk_ux:      'مبادئ UI/UX',
    sk_wire:    'الإطارات والنماذج الأولية',
    sk_color:   'الألوان والطباعة',

    // ── Experience
    exp_label:    'الخبرة المهنية',
    exp_h2:       'أين',
    exp_h2_b:     'عملت',
    badge_current:'● حالياً',
    edu_label:    'التعليم',
    edu_degree:   'بكالوريوس تجارة — محاسبة',

    exp1_co:     'مؤسسة موديرن سبلايز للمقاولات العامة',
    exp1_role:   'محاسب مالي',
    exp1_period: 'أبريل 2025 — حتى الآن',
    exp1_loc:    'جدة، المملكة العربية السعودية',
    exp1_b1:     'تطبيق نظام دفترة المحاسبي وتحسين كفاءة التنظيم وإعداد التقارير',
    exp1_b2:     'تسجيل العمليات اليومية: المبيعات والمشتريات والمصروفات والمقبوضات النقدية',
    exp1_b3:     'إدارة حسابات العملاء والموردين وإجراء التسويات الدورية',
    exp1_b4:     'إعداد تقارير الإيرادات والمصروفات والتقارير المالية الدورية للإدارة',
    exp1_b5:     'المشاركة في تحليل التسعير وحسابات هامش الربح',
    exp1_b6:     'التنسيق مع الإنتاج لربط مراحل التصنيع بمحاسبة التكاليف',

    exp2_co:     'شركة مصافي لمياه الشرب المعبأة',
    exp2_role:   'محاسب مالي',
    exp2_period: 'يوليو 2024 — مارس 2025',
    exp2_loc:    'القصيم، المملكة العربية السعودية',
    exp2_b1:     'إعداد قيود اليومية بدقة عالية مما أدى إلى تقليل الأخطاء المحاسبية',
    exp2_b2:     'تسوية الفواتير المتأخرة خلال شهر واحد مع تحسين التدفق النقدي',
    exp2_b3:     'توسيع دليل الحسابات بإضافة أكثر من 20 حساباً جديداً',
    exp2_b4:     'إجراء تسويات الموردين وحل التعارضات المالية',
    exp2_b5:     'تحسين إجراءات مراقبة المخزون وتقليص الفروقات بنسبة ~70%',
    exp2_b6:     'المساعدة في إعداد إقرارات ضريبة القيمة المضافة والحد من الأخطاء الضريبية',

    exp3_co:     'إيجي دريل مصر',
    exp3_role:   'أمين مستودع',
    exp3_period: 'يناير 2021 - فبراير 2022',
    exp3_loc:    'مصر',
    exp3_b1:     'إدارة مخزون المستودع — الاستلام والتنظيم والصرف والتتبع',
    exp3_b2:     'الحفاظ على سجلات مخزون دقيقة وإجراء جرد دوري منتظم',
    exp3_b3:     'التنسيق مع فرق المشتريات والمحاسبة بشأن أوامر الشراء والفواتير',
    exp3_b4:     'رصد التعارضات بين المخزون الفعلي وسجلات النظام',
    exp3_b5:     'خبرة عملية تُثري أسلوبي المحاسبي في إدارة المخزون',

    // ── Services
    svc_label: 'الخدمات',
    svc_h2:    'كيف يمكنني',
    svc_h2_b:  'مساعدتك',
    svc_sub:   'اضغط على أي خدمة لرؤية النطاق الكامل وخطوات العمل والأدوات المستخدمة.',
    s1_title:  'إعداد أنظمة المحاسبة',
    s1_desc:   'تطبيق وتهيئة أنظمة دفترة وقيود وراوة ووفيق وفينيكس للشركات الصغيرة والمتوسطة — من دليل الحسابات إلى التقارير الشهرية.',
    s2_title:  'الامتثال لضريبة القيمة المضافة والزكاة',
    s2_desc:   'إعداد إقرارات ضريبة القيمة المضافة الشهرية والربع سنوية، وقوائم التسوية، والتوثيق المدعوم لأي تدقيق.',
    s3_title:  'التقارير والتحليل المالي',
    s3_desc:   'لوحات تحكم Excel مخصصة، ونماذج تكاليف، وتحليلات تسعير تحوّل القيود الخام إلى قرارات إدارية.',
    s4_title:  'تصميم واجهات المستخدم',
    s4_desc:   'إطارات تصميمية ونماذج Figma عالية الدقة للأدوات المالية وتطبيقات الشركات — ودعم كامل للغة العربية واتجاه RTL.',
    s5_title:  'مواقع وصفحات هبوط بسيطة',
    s5_desc:   'صفحات هبوط متجاوبة ولوحات تحكم صغيرة باستخدام HTML وCSS وJavaScript وTailwind.',
    s6_title:  'تدريب على Excel',
    s6_desc:   'جلسات تدريبية عملية على الصيغ المتقدمة والجداول المحورية وأتمتة التقارير المالية.',

    // ── Projects
    proj_label:      'المشاريع',
    proj_h2:         'أبرز',
    proj_h2_b:       'الأعمال',
    proj_sub:        'اضغط على أي مشروع للاطلاع على المشكلة والحل والنتيجة.',
    filter_all:      'الكل',
    filter_accounting:'محاسبة',
    filter_design:   'تصميم UI',
    filter_frontend: 'تطوير الواجهات',

    // ── Expertise tags
    tag_fin:  'محاسبة مالية',
    tag_cost: 'محاسبة تكاليف',
    tag_inv:  'إدارة المخزون',
    tag_vat:  'تقارير ضريبة القيمة المضافة',
    tag_cont: 'محاسبة المقاولات',
    tag_excel:'Excel (متقدم)',
    tag_erp:  'أنظمة ERP',
    tag_uiux: 'تصميم UI/UX',
    tag_fe:   'تطوير الواجهات (HTML/CSS/JS)',
    tag_react:'React (قيد التعلم)',

    // ── Project cards
    p1_tag:   'محاسبة',
    p1_title: 'تطبيق دفترة — موديرن سبلايز',
    p1_sum:   'ترحيل شركة مقاولات من جداول بيانات إلى دفترة، وإعادة بناء دليل الحسابات وأتمتة التقارير الشهرية.',
    p2_tag:   'ضريبة وامتثال',
    p2_title: 'سير عمل إقرارات ضريبة القيمة المضافة (زاتكا)',
    p2_sum:   'تصميم سير عمل شهري متكرر لإعداد تقارير ضريبة القيمة المضافة مع قوائم التسوية، مما أدى إلى خفض أخطاء التقديم الضريبي.',
    p3_tag:   'محاسبة تكاليف',
    p3_title: 'نموذج تحليل التكاليف — التصنيع',
    p3_sum:   'بناء نموذج تكاليف Excel متعدد المراحل يربط القطع والطلاء والجلفنة والتركيب والتغليف بربحية المشروع.',
    p4_tag:   'تصميم UI',
    p4_title: 'لوحة تحكم مالية — تصميم مفاهيمي',
    p4_sum:   'تصميم Figma مفاهيمي للوحة تحكم مالية نظيفة بالعربية أولاً تستهدف الشركات السعودية الصغيرة.',
    p5_tag:   'تطوير الواجهات',
    p5_title: 'موقع المحفظة الشخصية',
    p5_sum:   'هذا الموقع — ثنائي اللغة (EN/AR)، متجاوب، تمرين عملي في تطوير الواجهات باستخدام HTML/CSS/JS.',
    p6_tag:   'مخزون',
    p6_title: 'إعادة هيكلة مراقبة المخزون — مصافي',
    p6_sum:   'إعادة تصميم إجراءات جرد المخزون وجداول التسوية مما أدى إلى تقليص التباينات بصورة ملموسة.',

    // ── Courses
    courses_label: 'الدورات والشهادات',
    courses_h2:    'التعلم',
    courses_h2_b:  'المستمر',
    courses_sub:   'اضغط على أي بطاقة دورة لمعرفة المواضيع والتفاصيل.',
    c1_title: 'Excel المتقدم للمالية',
    c1_src:   'منصة إدراك',
    c2_title: 'المحاسبة المالية',
    c2_src:   'جامعة المنصورة',
    c3_title: 'محاسبة التكاليف الصناعية',
    c3_src:   'شهادة مهنية',
    c4_title: 'محاسبة المقاولات',
    c4_src:   'شهادة مهنية',
    c5_title: 'دورة المحاسبة المالية الكاملة',
    c5_src:   'شهادة مهنية',
    c6_title: 'محاسبة ضريبة القيمة المضافة والإقرارات',
    c6_src:   'شهادة مهنية',

    // ── Downloads
    dl_label: 'التنزيلات',
    dl_h2:    'احصل على',
    dl_h2_b:  'ملفاتي',
    dl_sub:   'حمّل سيرتي الذاتية، ونماذج Excel، وملفات المشاريع.',
    dl1_name: 'السيرة الذاتية (EN)',
    dl1_desc: 'سيرة ذاتية كاملة — محاسب مالي وUI/UX',
    dl2_name: 'نموذج متابعة ضريبة القيمة المضافة',
    dl2_desc: 'جدول تسوية ضريبة القيمة المضافة الشهرية',
    dl3_name: 'نموذج تحليل التكاليف',
    dl3_desc: 'نموذج تكاليف التصنيع',
    dl4_name: 'ملفات المحفظة المصدرية',
    dl4_desc: 'كود HTML وCSS وJS لهذا الموقع',

    // ── Testimonials
    test_label: 'آراء العملاء',
    test_h2:    'ماذا',
    test_h2_b:  'قالوا',
    t1_text:   'أعاد عمرو هيكلة دليل حساباتنا في أسابيع. التقارير الشهرية تصلني الآن في الثالث من كل شهر دون استثناء.',
    t1_author: 'مدير العمليات — موديرن سبلايز',
    t2_text:   'انخفضت أخطاء تقديم الضريبة إلى شبه صفر بعد أن وحّد عمرو سير عمل ضريبة القيمة المضافة. دقيق وموثوق.',
    t2_author: 'مسؤول المالية — مصافي للمياه',

    // ── Contact
    contact_label: 'تواصل معي',
    contact_h2:    'لنتحدث',
    contact_h2_b:  '',
    contact_sub:   'لديك مشروع، أو تحتاج دعماً محاسبياً، أو تريد فقط التحدث؟ يسعدني سماعك.',
    ci_email:      'البريد الإلكتروني',
    ci_phone:      'هاتف / واتساب',
    ci_loc:        'الموقع',
    ci_linkedin:   'لينكد إن',
    btn_whatsapp:  '💬 راسلني على واتساب',
    form_name:     'الاسم *',
    form_email:    'البريد الإلكتروني *',
    form_subject:  'الموضوع',
    form_message:  'الرسالة *',
    btn_send:      'إرسال الرسالة',

    // ── Footer
    foot_about:    'عني',
    foot_services: 'الخدمات',
    foot_projects: 'المشاريع',
    foot_contact:  'تواصل',
    foot_linkedin: 'لينكد إن ↗',
    footer_copy:   '© 2025 عمرو أشرف · جدة، المملكة العربية السعودية',
  }
};

// ── Language Toggle Logic ────────────────────────────────────
(function initLangToggle() {
  const btn       = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  const html      = document.documentElement;

  // Restore saved language (default = 'en')
  // currentLang is already set globally above; apply visuals if 'ar'
  if (currentLang === 'ar') applyLang('ar');

  function applyLang(lang) {
    currentLang = lang;          // keep global in sync
    const tr = TRANSLATIONS[lang];
    if (!tr) return;

    // Set html lang + dir
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    // Update all elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.dataset.key;
      if (tr[key] !== undefined) {
        el.textContent = tr[key];
      }
    });

    // Update input placeholders
    const placeholders = {
      en: { name: 'Your full name', email: 'you@example.com', subject: "What's this about?", message: 'Tell me about your project or question…' },
      ar: { name: 'اسمك الكامل', email: 'بريدك@مثال.com', subject: 'ما موضوع رسالتك؟', message: 'أخبرني عن مشروعك أو سؤالك…' },
    };
    const ph = placeholders[lang];
    const nameEl    = document.getElementById('name');
    const emailEl   = document.getElementById('email');
    const subjectEl = document.getElementById('subject');
    const msgEl     = document.getElementById('message');
    if (nameEl)    nameEl.placeholder    = ph.name;
    if (emailEl)   emailEl.placeholder   = ph.email;
    if (subjectEl) subjectEl.placeholder = ph.subject;
    if (msgEl)     msgEl.placeholder     = ph.message;

    // Update lang toggle button label
    if (langLabel) langLabel.textContent = lang === 'ar' ? 'EN' : 'عربي';

    // Update form validation toast message key
    window._langToastMsg = lang === 'ar'
      ? 'يرجى ملء جميع الحقول المطلوبة.'
      : 'Please fill in all required fields.';
    window._langEmailMsg = lang === 'ar'
      ? 'جارٍ فتح تطبيق البريد الإلكتروني…'
      : 'Opening your email client…';

    // Re-render open modal in the new language
    const overlay = document.getElementById('modal-overlay');
    if (overlay && overlay.classList.contains('open') && window._activeModal) {
      const { type, id } = window._activeModal;
      if (type === 'service' && window._openServiceModal) window._openServiceModal(id);
      if (type === 'project' && window._openProjectModal) window._openProjectModal(id);
      if (type === 'course'  && window._openCourseModal)  window._openCourseModal(id);
    }

    // Save
    localStorage.setItem('lang', lang);
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const next = currentLang === 'en' ? 'ar' : 'en';
      applyLang(next);
    });
  }
})();

// ── Patch contact form toast messages for current lang ───────
// Override showToast calls in the form to use translated messages
document.addEventListener('DOMContentLoaded', () => {
  // We already initialized, re-apply lang to set toast messages
  const savedLang = localStorage.getItem('lang') || 'en';
  window._langToastMsg = savedLang === 'ar'
    ? 'يرجى ملء جميع الحقول المطلوبة.'
    : 'Please fill in all required fields.';
  window._langEmailMsg = savedLang === 'ar'
    ? 'جارٍ فتح تطبيق البريد الإلكتروني…'
    : 'Opening your email client…';
});
