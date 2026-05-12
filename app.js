// ─── CONSTANTS ────────────────────────────────────────────────
const ICONS = {
  Food:'🍔', Transport:'🚗', Shopping:'🛍️', Entertainment:'🎮',
  Health:'💊', Salary:'💼', Freelance:'💻', General:'💰',
  Other:'📦', Rent:'🏠', Utilities:'💡', Education:'📚',
};
const CATS = Object.keys(ICONS);
const CAT_COLORS = [
  '#4f8ef7','#00c896','#ff5b6b','#f5a623','#a78bfa','#22d3ee',
  '#fb923c','#34d399','#f472b6','#818cf8','#facc15','#60a5fa',
];

// ─── STATE ────────────────────────────────────────────────────
let transactions = [];
let currentFilter = 'all';
let selectedType  = 'expense';
let donutChart    = null;
let barChart      = null;

// ─── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  buildCategorySelect();
  setDateHeader();
  initTheme();
  initCharts();
  render();

  // Enter key submits
  document.getElementById('desc').addEventListener('keydown', e => { if (e.key === 'Enter') addTransaction(); });
  document.getElementById('amount').addEventListener('keydown', e => { if (e.key === 'Enter') addTransaction(); });

  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

// ─── THEME ────────────────────────────────────────────────────
function initTheme() {
  const saved = localStorage.getItem('bt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('bt_theme', next);
  updateChartColors();
}

function getChartGridColor() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'rgba(255,255,255,0.05)'
    : 'rgba(0,0,0,0.06)';
}
function getChartTickColor() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? '#6b6e87' : '#7a7e9a';
}

// ─── DATE HEADER ──────────────────────────────────────────────
function setDateHeader() {
  document.getElementById('hdr-date').textContent =
    new Date().toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' });
}

// ─── CATEGORY SELECT ──────────────────────────────────────────
function buildCategorySelect() {
  const sel = document.getElementById('category');
  CATS.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = ICONS[c] + ' ' + c;
    sel.appendChild(opt);
  });
}

// ─── STORAGE ──────────────────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('bt_txns', JSON.stringify(transactions));
}
function loadFromStorage() {
  try { transactions = JSON.parse(localStorage.getItem('bt_txns') || '[]'); }
  catch { transactions = []; }
}

// ─── FORMAT CURRENCY ──────────────────────────────────────────
function fmt(n) {
  return '₹' + Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits:2, maximumFractionDigits:2 });
}

// ─── TYPE TOGGLE ──────────────────────────────────────────────
function setType(type) {
  selectedType = type;
  document.getElementById('btn-income').classList.toggle('on',  type === 'income');
  document.getElementById('btn-expense').classList.toggle('on', type === 'expense');
  document.getElementById('btn-income').classList.toggle('inc', true);
  document.getElementById('btn-expense').classList.toggle('exp', true);
}

// ─── ADD TRANSACTION ──────────────────────────────────────────
function addTransaction() {
  const descEl   = document.getElementById('desc');
  const amountEl = document.getElementById('amount');
  const category = document.getElementById('category').value;

  const desc   = descEl.value.trim();
  const amount = parseFloat(amountEl.value);

  descEl.classList.remove('err');
  amountEl.classList.remove('err');

  let valid = true;
  if (!desc)               { descEl.classList.add('err');   valid = false; }
  if (!amount || amount <= 0) { amountEl.classList.add('err'); valid = false; }
  if (!valid) return;

  transactions.unshift({
    id: Date.now(),
    ts: Date.now(),
    desc,
    amount: parseFloat(amount.toFixed(2)),
    type: selectedType,
    category,
    date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }),
  });

  saveToStorage();
  render();

  descEl.value   = '';
  amountEl.value = '';
  descEl.focus();
}

// ─── DELETE ───────────────────────────────────────────────────
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveToStorage();
  render();
}

// ─── FILTER ───────────────────────────────────────────────────
function setFilter(type, btn) {
  currentFilter = type;
  document.querySelectorAll('.fb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  renderList();
}

// ─── CLEAR ALL ────────────────────────────────────────────────
function clearAll() {
  if (!transactions.length) return;
  if (!confirm('Are you sure you want to delete all transactions?')) return;
  transactions = [];
  saveToStorage();
  render();
}

// ─── SUMMARY ──────────────────────────────────────────────────
function calcSummary() {
  const income  = transactions.filter(t => t.type === 'income').reduce((s,t)  => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
  return { income, expense, balance: income - expense };
}

// ─── CATEGORY BREAKDOWN ───────────────────────────────────────
function calcCatBreakdown() {
  const expTxns = transactions.filter(t => t.type === 'expense');
  const totExp  = expTxns.reduce((s,t) => s + t.amount, 0);
  const map = {};
  expTxns.forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount; });
  return Object.entries(map)
    .sort((a,b) => b[1] - a[1])
    .map(([cat, val], i) => ({ cat, val, pct: totExp > 0 ? (val / totExp * 100) : 0, color: CAT_COLORS[i % CAT_COLORS.length] }));
}

// ─── INIT CHARTS ──────────────────────────────────────────────
function initCharts() {
  // Donut
  const dCtx = document.getElementById('donut-chart').getContext('2d');
  donutChart = new Chart(dCtx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{ data: [1, 0], backgroundColor: ['#2a2d3e', '#2a2d3e'], borderWidth: 0, hoverOffset: 6 }],
    },
    options: {
      cutout: '72%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => ' ' + fmt(c.raw) } },
      },
      animation: { animateRotate: true, duration: 700 },
    },
  });

  // Bar
  const bCtx = document.getElementById('bar-chart').getContext('2d');
  barChart = new Chart(bCtx, {
    type: 'bar',
    data: {
      labels: [],
      datasets: [
        { label:'Income',  data:[], backgroundColor:'rgba(0,200,150,0.75)', borderRadius:6, borderSkipped:false },
        { label:'Expense', data:[], backgroundColor:'rgba(255,91,107,0.75)', borderRadius:6, borderSkipped:false },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => ' ' + fmt(c.raw) } },
      },
      scales: {
        x: { grid: { color: getChartGridColor() }, ticks: { color: getChartTickColor(), font:{ size:11 } } },
        y: { grid: { color: getChartGridColor() }, ticks: { color: getChartTickColor(), font:{ size:10 }, callback: v => '₹'+v } },
      },
      animation: { duration: 600 },
    },
  });
}

// ─── UPDATE CHART COLORS ON THEME CHANGE ──────────────────────
function updateChartColors() {
  if (!barChart) return;
  const grid = getChartGridColor();
  const tick = getChartTickColor();
  barChart.options.scales.x.grid.color   = grid;
  barChart.options.scales.y.grid.color   = grid;
  barChart.options.scales.x.ticks.color  = tick;
  barChart.options.scales.y.ticks.color  = tick;
  barChart.update();
}

// ─── UPDATE CHARTS DATA ───────────────────────────────────────
function updateCharts({ income, expense }) {
  // Donut
  const total = income + expense;
  donutChart.data.datasets[0].data = total > 0 ? [income, expense] : [1, 0];
  donutChart.data.datasets[0].backgroundColor = total > 0
    ? ['rgba(0,200,150,0.85)', 'rgba(255,91,107,0.85)']
    : ['#2a2d3e', '#2a2d3e'];
  donutChart.update();

  // Legend
  document.getElementById('leg-income').textContent  = 'Income '  + fmt(income);
  document.getElementById('leg-expense').textContent = 'Expense ' + fmt(expense);

  // Bar — last 6 months
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ label: d.toLocaleString('en-IN', { month:'short' }), year: d.getFullYear(), month: d.getMonth() });
  }
  const incData = months.map(m =>
    transactions.filter(t => t.type==='income' && new Date(t.ts).getMonth()===m.month && new Date(t.ts).getFullYear()===m.year)
      .reduce((s,t) => s+t.amount, 0)
  );
  const expData = months.map(m =>
    transactions.filter(t => t.type==='expense' && new Date(t.ts).getMonth()===m.month && new Date(t.ts).getFullYear()===m.year)
      .reduce((s,t) => s+t.amount, 0)
  );
  barChart.data.labels = months.map(m => m.label);
  barChart.data.datasets[0].data = incData;
  barChart.data.datasets[1].data = expData;
  barChart.update();
}

// ─── RENDER CATEGORY BREAKDOWN ────────────────────────────────
function renderCatBreakdown() {
  const breakdown = calcCatBreakdown();
  const section   = document.getElementById('cat-section');
  const table     = document.getElementById('cat-table');

  if (!breakdown.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';

  table.innerHTML = breakdown.slice(0, 6).map(({ cat, val, pct, color }) => `
    <div class="cat-row">
      <div class="cat-icon">${ICONS[cat] || '💰'}</div>
      <div class="cat-name">${cat}</div>
      <div class="cat-track">
        <div class="cat-fill" style="width:${pct}%;background:${color}"></div>
      </div>
      <div class="cat-val">${fmt(val)}</div>
    </div>
  `).join('');
}

// ─── RENDER TRANSACTION LIST ──────────────────────────────────
function renderList() {
  const list = document.getElementById('txn-list');
  const filtered = currentFilter === 'all'
    ? transactions
    : transactions.filter(t => t.type === currentFilter);

  document.getElementById('txn-count').textContent = filtered.length + ' entries';
  document.getElementById('clear-btn').style.display = transactions.length ? 'inline-block' : 'none';

  if (!filtered.length) {
    list.innerHTML = `<div class="empty">📭 No ${currentFilter === 'all' ? '' : currentFilter + ' '}transactions yet</div>`;
    return;
  }

  list.innerHTML = filtered.map(t => `
    <div class="txn ${t.type}">
      <div class="t-ico">${ICONS[t.category] || '💰'}</div>
      <div class="t-body">
        <div class="t-desc">${escapeHTML(t.desc)}</div>
        <div class="t-meta">
          <span class="t-badge">${t.category}</span>${t.date}
        </div>
      </div>
      <span class="t-amt">${t.type === 'income' ? '+' : '-'}${fmt(t.amount)}</span>
      <button class="del" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>
    </div>
  `).join('');
}

// ─── FULL RENDER ─────────────────────────────────────────────
function render() {
  const { income, expense, balance } = calcSummary();

  // Summary cards
  document.getElementById('card-balance').textContent = fmt(balance);
  document.getElementById('card-balance').style.color = balance >= 0 ? 'var(--blue)' : 'var(--red)';
  document.getElementById('card-income').textContent  = fmt(income);
  document.getElementById('card-expense').textContent = fmt(expense);

  updateCharts({ income, expense });
  renderCatBreakdown();
  renderList();
}

// ─── SANITIZE ────────────────────────────────────────────────
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
