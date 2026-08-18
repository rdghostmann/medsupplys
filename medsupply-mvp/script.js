/* ═══════════════════════════════════════════════════════════
   MEDSUPPLY — VANILLA JS SPA
   Pharmaceutical B2B Marketplace
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── DATA ─────────────────────────────────────────────────
const PRODUCTS = [
  {id:'PRD-001',name:'Amoxicillin 500mg',cat:'Antibiotics',emoji:'💊',price:45,unit:'per strip (10)',stock:18400,lowAt:2000,mfr:'Pfizer Nigeria',nafdac:'A4-0141',desc:'Broad-spectrum penicillin antibiotic'},
  {id:'PRD-002',name:'Paracetamol 500mg',cat:'Analgesics',emoji:'🔵',price:12,unit:'per strip (10)',stock:52000,lowAt:5000,mfr:'Emzor Pharma',nafdac:'A4-0882',desc:'Pain relief & antipyretic'},
  {id:'PRD-003',name:'Ciprofloxacin 500mg',cat:'Antibiotics',emoji:'🟡',price:38,unit:'per strip (10)',stock:1200,lowAt:2000,mfr:'May & Baker Nigeria',nafdac:'A4-1234',desc:'Fluoroquinolone antibiotic'},
  {id:'PRD-004',name:'Metformin 500mg',cat:'Antidiabetic',emoji:'🟢',price:22,unit:'per strip (10)',stock:9800,lowAt:1000,mfr:'Fidson Healthcare',nafdac:'A4-5512',desc:'Type-2 diabetes management'},
  {id:'PRD-005',name:'Lisinopril 10mg',cat:'Antihypertensive',emoji:'🔴',price:55,unit:'per strip (10)',stock:0,lowAt:1000,mfr:'GlaxoSmithKline Nigeria',nafdac:'A4-3391',desc:'ACE inhibitor for hypertension'},
  {id:'PRD-006',name:'Omeprazole 20mg',cat:'Gastrointestinal',emoji:'🟣',price:28,unit:'per strip (10)',stock:14600,lowAt:2000,mfr:'Neimeth International',nafdac:'A4-7723',desc:'Proton pump inhibitor'},
  {id:'PRD-007',name:'Azithromycin 250mg',cat:'Antibiotics',emoji:'🟠',price:65,unit:'per strip (6)',stock:6700,lowAt:1500,mfr:'Pfizer Nigeria',nafdac:'A4-2241',desc:'Macrolide antibiotic – Z-Pack'},
  {id:'PRD-008',name:'Atorvastatin 40mg',cat:'Cardiovascular',emoji:'💙',price:72,unit:'per strip (10)',stock:3200,lowAt:1000,mfr:'May & Baker Nigeria',nafdac:'A4-4418',desc:'Statin for cholesterol control'},
];

const ALL_STATUSES = ['Pending','Supplier Contacted','Supplier Confirmed','In Transit to Office','Under Verification','Verified','Delivered'];

const ORDERS_SEED = [
  {id:'ORD-3041',product:'Amoxicillin 500mg',productId:'PRD-001',buyer:'MedPlus Pharmacy',supplier:'Pfizer Nigeria',qty:5000,basePrice:45,status:'Under Verification',date:'2024-01-15',cat:'Antibiotics',batch:'BATCH-5812',nafdac:'A4-0141',notes:'Urgent – hospital restocking',
   timeline:[{s:'Pending',d:'Jan 15 09:14'},{s:'Supplier Contacted',d:'Jan 15 11:30'},{s:'Supplier Confirmed',d:'Jan 15 14:02'},{s:'In Transit to Office',d:'Jan 16 08:55'},{s:'Under Verification',d:'Jan 17 10:40'}]},
  {id:'ORD-3040',product:'Paracetamol 500mg',productId:'PRD-002',buyer:'HealthFirst Clinic',supplier:'Emzor Pharma',qty:20000,basePrice:12,status:'Delivered',date:'2024-01-12',cat:'Analgesics',batch:'BATCH-5809',nafdac:'A4-0882',notes:'',
   timeline:ALL_STATUSES.map((s,i)=>({s,d:`Jan ${12+i} 10:00`}))},
  {id:'ORD-3039',product:'Metformin 500mg',productId:'PRD-004',buyer:'Apex Medical Stores',supplier:'Fidson Healthcare',qty:8000,basePrice:22,status:'In Transit to Office',date:'2024-01-14',cat:'Antidiabetic',batch:'BATCH-5810',nafdac:'A4-5512',notes:'Cold chain required',
   timeline:[{s:'Pending',d:'Jan 14 08:20'},{s:'Supplier Contacted',d:'Jan 14 10:15'},{s:'Supplier Confirmed',d:'Jan 14 15:30'},{s:'In Transit to Office',d:'Jan 15 09:00'}]},
  {id:'ORD-3038',product:'Ciprofloxacin 500mg',productId:'PRD-003',buyer:'Lagos State Hospital',supplier:'May & Baker Nigeria',qty:3000,basePrice:38,status:'Supplier Contacted',date:'2024-01-16',cat:'Antibiotics',batch:'',nafdac:'A4-1234',notes:'Government tender order',
   timeline:[{s:'Pending',d:'Jan 16 07:00'},{s:'Supplier Contacted',d:'Jan 16 09:22'}]},
  {id:'ORD-3037',product:'Omeprazole 20mg',productId:'PRD-006',buyer:'PharmaCare Ltd',supplier:'Neimeth International',qty:10000,basePrice:28,status:'Verified',date:'2024-01-11',cat:'Gastrointestinal',batch:'BATCH-5806',nafdac:'A4-7723',notes:'',
   timeline:ALL_STATUSES.slice(0,6).map((s,i)=>({s,d:`Jan ${11+i} 10:00`}))},
  {id:'ORD-3036',product:'Azithromycin 250mg',productId:'PRD-007',buyer:'MedPlus Pharmacy',supplier:'Pfizer Nigeria',qty:2000,basePrice:65,status:'Pending',date:'2024-01-17',cat:'Antibiotics',batch:'',nafdac:'',notes:'',
   timeline:[{s:'Pending',d:'Jan 17 11:00'}]},
  {id:'ORD-3035',product:'Atorvastatin 40mg',productId:'PRD-008',buyer:'Apex Medical Stores',supplier:'May & Baker Nigeria',qty:1500,basePrice:72,status:'Supplier Confirmed',date:'2024-01-13',cat:'Cardiovascular',batch:'',nafdac:'A4-4418',notes:'',
   timeline:[{s:'Pending',d:'Jan 13 08:00'},{s:'Supplier Contacted',d:'Jan 13 10:30'},{s:'Supplier Confirmed',d:'Jan 13 14:45'}]},
];

const SUPPLIERS = [
  {id:'SUP-001',name:'Pfizer Nigeria',email:'ops@pfizer-ng.com',phone:'+234 801 234 5678',status:'Active',products:['Amoxicillin 500mg','Azithromycin 250mg'],rating:4.9,verified:true,orders:48,revenue:12480000},
  {id:'SUP-002',name:'Emzor Pharma',email:'supply@emzor.com',phone:'+234 802 345 6789',status:'Active',products:['Paracetamol 500mg'],rating:4.7,verified:true,orders:62,revenue:8920000},
  {id:'SUP-003',name:'May & Baker Nigeria',email:'b2b@maybaker.ng',phone:'+234 803 456 7890',status:'Active',products:['Ciprofloxacin 500mg','Atorvastatin 40mg'],rating:4.8,verified:true,orders:35,revenue:9640000},
  {id:'SUP-004',name:'Fidson Healthcare',email:'trade@fidson.com',phone:'+234 804 567 8901',status:'Inactive',products:['Metformin 500mg'],rating:4.5,verified:true,orders:22,revenue:4280000},
  {id:'SUP-005',name:'Neimeth International',email:'supply@neimeth.com',phone:'+234 805 678 9012',status:'Active',products:['Omeprazole 20mg'],rating:4.6,verified:false,orders:18,revenue:3120000},
];

const NOTIFS = [
  {id:1,type:'verify',msg:'ORD-3041 is ready for verification',time:'5 min ago',read:false},
  {id:2,type:'order',msg:'New order ORD-3036 placed by MedPlus Pharmacy',time:'1 hr ago',read:false},
  {id:3,type:'supplier',msg:'Pfizer Nigeria confirmed ORD-3035',time:'3 hr ago',read:true},
  {id:4,type:'payment',msg:'Payment of ₦5.4M released for ORD-3040',time:'1 day ago',read:true},
];

const USERS = {
  buyer:      {name:'Dr. Chidi Okeke',      org:'MedPlus Pharmacy',          email:'chidi@medplus.ng',       role:'buyer'},
  supplier:   {name:'Amina Bello',          org:'Pfizer Nigeria',             email:'amina@pfizer-ng.com',    role:'supplier'},
  admin:      {name:'Emeka Okafor',         org:'MedSupply Admin',            email:'emeka@medsupply.ng',     role:'admin'},
  pharmacist: {name:'Dr. Ngozi Adeyemi',    org:'MedSupply Verification Office', email:'ngozi@medsupply.ng',  role:'pharmacist'},
};

const NAV_ITEMS = {
  buyer:      [{v:'overview',icon:'◎',l:'Overview'},{v:'marketplace',icon:'🗂',l:'Marketplace'},{v:'my-orders',icon:'📋',l:'My Orders',badge:2},{v:'tracking',icon:'📍',l:'Tracking'}],
  supplier:   [{v:'overview',icon:'◎',l:'Overview'},{v:'inventory',icon:'📦',l:'Inventory'},{v:'sup-orders',icon:'📋',l:'Orders',badge:3},{v:'revenue',icon:'💰',l:'Revenue'}],
  admin:      [{v:'overview',icon:'◎',l:'Dashboard'},{v:'all-orders',icon:'📋',l:'All Orders',badge:5},{v:'contacts',icon:'📞',l:'Contacts'},{v:'suppliers',icon:'🏭',l:'Suppliers'},{v:'analytics',icon:'📊',l:'Analytics'}],
  pharmacist: [{v:'overview',icon:'◎',l:'Overview'},{v:'queue',icon:'⏳',l:'Queue',badge:1},{v:'verify',icon:'🔬',l:'Verify Product'},{v:'pha-history',icon:'📁',l:'History'}],
};

const VIEW_TITLES = {
  overview:'Overview',marketplace:'Marketplace','my-orders':'My Orders',
  'order-detail':'Order Detail',tracking:'Order Tracking',
  inventory:'Inventory','sup-orders':'Orders',revenue:'Revenue',
  'all-orders':'All Orders',contacts:'Supplier Contacts',suppliers:'Suppliers',analytics:'Analytics',
  queue:'Verification Queue',verify:'Verify Product','pha-history':'Verification History',
};

const ROLE_COLORS = { buyer:'var(--ac)', supplier:'var(--am)', admin:'var(--rd)', pharmacist:'var(--gr)' };
const ROLE_RGBS   = { buyer:'0,191,255',  supplier:'255,184,0',  admin:'255,52,80',  pharmacist:'0,217,143' };

const STATUS_CLASS = {
  'Pending':'badge-pending','Supplier Contacted':'badge-contacted','Supplier Confirmed':'badge-confirmed',
  'Supplier Unresponsive':'badge-error','In Transit to Office':'badge-transit',
  'Under Verification':'badge-verify','Verified':'badge-verified','Rejected':'badge-rejected',
  'Delivered':'badge-delivered','Cancelled':'badge-cancelled','Active':'badge-active','Inactive':'badge-inactive',
};
const STATUS_DOT_COLOR = {
  'Pending':'var(--t2)','Supplier Contacted':'var(--ac)','Supplier Confirmed':'var(--ac)',
  'Supplier Unresponsive':'var(--rd)','In Transit to Office':'var(--am)',
  'Under Verification':'var(--pu)','Verified':'var(--gr)','Rejected':'var(--rd)',
  'Delivered':'var(--gr)','Cancelled':'var(--t2)','Active':'var(--gr)','Inactive':'var(--rd)',
};

// ─── APP STATE ─────────────────────────────────────────────
const State = {
  screen:   'landing',   // landing | auth | dashboard
  role:     null,
  preRole:  null,
  authMode: 'login',
  view:     'overview',
  orders:   JSON.parse(JSON.stringify(ORDERS_SEED)),
  selectedOrder: null,
  verifyOrder:   null,
  productFilter: 'All',
  orderFilter:   'All',
  notifOpen: false,
  verifyChecks: {},
  orderQty: 1000,
  orderProduct: null,
  modalOpen: false,
};

// ─── UTILITY ───────────────────────────────────────────────
const $ = id => document.getElementById(id);
const fmt = n  => Math.round(n).toLocaleString('en');
const fmtM = n => `₦${(n/1e6).toFixed(1)}M`;

function badge(status, label) {
  const cls = STATUS_CLASS[status] || 'badge-pending';
  return `<span class="badge ${cls}">${label || status}</span>`;
}

function mono(text, extraClass = '') {
  return `<span class="mono ${extraClass}" style="font-size:12px;">${text}</span>`;
}

function avatar(name, size = 'md') {
  const initials = (name || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return `<div class="avatar avatar-${size}">${initials}</div>`;
}

function btn(label, variant = 'primary', size = '', extra = '', disabled = false) {
  return `<button class="btn btn-${variant}${size ? ' btn-' + size : ''}${extra ? ' ' + extra : ''}"${disabled ? ' disabled' : ''}>${label}</button>`;
}

function statCard(label, value, sub, icon, accentColor, change) {
  const changeHtml = change !== undefined
    ? `<div class="stat-change ${change >= 0 ? 'up' : 'down'}">${change >= 0 ? '▲' : '▼'} ${Math.abs(change)}% vs last month</div>`
    : '';
  return `
  <div class="stat-card" style="--accent-line:${accentColor}">
    <div class="stat-label">${label}</div>
    <div class="stat-icon">${icon}</div>
    <div class="stat-value">${value}</div>
    ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
    ${changeHtml}
  </div>`;
}

function emptyState(icon, title, sub, actionHtml = '') {
  return `<div class="empty-state"><div class="empty-icon">${icon}</div><div class="empty-title">${title}</div><div class="empty-sub">${sub}</div>${actionHtml}</div>`;
}

function workflowChain(currentStatus) {
  const steps = ['Order','Contacted','Confirmed','Transit','Verification','Verified','Delivered'];
  const statusStep = {'Pending':0,'Supplier Contacted':1,'Supplier Confirmed':2,'Supplier Unresponsive':1,'In Transit to Office':3,'Under Verification':4,'Verified':5,'Delivered':6};
  const cur = statusStep[currentStatus] ?? 0;
  return `
  <div class="wf-chain">
    ${steps.map((s, i) => {
      const done = i < cur;
      const active = i === cur;
      return `
      <div class="wfc-step ${done ? 'done' : ''}">
        <div class="wfc-dot ${done ? 'done' : active ? 'active' : ''}">${done ? '✓' : i + 1}</div>
        <div class="wfc-label ${done ? 'done' : active ? 'active' : ''}">${s}</div>
      </div>`;
    }).join('')}
  </div>`;
}

function timeline(items) {
  return `<div class="timeline">${items.map(t => `
    <div class="tl-item">
      <div class="tl-dot">✓</div>
      <div class="tl-content">
        <div class="tl-title">${t.s}</div>
        <div class="tl-time">${t.d}</div>
      </div>
    </div>`).join('')}</div>`;
}

function infoRows(rows) {
  return `<div class="info-rows">${rows.map(([k, v]) => `
    <div class="row"><span class="info-key">${k}</span><span class="info-val">${v}</span></div>`).join('')}</div>`;
}

function barChart(months, values) {
  const maxV = Math.max(...values);
  return `<div class="bar-chart">
    ${months.map((m, i) => `
    <div class="bar-col">
      <div class="bar-val">${values[i]}</div>
      <div class="bar-body" style="height:${Math.max(4, (values[i] / maxV) * 110)}px"></div>
      <div class="bar-lbl">${m}</div>
    </div>`).join('')}
  </div>`;
}

function progBar(label, val, total, color) {
  const pct = Math.round(val / total * 100);
  return `<div class="prog-row">
    <div class="prog-meta"><span class="prog-label">${label}</span><span class="prog-val" style="color:${color}">${val}</span></div>
    <div class="prog-track"><div class="prog-fill" style="width:${pct}%;background:${color}"></div></div>
  </div>`;
}

// ─── TOAST ─────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimer);
  const icons = { success: '✓', error: '✗', warn: '⚠' };
  const el = document.getElementById('toast-container');
  el.innerHTML = `<div class="toast ${type}"><span class="toast-icon">${icons[type] || '✓'}</span>${msg}</div>`;
  toastTimer = setTimeout(() => { el.innerHTML = ''; }, 3500);
}

// ─── MODAL ─────────────────────────────────────────────────
function openModal(html) {
  let overlay = $('modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="modal-box">${html}</div>`;
  overlay.classList.remove('hidden');
  overlay.style.display = 'flex';
}
function closeModal() {
  const overlay = $('modal-overlay');
  if (overlay) overlay.style.display = 'none';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── RENDER ENGINE ─────────────────────────────────────────
function render() {
  const app = $('app');
  if (!app) return;
  const bgGrid = '<div class="grid-bg"></div>';
  if (State.screen === 'landing')   { app.innerHTML = bgGrid + renderLanding(); bindLanding(); }
  else if (State.screen === 'auth') { app.innerHTML = bgGrid + renderAuth();    bindAuth(); }
  else if (State.screen === 'dashboard') {
    app.innerHTML = bgGrid + renderDashboard();
    bindDashboard();
    renderContent();
  }
}

function navigate(view) {
  State.view = view;
  State.notifOpen = false;
  // Update nav active states
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });
  // Update topbar title
  const tt = $('topbar-title');
  if (tt) tt.textContent = VIEW_TITLES[view] || 'Dashboard';
  // Close notif panel
  const wrap = $('notif-panel-wrap');
  if (wrap) wrap.innerHTML = '';
  renderContent();
}

function renderContent() {
  const content = $('main-content');
  if (!content) return;
  const role = State.role;
  let html = '';
  if (role === 'buyer') {
    if (State.view === 'overview')     html = renderBuyerOverview();
    else if (State.view === 'marketplace')  html = renderMarketplace();
    else if (State.view === 'my-orders')    html = renderMyOrders();
    else if (State.view === 'order-detail') html = renderOrderDetail(State.selectedOrder);
    else if (State.view === 'tracking')     html = renderTracking();
  } else if (role === 'supplier') {
    if (State.view === 'overview')   html = renderSupplierOverview();
    else if (State.view === 'inventory') html = renderInventory();
    else if (State.view === 'sup-orders') html = renderSupplierOrders();
    else if (State.view === 'revenue')   html = renderRevenue();
  } else if (role === 'admin') {
    if (State.view === 'overview')    html = renderAdminOverview();
    else if (State.view === 'all-orders') html = renderAllOrders();
    else if (State.view === 'contacts')   html = renderContacts();
    else if (State.view === 'suppliers')  html = renderSuppliersView();
    else if (State.view === 'analytics')  html = renderAnalytics();
  } else if (role === 'pharmacist') {
    if (State.view === 'overview')   html = renderPhaOverview();
    else if (State.view === 'queue') html = renderQueue();
    else if (State.view === 'verify') html = renderVerify(State.verifyOrder);
    else if (State.view === 'pha-history') html = renderPhaHistory();
  }
  content.innerHTML = html || emptyState('🚧', 'Coming soon', '');
  content.classList.remove('afu');
  void content.offsetWidth;
  content.classList.add('afu');
  bindViewEvents();
}

// ─── LANDING ───────────────────────────────────────────────
function renderLanding() {
  const wfSteps = [
    {n:1,icon:'🏥',label:'Buyer Places Order',col:'0,191,255'},
    {n:2,icon:'📬',label:'Admin Contacts Supplier',col:'255,184,0'},
    {n:3,icon:'🏭',label:'Supplier Confirms Stock',col:'255,184,0'},
    {n:4,icon:'🚚',label:'Ships to Verification',col:'155,114,255'},
    {n:5,icon:'🔬',label:'Pharmacist Verifies',col:'155,114,255'},
    {n:6,icon:'✅',label:'Product Delivered',col:'0,217,143'},
    {n:7,icon:'💰',label:'Payment Released',col:'0,217,143'},
  ];
  return `
  <div class="landing">
    <div class="landing-glow"></div>
    <nav class="landing-nav">
      <div class="logo"><div class="logo-icon">⚕️</div><span class="logo-text">Med<span>Supply</span></span></div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-ghost btn-sm" id="btn-login">Log In</button>
        <button class="btn btn-primary btn-sm" id="btn-getstarted">Get Started →</button>
      </div>
    </nav>
    <div class="landing-hero">
      <div class="hero-badge afu"><div class="dot"></div><span>Nigeria's Verified Pharmaceutical B2B Marketplace</span></div>
      <h1 class="hero-title afu d1">The Supply Chain for<br><em>Pharmaceutical Grade Trust</em></h1>
      <p class="hero-sub afu d2">Connect verified buyers, suppliers, and licensed pharmacists in a compliance-first marketplace with built-in verification workflows.</p>
      <div class="hero-actions afu d3">
        <button class="btn btn-primary btn-lg" data-role="buyer">Start as Buyer →</button>
        <button class="btn btn-secondary btn-lg" data-role="supplier">Join as Supplier</button>
      </div>
    </div>
    <div class="workflow-box afu d4">
      <div class="workflow-inner">
        <div class="workflow-label">The Verification Workflow — Every Order, No Exceptions</div>
        <div class="workflow-steps">
          ${wfSteps.map((s, i) => `
          <div class="wf-step">
            ${i < wfSteps.length - 1 ? `<div style="position:absolute;top:18px;left:60%;width:80%;height:1.5px;background:var(--b3);z-index:0;"></div>` : ''}
            <div class="wf-dot" style="background:rgba(${s.col},.12);border-color:rgba(${s.col},1);">${s.icon}</div>
            <div class="wf-step-label">${s.label}</div>
          </div>`).join('')}
        </div>
      </div>
    </div>
    <div class="role-cards-section afu d5">
      <div class="role-cards-label">Quick Demo — Choose Your Role</div>
      <div class="role-cards-grid">
        <div class="role-card" data-role="buyer"><div class="rc-icon">🏥</div><div class="rc-name">Buyer</div><div class="rc-desc">Browse & order pharmaceuticals</div></div>
        <div class="role-card" data-role="supplier"><div class="rc-icon">🏭</div><div class="rc-name">Supplier</div><div class="rc-desc">Manage inventory & fulfill orders</div></div>
        <div class="role-card" data-role="pharmacist"><div class="rc-icon">🔬</div><div class="rc-name">Pharmacist</div><div class="rc-desc">Verify incoming shipments</div></div>
        <div class="role-card" data-role="admin"><div class="rc-icon">⚙️</div><div class="rc-name">Admin</div><div class="rc-desc">Monitor & control all operations</div></div>
      </div>
    </div>
    <div class="landing-stats afu">
      <div class="stat-item"><div class="stat-num">₦2.4B+</div><div class="stat-lbl">Transactions Processed</div></div>
      <div class="stat-item"><div class="stat-num">840+</div><div class="stat-lbl">Verified Suppliers</div></div>
      <div class="stat-item"><div class="stat-num">99.2%</div><div class="stat-lbl">Verification Accuracy</div></div>
      <div class="stat-item"><div class="stat-num">NAFDAC</div><div class="stat-lbl">Compliance Integrated</div></div>
    </div>
  </div>`;
}

function bindLanding() {
  document.querySelectorAll('[data-role]').forEach(el => {
    el.addEventListener('click', () => { State.preRole = el.dataset.role; State.screen = 'auth'; render(); });
  });
  const btnLogin = $('btn-login');
  const btnStart = $('btn-getstarted');
  if (btnLogin) btnLogin.addEventListener('click', () => { State.preRole = null; State.screen = 'auth'; render(); });
  if (btnStart) btnStart.addEventListener('click', () => { State.preRole = null; State.screen = 'auth'; render(); });
}

// ─── AUTH ──────────────────────────────────────────────────
function renderAuth() {
  const roles = [{v:'buyer',icon:'🏥',l:'Buyer'},{v:'supplier',icon:'🏭',l:'Supplier'},{v:'pharmacist',icon:'🔬',l:'Pharmacist'},{v:'admin',icon:'⚙️',l:'Admin'}];
  const sel = State.preRole || 'buyer';
  const isLogin = State.authMode === 'login';
  return `
  <div class="auth-screen">
    <div class="auth-wrap afu">
      <div class="auth-logo-wrap">
        <div class="logo" style="justify-content:center;"><div class="logo-icon">⚕️</div><span class="logo-text">Med<span>Supply</span></span></div>
        <div class="auth-tagline">Pharmaceutical B2B Marketplace</div>
      </div>
      <div class="auth-card">
        <div class="form-group">
          <label class="form-label">Sign in as</label>
          <div class="role-picker-grid" id="role-picker">
            ${roles.map(r => `
            <div class="role-pick-item${r.v === sel ? ' active' : ''}" data-pick="${r.v}">
              <span class="rpi-icon">${r.icon}</span>
              <span class="rpi-label">${r.l}</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="auth-tabs">
          <button class="auth-tab${isLogin ? ' active' : ''}" data-tab="login">Log In</button>
          <button class="auth-tab${!isLogin ? ' active' : ''}" data-tab="register">Register</button>
        </div>
        <div id="auth-form">
          ${!isLogin ? `
          <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="auth-name" placeholder="Dr. Chidi Okeke"></div>
          <div class="form-group"><label class="form-label">Organization</label><input type="text" id="auth-org" placeholder="MedPlus Pharmacy Ltd"></div>` : ''}
          <div class="form-group"><label class="form-label">Email Address</label><input type="email" id="auth-email" placeholder="you@organization.com"></div>
          <div class="form-group"><label class="form-label">Password</label><input type="password" id="auth-pass" placeholder="••••••••"></div>
          <button class="btn btn-primary btn-full" id="auth-submit">${isLogin ? 'Sign In to Dashboard →' : 'Create Account →'}</button>
        </div>
        <div class="auth-toggle">
          ${isLogin
            ? `Don't have an account? <span class="auth-link" data-tab="register">Register</span>`
            : `Already have an account? <span class="auth-link" data-tab="login">Log In</span>`}
        </div>
      </div>
    </div>
  </div>`;
}

function bindAuth() {
  // Role picker
  document.querySelectorAll('[data-pick]').forEach(el => {
    el.addEventListener('click', () => {
      State.preRole = el.dataset.pick;
      document.querySelectorAll('[data-pick]').forEach(x => x.classList.toggle('active', x.dataset.pick === State.preRole));
    });
  });
  // Tabs
  document.querySelectorAll('.auth-tab, .auth-link').forEach(el => {
    el.addEventListener('click', () => {
      State.authMode = el.dataset.tab;
      State.screen = 'auth';
      render();
    });
  });
  // Submit
  const submit = $('auth-submit');
  if (submit) {
    submit.addEventListener('click', () => {
      State.role = State.preRole || 'buyer';
      State.view = 'overview';
      State.screen = 'dashboard';
      State.verifyOrder = State.orders.find(o => o.status === 'Under Verification') || null;
      render();
    });
  }
  // Enter key
  document.querySelectorAll('#auth-email, #auth-pass').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') $('auth-submit')?.click(); });
  });
}

// ─── DASHBOARD SHELL ───────────────────────────────────────
function renderDashboard() {
  const role = State.role;
  const user = USERS[role];
  const nav = NAV_ITEMS[role] || [];
  const rc = ROLE_COLORS[role];
  const rgb = ROLE_RGBS[role];
  const unread = NOTIFS.filter(n => !n.read).length;
  return `
  <div class="dashboard">
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo"><div class="logo-icon">&#9877;&#65039;</div><span class="logo-text">Med<span>Supply</span></span></div>
      </div>
      <div class="sidebar-role" style="background:rgba(${rgb},.08);border:1px solid ${rc}33;">
        <div class="role-dot" style="background:${rc};"></div>
        <div>
          <div class="role-type" style="color:${rc};">${role}</div>
          <div class="role-org">${user?.org || ''}</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${nav.map(item => `
        <div class="nav-item${State.view === item.v ? ' active' : ''}" data-view="${item.v}">
          <span class="nav-icon">${item.icon}</span>
          <span>${item.l}</span>
          ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </div>`).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="user-row">
          ${avatar(user?.name, 'md')}
          <div style="flex:1;overflow:hidden;">
            <div class="user-name">${user?.name || ''}</div>
            <div class="user-email">${user?.email || ''}</div>
          </div>
          <button class="logout-btn" id="btn-logout" title="Log out">&#9211;</button>
        </div>
      </div>
    </aside>
    <div class="main">
      <div class="topbar">
        <button class="sidebar-toggle" id="sidebar-toggle" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
        <div class="topbar-title" id="topbar-title">${VIEW_TITLES[State.view] || 'Dashboard'}</div>
        <div class="search-box">
          <span style="color:var(--t3);font-size:12px;">&#8981;</span>
          <input type="text" placeholder="Search&hellip;">
        </div>
        <button class="notif-btn" id="notif-btn">&#128276;${unread > 0 ? '<div class="notif-dot"></div>' : ''}</button>
        ${avatar(user?.name, 'md')}
      </div>
      <div id="notif-panel-wrap"></div>
      <div class="content" id="main-content"></div>
    </div>
  </div>`;
}

// ─── SIDEBAR HELPERS ───────────────────────────────────────
function isMobile() { return window.innerWidth <= 768; }

function openSidebar() {
  const sidebar = $('sidebar');
  const overlay = $('sidebar-overlay');
  const toggle  = $('sidebar-toggle');
  if (sidebar) sidebar.classList.add('open');
  if (overlay) overlay.classList.add('visible');
  if (toggle)  toggle.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSidebar() {
  const sidebar = $('sidebar');
  const overlay = $('sidebar-overlay');
  const toggle  = $('sidebar-toggle');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('visible');
  if (toggle)  toggle.classList.remove('open');
  document.body.style.overflow = '';
}

function bindDashboard() {
  // Hamburger toggle
  const toggleBtn = $('sidebar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const sidebar = $('sidebar');
      if (sidebar && sidebar.classList.contains('open')) closeSidebar();
      else openSidebar();
    });
  }
  // Overlay tap closes sidebar
  const overlay = $('sidebar-overlay');
  if (overlay) overlay.addEventListener('click', closeSidebar);

  // Sidebar nav — close sheet on mobile after navigating
  document.querySelectorAll('.nav-item[data-view]').forEach(el => {
    el.addEventListener('click', () => {
      if (isMobile()) closeSidebar();
      navigate(el.dataset.view);
    });
  });

  // Logout
  const logoutBtn = $('btn-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      closeSidebar();
      State.screen = 'landing'; State.role = null; State.preRole = null;
      State.view = 'overview'; State.orders = JSON.parse(JSON.stringify(ORDERS_SEED));
      render();
    });
  }
  // Notif
  const notifBtn = $('notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      State.notifOpen = !State.notifOpen;
      const wrap = $('notif-panel-wrap');
      if (wrap) wrap.innerHTML = State.notifOpen ? renderNotifPanel() : '';
      if (State.notifOpen) {
        const closeBtn = document.querySelector('.notif-close');
        if (closeBtn) closeBtn.addEventListener('click', () => { State.notifOpen = false; if (wrap) wrap.innerHTML = ''; });
      }
    });
  }
}

function bindViewEvents() {
  const role = State.role;
  if (role === 'buyer') {
    if (State.view === 'overview')     bindBuyerOverview();
    else if (State.view === 'marketplace')  bindMarketplace();
    else if (State.view === 'my-orders')    bindMyOrders();
    else if (State.view === 'tracking')     {} // no extra bindings
  } else if (role === 'supplier') {
    if (State.view === 'sup-orders') bindSupplierOrders();
    if (State.view === 'inventory')  bindInventory();
  } else if (role === 'admin') {
    if (State.view === 'all-orders') bindAllOrders();
    if (State.view === 'contacts')   bindContacts();
    if (State.view === 'overview')   bindAdminOverview();
  } else if (role === 'pharmacist') {
    if (State.view === 'queue')  bindQueue();
    if (State.view === 'verify') bindVerify();
    if (State.view === 'overview') bindPhaOverview();
  }
}

// ─── NOTIFICATIONS ─────────────────────────────────────────
function renderNotifPanel() {
  return `
  <div class="notif-panel" style="position:fixed;top:calc(var(--hh) + 6px);right:16px;">
    <div class="notif-header">
      <div class="notif-title">Notifications</div>
      <button class="notif-close">✕</button>
    </div>
    ${NOTIFS.map(n => `
    <div class="notif-item${n.read ? '' : ' unread'}">
      <div class="notif-msg">${n.msg}</div>
      <div class="notif-time">${n.time}</div>
    </div>`).join('')}
  </div>`;
}

// ══════════════════════════════════════════
//  BUYER VIEWS
// ══════════════════════════════════════════
function renderBuyerOverview() {
  const mine = State.orders.filter(o => o.buyer === 'MedPlus Pharmacy');
  const active = mine.filter(o => !['Delivered','Cancelled'].includes(o.status));
  const delivered = mine.filter(o => o.status === 'Delivered');
  return `
  <div>
    <div class="stats-grid-4">
      ${statCard('Total Orders', mine.length, 'all time', '📋', 'var(--ac)', 12)}
      ${statCard('Active Orders', active.length, 'in progress', '⏳', 'var(--am)')}
      ${statCard('Total Spent', '₦8.4M', 'this year', '💰', 'var(--gr)', 8)}
      ${statCard('Delivered', delivered.length, 'completed', '✅', 'var(--pu)')}
    </div>
    <div class="card" style="margin-bottom:16px;">
      <div class="card-head">
        <div><div class="card-title">Active Orders</div><div class="card-sub">${active.length} orders in progress</div></div>
        <button class="btn btn-dark btn-sm" id="btn-all-orders">View All</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th><th></th></tr></thead>
          <tbody>
            ${mine.slice(0, 5).map(o => `
            <tr>
              <td>${mono(o.id, 'style="color:var(--ac)"')}</td>
              <td style="font-weight:700;">${o.product}</td>
              <td>${fmt(o.qty)}</td>
              <td style="color:var(--ac);font-weight:700;">₦${fmt(o.basePrice * o.qty * 1.1)}</td>
              <td>${badge(o.status)}</td>
              <td style="color:var(--t3);">${o.date}</td>
              <td><button class="btn btn-ghost btn-sm btn-view-order" data-id="${o.id}">View →</button></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
    <div class="grid-2">
      <div class="card quick-action" id="btn-goto-marketplace">
        <div class="qa-inner">
          <div class="qa-icon" style="background:var(--acg);">🗂</div>
          <div><div class="qa-title">Browse Marketplace</div><div class="qa-sub">${PRODUCTS.length} products available</div></div>
        </div>
      </div>
      <div class="card quick-action" id="btn-goto-tracking">
        <div class="qa-inner">
          <div class="qa-icon" style="background:var(--amg);">📍</div>
          <div><div class="qa-title">Track Orders</div><div class="qa-sub">Real-time verification status</div></div>
        </div>
      </div>
    </div>
  </div>`;
}

function bindBuyerOverview() {
  $('btn-all-orders')?.addEventListener('click', () => navigate('my-orders'));
  $('btn-goto-marketplace')?.addEventListener('click', () => navigate('marketplace'));
  $('btn-goto-tracking')?.addEventListener('click', () => navigate('tracking'));
  document.querySelectorAll('.btn-view-order').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      State.selectedOrder = State.orders.find(o => o.id === el.dataset.id);
      navigate('order-detail');
    });
  });
}

// ─── MARKETPLACE ──────────────────────────────────────────
function renderMarketplace() {
  const cats = ['All', ...[...new Set(PRODUCTS.map(p => p.cat))]];
  const filter = State.productFilter;
  const filtered = PRODUCTS.filter(p => (filter === 'All' || p.cat === filter));
  return `
  <div>
    <div class="filter-bar">
      <input type="text" id="market-search" placeholder="Search products…" style="max-width:250px;margin:0;">
      ${cats.map(c => `<button class="filter-pill${c === filter ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('')}
    </div>
    <div class="product-grid" id="product-grid">
      ${renderProductCards(filtered)}
    </div>
  </div>`;
}

function renderProductCards(products) {
  return products.map(p => {
    const inStock = p.stock > 0;
    const lowStock = p.stock > 0 && p.stock < p.lowAt;
    const stockBadge = !inStock ? badge('Cancelled', 'Out of Stock') : lowStock ? badge('In Transit to Office', 'Low Stock') : badge('Verified', 'In Stock');
    return `
    <div class="product-card" data-pid="${p.id}">
      <div class="product-img">
        ${p.emoji}
        <div class="product-badge-corner">${stockBadge}</div>
      </div>
      <div class="product-body">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-mfr">${p.mfr}</div>
        <div class="product-price-row">
          <div><div class="product-price">₦${p.price}</div><div class="product-unit">${p.unit}</div></div>
          <div class="product-nafdac"><div class="product-nafdac-label">NAFDAC</div><div class="product-nafdac-val mono">${p.nafdac}</div></div>
        </div>
        <button class="btn ${inStock ? 'btn-primary' : 'btn-ghost'} btn-full btn-order-product" data-pid="${p.id}" ${!inStock ? 'disabled' : ''}>${inStock ? 'Place Order' : 'Out of Stock'}</button>
      </div>
    </div>`;
  }).join('');
}

function bindMarketplace() {
  // Filter pills
  document.querySelectorAll('[data-cat]').forEach(el => {
    el.addEventListener('click', () => {
      State.productFilter = el.dataset.cat;
      document.querySelectorAll('[data-cat]').forEach(x => x.classList.toggle('active', x.dataset.cat === State.productFilter));
      const grid = $('product-grid');
      if (grid) {
        const search = $('market-search')?.value?.toLowerCase() || '';
        const filtered = PRODUCTS.filter(p =>
          (State.productFilter === 'All' || p.cat === State.productFilter) &&
          (!search || p.name.toLowerCase().includes(search))
        );
        grid.innerHTML = renderProductCards(filtered);
        bindOrderButtons();
      }
    });
  });
  // Search
  const searchInput = $('market-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const search = searchInput.value.toLowerCase();
      const filtered = PRODUCTS.filter(p =>
        (State.productFilter === 'All' || p.cat === State.productFilter) &&
        (!search || p.name.toLowerCase().includes(search))
      );
      const grid = $('product-grid');
      if (grid) { grid.innerHTML = renderProductCards(filtered); bindOrderButtons(); }
    });
  }
  bindOrderButtons();
}

function bindOrderButtons() {
  document.querySelectorAll('.btn-order-product').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const p = PRODUCTS.find(x => x.id === el.dataset.pid);
      if (p && p.stock > 0) {
        State.orderProduct = p;
        State.orderQty = 1000;
        openOrderModal(p);
      }
    });
  });
}

function openOrderModal(p) {
  openModal(`
  <div class="modal-header">
    <div><div class="modal-title">Place New Order</div><div class="modal-sub">${p.name}</div></div>
    <button class="modal-close" onclick="closeModal()">✕</button>
  </div>
  <div class="modal-body">
    <div style="background:var(--bg3);border-radius:var(--r12);padding:16px;margin-bottom:18px;display:flex;gap:14px;align-items:center;">
      <div style="font-size:36px;">${p.emoji}</div>
      <div>
        <div style="font-weight:700;font-size:15px;">${p.name}</div>
        <div style="font-size:12px;color:var(--t2);margin-top:2px;">${p.mfr} · NAFDAC: <span class="mono">${p.nafdac}</span></div>
        <div style="font-size:12px;color:var(--t3);margin-top:4px;">${p.desc}</div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Order Quantity (units)</label>
      <input type="number" id="modal-qty" value="${State.orderQty}" min="100" step="100">
    </div>
    <div class="form-group">
      <label class="form-label">Notes to Admin</label>
      <textarea id="modal-notes" rows="2" placeholder="Special requirements or urgency notes…"></textarea>
    </div>
    <div class="summary-table" id="order-summary">
      ${renderOrderSummary(p, State.orderQty)}
    </div>
    <div class="info-banner banner-warn" style="margin-top:14px;">
      <div class="info-banner-title">⚠ Escrow Notice</div>
      Payment is held until pharmacist verification is complete.
    </div>
  </div>
  <div class="modal-footer">
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" id="btn-confirm-order">Confirm Order →</button>
  </div>`);
  // Bind qty update
  const qtyInput = $('modal-qty');
  if (qtyInput) {
    qtyInput.addEventListener('input', () => {
      const qty = Math.max(100, parseInt(qtyInput.value) || 100);
      const summary = $('order-summary');
      if (summary) summary.innerHTML = renderOrderSummary(p, qty);
    });
  }
  // Bind confirm
  const confirmBtn = $('btn-confirm-order');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const qty = Math.max(100, parseInt($('modal-qty')?.value) || 1000);
      placeOrder(p, qty);
      closeModal();
    });
  }
}

function renderOrderSummary(p, qty) {
  return `
  <div class="summary-row"><span class="summary-key">Unit Price</span><span class="summary-val">₦${p.price}</span></div>
  <div class="summary-row"><span class="summary-key">Quantity</span><span class="summary-val">${fmt(qty)} units</span></div>
  <div class="summary-row"><span class="summary-key">Sub-total</span><span class="summary-val">₦${fmt(p.price * qty)}</span></div>
  <div class="summary-row"><span class="summary-key">Service fee (10%)</span><span class="summary-val">₦${fmt(p.price * qty * 0.1)}</span></div>
  <div class="summary-row"><span class="summary-key">Total</span><span class="summary-val total">₦${fmt(p.price * qty * 1.1)}</span></div>`;
}

function placeOrder(p, qty) {
  const newOrder = {
    id: `ORD-${3050 + State.orders.length}`,
    product: p.name, productId: p.id, buyer: 'MedPlus Pharmacy', supplier: p.mfr,
    qty, basePrice: p.price, status: 'Pending',
    date: new Date().toISOString().slice(0, 10),
    cat: p.cat, batch: '', nafdac: p.nafdac, notes: '',
    timeline: [{ s: 'Pending', d: new Date().toLocaleString() }],
  };
  State.orders.unshift(newOrder);
  showToast(`Order ${newOrder.id} placed successfully!`);
}

// ─── MY ORDERS ─────────────────────────────────────────────
function renderMyOrders() {
  const mine = State.orders.filter(o => o.buyer === 'MedPlus Pharmacy');
  return `
  <div class="card">
    <div class="card-head">
      <div><div class="card-title">My Orders</div><div class="card-sub">${mine.length} total orders</div></div>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th>Supplier</th><th>Date</th><th></th></tr></thead>
        <tbody>
          ${mine.map(o => `
          <tr data-order-id="${o.id}">
            <td>${mono(o.id, 'style="color:var(--ac)"')}</td>
            <td style="font-weight:700;">${o.product}</td>
            <td>${fmt(o.qty)}</td>
            <td style="color:var(--ac);font-weight:700;">₦${fmt(o.basePrice * o.qty * 1.1)}</td>
            <td>${badge(o.status)}</td>
            <td style="color:var(--t2);">${o.supplier}</td>
            <td style="color:var(--t3);">${o.date}</td>
            <td><button class="btn btn-ghost btn-sm btn-view-order" data-id="${o.id}">View →</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function bindMyOrders() {
  document.querySelectorAll('[data-order-id], .btn-view-order').forEach(el => {
    el.addEventListener('click', e => {
      const id = el.dataset.orderId || el.dataset.id;
      if (id) {
        State.selectedOrder = State.orders.find(o => o.id === id);
        navigate('order-detail');
      }
    });
  });
}

// ─── ORDER DETAIL ──────────────────────────────────────────
function renderOrderDetail(o) {
  if (!o) return emptyState('📋', 'No order selected', 'Select an order to view details',
    `<button class="btn btn-primary" onclick="navigate('my-orders')">← Back to Orders</button>`);
  return `
  <div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <button class="btn btn-ghost btn-sm" onclick="navigate('my-orders')">← Back</button>
      <div style="font-family:var(--fd);font-size:18px;">${o.id}</div>
      ${badge(o.status)}
    </div>
    <div class="grid-main-aside">
      <div>
        <div class="card" style="margin-bottom:16px;">
          <div class="card-head"><div><div class="card-title">Order Progress</div><div class="card-sub">Real-time verification workflow</div></div></div>
          <div class="card-body">
            ${workflowChain(o.status)}
            <div class="divider"></div>
            ${timeline(o.timeline)}
          </div>
        </div>
      </div>
      <div>
        <div class="card" style="margin-bottom:14px;">
          <div class="card-head"><div class="card-title">Order Summary</div></div>
          <div class="card-body-sm">
            ${infoRows([
              ['Order ID', `<span class="mono" style="color:var(--ac)">${o.id}</span>`],
              ['Product', `<strong>${o.product}</strong>`],
              ['Quantity', `${fmt(o.qty)} units`],
              ['Unit Price', `₦${o.basePrice}`],
              ['Total', `<strong style="color:var(--ac)">₦${fmt(o.basePrice * o.qty * 1.1)}</strong>`],
              ['Supplier', o.supplier],
              ['Status', badge(o.status)],
              ['Date', o.date],
              ...(o.batch ? [['Batch No', `<span class="mono">${o.batch}</span>`]] : []),
              ...(o.nafdac ? [['NAFDAC', `<span class="mono">${o.nafdac}</span>`]] : []),
            ])}
          </div>
        </div>
        <div class="info-banner banner-warn">
          <div class="info-banner-title">💰 Escrow Notice</div>
          Payment held until pharmacist verification is complete.
        </div>
      </div>
    </div>
  </div>`;
}

// ─── TRACKING ──────────────────────────────────────────────
function renderTracking() {
  const active = State.orders.filter(o => o.buyer === 'MedPlus Pharmacy' && !['Delivered','Cancelled'].includes(o.status));
  if (!active.length) return emptyState('📍', 'No active orders', 'All your orders have been delivered');
  return `
  <div style="display:flex;flex-direction:column;gap:14px;">
    ${active.map(o => `
    <div class="card">
      <div class="order-track-card">
        <div class="otc-top">
          <div>
            <div class="otc-id-row">${mono(o.id, 'style="color:var(--ac);font-size:13px;"')} ${badge(o.status)}</div>
            <div style="font-weight:700;font-size:15px;">${o.product}</div>
            <div style="font-size:12px;color:var(--t2);margin-top:2px;">${fmt(o.qty)} units · ${o.supplier}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--fd);font-size:18px;color:var(--ac);">₦${fmt(o.basePrice * o.qty * 1.1)}</div>
            <div style="font-size:11px;color:var(--t3);">${o.date}</div>
          </div>
        </div>
        ${workflowChain(o.status)}
      </div>
    </div>`).join('')}
  </div>`;
}

// ══════════════════════════════════════════
//  SUPPLIER VIEWS
// ══════════════════════════════════════════
function renderSupplierOverview() {
  const mine = State.orders.filter(o => o.supplier === 'Pfizer Nigeria');
  const active = mine.filter(o => !['Delivered','Cancelled'].includes(o.status));
  return `
  <div>
    <div class="stats-grid-4">
      ${statCard('Total Orders', mine.length, 'all time', '📋', 'var(--ac)', 8)}
      ${statCard('Active Orders', active.length, 'in progress', '⏳', 'var(--am)')}
      ${statCard('Revenue', '₦12.4M', 'this month', '💰', 'var(--gr)', 14)}
      ${statCard('Avg Rating', '4.9★', 'verified supplier', '⭐', 'var(--pu)')}
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><div class="card-title">Recent Orders</div><button class="btn btn-dark btn-sm" id="btn-sup-orders">View All</button></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Product</th><th>Qty</th><th>Status</th></tr></thead>
            <tbody>
              ${mine.slice(0, 5).map(o => `<tr><td>${mono(o.id, 'style="color:var(--ac)"')}</td><td>${o.product}</td><td>${fmt(o.qty)}</td><td>${badge(o.status)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card card-body">
        <div style="font-weight:700;font-size:14px;margin-bottom:16px;">Order Status Breakdown</div>
        ${['Under Verification','In Transit to Office','Verified','Delivered'].map(s => {
          const cnt = mine.filter(o => o.status === s).length;
          const c = STATUS_DOT_COLOR[s] || 'var(--t2)';
          return `<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <div style="width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0;"></div>
            <div style="flex:1;font-size:13px;color:var(--t2);">${s}</div>
            <div style="font-weight:700;font-size:14px;color:${c};">${cnt}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function renderInventory() {
  const myProducts = PRODUCTS.filter(p => p.mfr === 'Pfizer Nigeria');
  return `
  <div class="card">
    <div class="card-head">
      <div><div class="card-title">My Inventory</div><div class="card-sub">${myProducts.length} products</div></div>
      <button class="btn btn-primary btn-sm" id="btn-add-product">+ Add Product</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Product</th><th>NAFDAC</th><th>Category</th><th>Stock</th><th>Unit Price</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${myProducts.map(p => {
            const s = p.stock === 0 ? 'Out of Stock' : p.stock < p.lowAt ? 'Low Stock' : 'In Stock';
            const sc = p.stock === 0 ? 'var(--rd)' : p.stock < p.lowAt ? 'var(--am)' : 'var(--gr)';
            return `
            <tr>
              <td><div style="font-weight:700;">${p.name}</div><div style="font-size:11px;color:var(--t3);">${p.id}</div></td>
              <td>${mono(p.nafdac)}</td>
              <td style="color:var(--t2);">${p.cat}</td>
              <td><span style="color:${sc};font-weight:700;">${fmt(p.stock)}</span></td>
              <td style="color:var(--ac);font-weight:700;">₦${p.price}</td>
              <td><span style="font-size:11px;font-weight:700;color:${sc};">● ${s}</span></td>
              <td><button class="btn btn-ghost btn-sm btn-edit-prod" data-name="${p.name}">Edit</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function bindInventory() {
  $('btn-add-product')?.addEventListener('click', () => showToast('Add Product flow — coming soon', 'warn'));
  document.querySelectorAll('.btn-edit-prod').forEach(el => {
    el.addEventListener('click', () => showToast(`Editing ${el.dataset.name}…`, 'warn'));
  });
}

function renderSupplierOrders() {
  const mine = State.orders.filter(o => o.supplier === 'Pfizer Nigeria');
  const nextStatus = { 'Supplier Contacted':'Supplier Confirmed', 'Supplier Confirmed':'In Transit to Office' };
  return `
  <div class="card">
    <div class="card-head"><div class="card-title">Incoming Orders</div><div class="card-sub">${mine.length} orders</div></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order ID</th><th>Product</th><th>Buyer</th><th>Qty</th><th>Value</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${mine.map(o => `
          <tr>
            <td>${mono(o.id, 'style="color:var(--ac)"')}</td>
            <td style="font-weight:700;">${o.product}</td>
            <td style="color:var(--t2);">${o.buyer}</td>
            <td>${fmt(o.qty)}</td>
            <td style="color:var(--ac);font-weight:700;">₦${fmt(o.basePrice * o.qty * 1.1)}</td>
            <td>${badge(o.status)}</td>
            <td>
              ${nextStatus[o.status]
                ? `<button class="btn btn-outline btn-sm btn-advance-order" data-id="${o.id}" data-next="${nextStatus[o.status]}">→ ${nextStatus[o.status].split(' ')[0]}</button>`
                : badge(o.status)}
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function bindSupplierOrders() {
  document.querySelectorAll('.btn-advance-order').forEach(el => {
    el.addEventListener('click', () => {
      advanceOrder(el.dataset.id, el.dataset.next);
      renderContent();
    });
  });
}

function renderRevenue() {
  const months = ['Aug','Sep','Oct','Nov','Dec','Jan'];
  const vals = [3.2, 4.1, 3.8, 5.2, 4.8, 6.1];
  return `
  <div>
    <div class="stats-grid-3">
      ${statCard('This Month', '₦6.1M', 'January 2024', '📈', 'var(--gr)', 27)}
      ${statCard('Pending Payment', '₦2.4M', '3 orders', '⏳', 'var(--am)')}
      ${statCard('Total Earned', '₦27.2M', 'all time', '💰', 'var(--ac)')}
    </div>
    <div class="card">
      <div class="card-head"><div class="card-title">Monthly Revenue (₦M)</div><div class="card-sub">Last 6 months</div></div>
      <div class="card-body">${barChart(months, vals)}</div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════
//  ADMIN VIEWS
// ══════════════════════════════════════════
function renderAdminOverview() {
  const orders = State.orders;
  const statusSet = [...new Set(orders.map(o => o.status))];
  return `
  <div>
    <div class="stats-grid-4">
      ${statCard('Total Orders', orders.length, 'all time', '📋', 'var(--ac)', 18)}
      ${statCard('Needs Contact', orders.filter(o => o.status === 'Pending').length, 'pending action', '📞', 'var(--am)')}
      ${statCard('Under Verification', orders.filter(o => o.status === 'Under Verification').length, 'with pharmacist', '🔬', 'var(--pu)')}
      ${statCard('Delivered', orders.filter(o => o.status === 'Delivered').length, 'completed', '✅', 'var(--gr)')}
    </div>
    <div class="grid-2" style="margin-bottom:16px;">
      <div class="card">
        <div class="card-head">
          <div><div class="card-title">Live Order Pipeline</div><div class="card-sub">${orders.length} total orders</div></div>
          <button class="btn btn-dark btn-sm" id="btn-admin-all-orders">View All</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>ID</th><th>Product</th><th>Buyer</th><th>Status</th><th>Value</th></tr></thead>
            <tbody>
              ${orders.slice(0, 6).map(o => `
              <tr>
                <td>${mono(o.id, 'style="color:var(--ac)"')}</td>
                <td style="font-weight:700;">${o.product}</td>
                <td style="color:var(--t2);">${o.buyer}</td>
                <td>${badge(o.status)}</td>
                <td style="color:var(--ac);font-weight:700;">₦${fmt(o.basePrice * o.qty * 1.1)}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card card-body">
        <div style="font-weight:700;font-size:14px;margin-bottom:14px;">Pipeline by Status</div>
        ${statusSet.map(s => progBar(s, orders.filter(o => o.status === s).length, orders.length, STATUS_DOT_COLOR[s] || 'var(--t2)')).join('')}
      </div>
    </div>
  </div>`;
}

function bindAdminOverview() {
  $('btn-admin-all-orders')?.addEventListener('click', () => navigate('all-orders'));
}

function renderAllOrders() {
  const filter = State.orderFilter;
  const statuses = ['All', ...ALL_STATUSES];
  const filtered = filter === 'All' ? State.orders : State.orders.filter(o => o.status === filter);
  const nextStatus = {
    'Pending':'Supplier Contacted','Supplier Contacted':'Supplier Confirmed',
    'Supplier Confirmed':'In Transit to Office','In Transit to Office':'Under Verification',
  };
  return `
  <div>
    <div class="filter-bar">
      ${statuses.map(s => `<button class="filter-pill${s === filter ? ' active' : ''}" data-filter="${s}">${s}</button>`).join('')}
    </div>
    <div class="card">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order ID</th><th>Product</th><th>Buyer</th><th>Supplier</th><th>Qty</th><th>Value</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${filtered.map(o => `
            <tr>
              <td>${mono(o.id, 'style="color:var(--ac)"')}</td>
              <td style="font-weight:700;">${o.product}</td>
              <td style="color:var(--t2);">${o.buyer}</td>
              <td style="color:var(--t2);">${o.supplier}</td>
              <td>${fmt(o.qty)}</td>
              <td style="color:var(--ac);font-weight:700;">₦${fmt(o.basePrice * o.qty * 1.1)}</td>
              <td>${badge(o.status)}</td>
              <td>
                ${nextStatus[o.status]
                  ? `<button class="btn btn-outline btn-sm btn-admin-advance" data-id="${o.id}" data-next="${nextStatus[o.status]}">→ ${nextStatus[o.status].split(' ')[0]}</button>`
                  : badge(o.status)}
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function bindAllOrders() {
  document.querySelectorAll('[data-filter]').forEach(el => {
    el.addEventListener('click', () => {
      State.orderFilter = el.dataset.filter;
      renderContent();
    });
  });
  document.querySelectorAll('.btn-admin-advance').forEach(el => {
    el.addEventListener('click', () => {
      advanceOrder(el.dataset.id, el.dataset.next);
      renderContent();
    });
  });
}

function advanceOrder(id, newStatus) {
  State.orders = State.orders.map(o => {
    if (o.id !== id) return o;
    return { ...o, status: newStatus, timeline: [...o.timeline, { s: newStatus, d: new Date().toLocaleString() }] };
  });
  showToast(`${id} → ${newStatus}`);
}

function renderContacts() {
  const pending = State.orders.filter(o => ['Pending','Supplier Contacted'].includes(o.status));
  return `
  <div>
    <div class="stats-grid-3">
      ${statCard('Needs Contact', State.orders.filter(o => o.status === 'Pending').length, 'action required', '📞', 'var(--rd)')}
      ${statCard('Awaiting Reply', State.orders.filter(o => o.status === 'Supplier Contacted').length, 'contacted', '⏳', 'var(--am)')}
      ${statCard('Confirmed', State.orders.filter(o => o.status === 'Supplier Confirmed').length, 'confirmed stock', '✅', 'var(--gr)')}
    </div>
    <div class="card">
      <div class="card-head"><div class="card-title">Supplier Contact Log</div><div class="card-sub">Active order communications</div></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Product</th><th>Supplier</th><th>Contact</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${pending.map(o => {
              const sup = SUPPLIERS.find(s => s.name === o.supplier) || { email: '—', phone: '—' };
              return `
              <tr>
                <td>${mono(o.id, 'style="color:var(--ac)"')}</td>
                <td style="font-weight:700;">${o.product}</td>
                <td>${o.supplier}</td>
                <td>
                  <div style="font-size:12px;color:var(--t2);">${sup.email}</div>
                  <div style="font-size:11px;color:var(--t3);" class="mono">${sup.phone}</div>
                </td>
                <td>${badge(o.status)}</td>
                <td><button class="btn btn-primary btn-sm btn-contact" data-supplier="${o.supplier}" data-id="${o.id}">📧 Contact</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function bindContacts() {
  document.querySelectorAll('.btn-contact').forEach(el => {
    el.addEventListener('click', () => {
      showToast(`Contacting ${el.dataset.supplier} re: ${el.dataset.id}`);
      advanceOrder(el.dataset.id, 'Supplier Contacted');
      renderContent();
    });
  });
}

function renderSuppliersView() {
  return `
  <div>
    <div class="stats-grid-3">
      ${statCard('Total Suppliers', SUPPLIERS.length, 'registered', '🏭', 'var(--ac)')}
      ${statCard('Verified', SUPPLIERS.filter(s => s.verified).length, 'NAFDAC approved', '✅', 'var(--gr)')}
      ${statCard('Active', SUPPLIERS.filter(s => s.status === 'Active').length, 'currently active', '🟢', 'var(--am)')}
    </div>
    <div class="card">
      <div class="card-head">
        <div><div class="card-title">Supplier Directory</div></div>
        <button class="btn btn-primary btn-sm" id="btn-invite-supplier">+ Invite Supplier</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Supplier</th><th>Products</th><th>Orders</th><th>Revenue</th><th>Rating</th><th>Status</th><th>NAFDAC</th></tr></thead>
          <tbody>
            ${SUPPLIERS.map(s => `
            <tr>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  ${avatar(s.name, 'sm')}
                  <div>
                    <div style="font-weight:700;font-size:13px;">${s.name}</div>
                    <div style="font-size:11px;color:var(--t3);">${s.email}</div>
                  </div>
                </div>
              </td>
              <td style="color:var(--t2);font-size:12px;">${s.products.join(', ')}</td>
              <td style="font-weight:700;">${s.orders}</td>
              <td style="color:var(--ac);font-weight:700;">${fmtM(s.revenue)}</td>
              <td style="color:var(--am);font-weight:700;">${s.rating}★</td>
              <td>${badge(s.status)}</td>
              <td><span style="color:${s.verified ? 'var(--gr)' : 'var(--rd)'};font-weight:700;font-size:12px;">${s.verified ? '✓ Verified' : '✗ Pending'}</span></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function renderAnalytics() {
  const months = ['Aug','Sep','Oct','Nov','Dec','Jan'];
  const revenues = [18.2, 24.1, 19.8, 31.4, 24.8, 36.1];
  const orders = State.orders;
  return `
  <div>
    <div class="stats-grid-4">
      ${statCard('Total GMV', '₦154M', 'all time', '💹', 'var(--ac)', 23)}
      ${statCard('This Month', '₦36.1M', 'January 2024', '📈', 'var(--gr)', 46)}
      ${statCard('Avg Order Size', '₦5.2M', 'per transaction', '📊', 'var(--am)', 8)}
      ${statCard('Verification Rate', '99.2%', 'pharmacist accuracy', '🔬', 'var(--pu)')}
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><div class="card-title">Monthly Revenue (₦M)</div><div class="card-sub">Last 6 months</div></div>
        <div class="card-body">${barChart(months, revenues)}</div>
      </div>
      <div class="card card-body">
        <div style="font-weight:700;font-size:14px;margin-bottom:16px;">Order Status Distribution</div>
        ${[
          ['Delivered',   orders.filter(o => o.status === 'Delivered').length,           'var(--gr)'],
          ['Verified',    orders.filter(o => o.status === 'Verified').length,            'var(--ac)'],
          ['Under Verif.',orders.filter(o => o.status === 'Under Verification').length,  'var(--pu)'],
          ['In Transit',  orders.filter(o => o.status === 'In Transit to Office').length,'var(--am)'],
          ['Pending',     orders.filter(o => ['Pending','Supplier Contacted','Supplier Confirmed'].includes(o.status)).length, 'var(--t2)'],
        ].map(([l, n, c]) => progBar(l, n, Math.max(orders.length, 1), c)).join('')}
      </div>
    </div>
  </div>`;
}

// ══════════════════════════════════════════
//  PHARMACIST VIEWS
// ══════════════════════════════════════════
function renderPhaOverview() {
  const queue = State.orders.filter(o => o.status === 'Under Verification');
  return `
  <div>
    <div class="stats-grid-4">
      ${statCard('In Queue', queue.length, 'awaiting review', '⏳', 'var(--pu)')}
      ${statCard('Verified Today', 3, 'products cleared', '✅', 'var(--gr)')}
      ${statCard('Rejected', 1, 'this week', '✗', 'var(--rd)')}
      ${statCard('Total Processed', 47, 'all time', '🔬', 'var(--ac)')}
    </div>
    <div class="card">
      <div class="card-head">
        <div><div class="card-title">Verification Queue</div><div class="card-sub">${queue.length} product${queue.length !== 1 ? 's' : ''} awaiting verification</div></div>
        <button class="btn btn-primary btn-sm" id="btn-open-queue">Open Queue →</button>
      </div>
      <div class="card-body" style="display:flex;flex-direction:column;gap:10px;">
        ${queue.length === 0
          ? emptyState('✅', 'Queue is clear', 'All products have been verified')
          : queue.map(o => `
        <div style="display:flex;align-items:center;gap:14px;background:var(--pug);border:1px solid var(--pu)33;border-radius:var(--r12);padding:14px 16px;">
          <div style="width:40px;height:40px;border-radius:var(--r8);background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:18px;">💊</div>
          <div style="flex:1;">
            <div style="font-weight:700;font-size:14px;">${o.product}</div>
            <div style="font-size:12px;color:var(--t2);margin-top:2px;">${mono(o.id, 'style="color:var(--ac);font-size:12px;"')} · ${o.supplier} · ${mono(o.batch || '—')}</div>
          </div>
          <button class="btn btn-outline btn-sm btn-start-verify" data-id="${o.id}">Verify →</button>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
}

function bindPhaOverview() {
  $('btn-open-queue')?.addEventListener('click', () => navigate('queue'));
  document.querySelectorAll('.btn-start-verify').forEach(el => {
    el.addEventListener('click', () => {
      State.verifyOrder = State.orders.find(o => o.id === el.dataset.id);
      navigate('verify');
    });
  });
}

function renderQueue() {
  const queue = State.orders.filter(o => o.status === 'Under Verification');
  if (!queue.length) return emptyState('✅', 'Queue is empty', 'All products have been verified',
    `<button class="btn btn-primary" onclick="navigate('overview')">← Back to Overview</button>`);
  return `
  <div style="display:flex;flex-direction:column;gap:12px;">
    ${queue.map(o => `
    <div class="card">
      <div style="padding:18px 22px;display:flex;gap:16px;align-items:center;">
        <div style="width:52px;height:52px;border-radius:var(--r12);background:var(--pug);display:flex;align-items:center;justify-content:center;font-size:24px;border:1px solid var(--pu)33;">💊</div>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:15px;margin-bottom:4px;">${o.product}</div>
          <div style="display:flex;gap:14px;font-size:12px;color:var(--t2);flex-wrap:wrap;">
            <span>Order: ${mono(o.id, 'style="color:var(--ac)"')}</span>
            <span>Supplier: ${o.supplier}</span>
            <span>Qty: ${fmt(o.qty)} units</span>
            <span>Batch: ${mono(o.batch || '—')}</span>
            <span>NAFDAC: ${mono(o.nafdac || '—')}</span>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="text-align:right;">
            <div style="font-family:var(--fd);font-size:18px;color:var(--ac);">₦${fmt(o.basePrice * o.qty * 1.1)}</div>
            <div style="font-size:11px;color:var(--t3);">order value</div>
          </div>
          <button class="btn btn-primary btn-queue-verify" data-id="${o.id}">Start Verification →</button>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}

function bindQueue() {
  document.querySelectorAll('.btn-queue-verify').forEach(el => {
    el.addEventListener('click', () => {
      State.verifyOrder = State.orders.find(o => o.id === el.dataset.id);
      State.verifyChecks = {};
      navigate('verify');
    });
  });
}

const CHECKLIST = [
  'Package seal intact and unbroken',
  'Batch number matches documentation',
  'Expiry date valid (> 6 months remaining)',
  'Storage requirements met during delivery',
  'Quantity matches order exactly',
  'NAFDAC approval label visible & legible',
  'No signs of tampering or counterfeiting',
  'Temperature-sensitive items within range',
  'Manufacturer info matches registered product',
  'Color, texture and appearance normal',
];

function renderVerify(o) {
  if (!o) return emptyState('🔬', 'No product selected', 'Select from the verification queue',
    `<button class="btn btn-primary" onclick="navigate('queue')">Open Queue</button>`);
  const checks = State.verifyChecks;
  const checkCount = Object.values(checks).filter(Boolean).length;
  const allChecked = checkCount === CHECKLIST.length;
  return `
  <div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
      <button class="btn btn-ghost btn-sm" onclick="navigate('queue')">← Queue</button>
      <div style="font-family:var(--fd);font-size:18px;">Verify: ${o.product}</div>
      ${badge('Under Verification')}
    </div>
    <div class="grid-main-aside">
      <div>
        <!-- Barcode lookup -->
        <div class="card" style="margin-bottom:16px;">
          <div class="card-head"><div class="card-title">NAFDAC Barcode Lookup</div><div class="card-sub">Scan or enter the product barcode</div></div>
          <div class="card-body">
            <div style="display:flex;gap:10px;margin-bottom:12px;">
              <input type="text" id="barcode-input" placeholder="Enter barcode or NAFDAC number…">
              <button class="btn btn-primary" id="btn-barcode-lookup">Lookup</button>
            </div>
            <div id="barcode-result"></div>
          </div>
        </div>
        <!-- Checklist -->
        <div class="card">
          <div class="card-head">
            <div><div class="card-title">Verification Checklist</div><div class="card-sub">${checkCount} of ${CHECKLIST.length} items checked</div></div>
            <div style="font-size:12px;color:${checkCount === CHECKLIST.length ? 'var(--gr)' : 'var(--t3)'};font-weight:700;">${checkCount}/${CHECKLIST.length}</div>
          </div>
          <div style="padding:0 20px 20px;">
            ${CHECKLIST.map((item, i) => `
            <label class="check-item${checks[i] ? ' checked' : ''}" style="display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:${i < CHECKLIST.length - 1 ? '1px solid var(--b1)' : 'none'};cursor:pointer;">
              <input type="checkbox" class="verify-check" data-idx="${i}" ${checks[i] ? 'checked' : ''}>
              <span class="check-label">${item}</span>
            </label>`).join('')}
          </div>
        </div>
        <!-- Notes -->
        <div class="card" style="margin-top:14px;">
          <div class="card-head"><div class="card-title">Verification Notes</div></div>
          <div class="card-body"><textarea id="verify-notes" rows="3" placeholder="Add observations or concerns about the product condition…"></textarea></div>
        </div>
        <!-- Actions -->
        <div class="grid-2" style="margin-top:14px;">
          <button class="btn btn-danger btn-lg btn-full" id="btn-reject">✗ Reject Product</button>
          <button class="btn btn-success btn-lg btn-full" id="btn-approve" ${!allChecked ? 'disabled' : ''}>✓ Verify & Release Payment</button>
        </div>
        ${!allChecked ? `<div style="font-size:12px;color:var(--am);text-align:center;margin-top:10px;">Complete all ${CHECKLIST.length} checklist items to enable verification</div>` : ''}
      </div>
      <div>
        <div class="card">
          <div class="card-head"><div class="card-title">Order Information</div></div>
          <div class="card-body-sm">
            ${infoRows([
              ['Order ID',  `<span class="mono" style="color:var(--ac)">${o.id}</span>`],
              ['Product',   `<strong>${o.product}</strong>`],
              ['Buyer',     o.buyer],
              ['Supplier',  o.supplier],
              ['Quantity',  `${fmt(o.qty)} units`],
              ['Value',     `<strong style="color:var(--ac)">₦${fmt(o.basePrice * o.qty * 1.1)}</strong>`],
              ['Batch No',  `<span class="mono">${o.batch || '—'}</span>`],
              ['NAFDAC',    `<span class="mono">${o.nafdac || '—'}</span>`],
              ['Category',  o.cat],
            ])}
          </div>
        </div>
        <div class="info-banner banner-warn" style="margin-top:14px;">
          <div class="info-banner-title">⚠ Pharmacist Responsibility</div>
          You are legally certifying this product meets Nigerian pharmaceutical standards. Rejection triggers automatic admin & supplier notification.
        </div>
      </div>
    </div>
  </div>`;
}

function bindVerify() {
  // Checklist
  document.querySelectorAll('.verify-check').forEach(el => {
    el.addEventListener('change', () => {
      State.verifyChecks[el.dataset.idx] = el.checked;
      // Rerender just the checklist section for efficiency
      renderContent();
    });
  });
  // Barcode
  $('btn-barcode-lookup')?.addEventListener('click', () => {
    const o = State.verifyOrder;
    $('barcode-result').innerHTML = `
    <div style="background:var(--grg);border:1px solid var(--gr)44;border-radius:var(--r8);padding:12px 16px;">
      <div style="color:var(--gr);font-weight:700;margin-bottom:6px;">✓ Product Verified in NAFDAC Registry</div>
      <div style="font-size:13px;color:var(--t2);">${o?.product || 'Unknown'} · NAFDAC Reg: <span class="mono">${o?.nafdac || 'N/A'}</span></div>
    </div>`;
  });
  // Actions
  $('btn-reject')?.addEventListener('click', () => doVerification('rejected'));
  $('btn-approve')?.addEventListener('click', () => doVerification('approved'));
}

function doVerification(result) {
  const o = State.verifyOrder;
  if (!o) return;
  const newStatus = result === 'approved' ? 'Verified' : 'Rejected';
  State.orders = State.orders.map(ord => {
    if (ord.id !== o.id) return ord;
    return { ...ord, status: newStatus, timeline: [...ord.timeline, { s: newStatus, d: new Date().toLocaleString() }] };
  });
  State.verifyChecks = {};
  showToast(
    result === 'approved' ? 'Product verified! Payment will be released.' : 'Product rejected. Admin & supplier notified.',
    result === 'approved' ? 'success' : 'error'
  );
  navigate('pha-history');
}

function renderPhaHistory() {
  const history = [
    {id:'ORD-3040',product:'Paracetamol 500mg',batch:'BATCH-5809',result:'Verified',date:'Jan 12, 2024',notes:''},
    {id:'ORD-3037',product:'Metformin 500mg',batch:'BATCH-5807',result:'Verified',date:'Jan 10, 2024',notes:''},
    {id:'ORD-2980',product:'Ciprofloxacin 500mg',batch:'BATCH-5802',result:'Rejected',date:'Jan 8, 2024',notes:'Expired batch detected'},
    {id:'ORD-2970',product:'Lisinopril 10mg',batch:'BATCH-5799',result:'Verified',date:'Jan 5, 2024',notes:''},
    {id:'ORD-2965',product:'Omeprazole 20mg',batch:'BATCH-5798',result:'Verified',date:'Jan 3, 2024',notes:''},
  ];
  // Append any newly verified/rejected
  const recent = State.orders.filter(o => ['Verified','Rejected'].includes(o.status) && !history.find(h => h.id === o.id));
  const all = [...recent.map(o => ({ id: o.id, product: o.product, batch: o.batch, result: o.status, date: 'Just now', notes: '' })), ...history];
  return `
  <div class="card">
    <div class="card-head"><div class="card-title">Verification History</div><div class="card-sub">${all.length} records</div></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Order ID</th><th>Product</th><th>Batch No.</th><th>Result</th><th>Date</th><th>Notes</th></tr></thead>
        <tbody>
          ${all.map(h => `
          <tr>
            <td>${mono(h.id, 'style="color:var(--ac)"')}</td>
            <td style="font-weight:700;">${h.product}</td>
            <td>${mono(h.batch || '—', 'style="font-size:11px;"')}</td>
            <td>${badge(h.result)}</td>
            <td style="color:var(--t2);">${h.date}</td>
            <td style="color:var(--t3);font-size:12px;">${h.notes || '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ─── ADDITIONAL SUPPLIER OVERVIEW BINDING ──────────────────
function renderSupplierOverviewBinding() {
  $('btn-sup-orders')?.addEventListener('click', () => navigate('sup-orders'));
}

// Patch bindViewEvents for supplier overview
const _origBindViewEvents = bindViewEvents;
// (already handles via the existing bindViewEvents switch)

// ─── BOOT ──────────────────────────────────────────────────
window.navigate = navigate; // expose for inline onclick handlers
window.closeModal = closeModal;

document.addEventListener('DOMContentLoaded', () => { render(); });
