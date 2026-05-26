/* ── State ─────────────────────────────────────────── */
let activeFilters = {};
let searchQuery   = '';
let sortKey       = 'ranking';
let viewMode      = 'grid';
let allGames      = []; // cache de los juegos del backend

/* ── Fetch ─────────────────────────────────────────── */
async function loadGames() {
  const params = new URLSearchParams();
  if (activeFilters.genero?.size)     params.set('genre',    [...activeFilters.genero][0]);
  if (activeFilters.plataforma?.size) params.set('platform', [...activeFilters.plataforma][0]);
  params.set('page', 1);

  const res  = await fetch('/api/catalog?' + params.toString());
  const data = await res.json();
  return data.games;
}

/* ── Client-side filtering (año, nota, búsqueda, sort) */
function getFiltered(games) {
  return games.filter(g => {
    // Search — backend devuelve 'title', no 'name'
    const name = (g.title || g.name || '').toLowerCase();
    if (searchQuery && !name.includes(searchQuery)) return false;

    // Year
    const yearF = activeFilters.anyo;
    if (yearF && yearF.size > 0) {
      const matchYear = [...yearF].some(f => {
        if (f === 'old') return g.year < 2022;
        return g.year === parseInt(f);
      });
      if (!matchYear) return false;
    }

    // Score — backend devuelve 'press_score' y 'community_score'
    const press = g.press_score ?? g.press ?? 0;
    const notaF = activeFilters.nota;
    if (notaF && notaF.size > 0) {
      const matchNota = [...notaF].some(f => {
        const [lo, hi] = f.split('-').map(Number);
        return press >= lo && press <= hi;
      });
      if (!matchNota) return false;
    }

    return true;
  }).sort((a, b) => {
    const pressA     = a.press_score     ?? a.press     ?? 0;
    const pressB     = b.press_score     ?? b.press     ?? 0;
    const communityA = a.community_score ?? a.community ?? 0;
    const communityB = b.community_score ?? b.community ?? 0;
    const nameA      = a.title ?? a.name ?? '';
    const nameB      = b.title ?? b.name ?? '';

    switch (sortKey) {
      case 'press':     return pressB - pressA;
      case 'community': return communityB - communityA;
      case 'year-desc': return b.year - a.year;
      case 'year-asc':  return a.year - b.year;
      case 'name':      return nameA.localeCompare(nameB);
      default:          return (a.rank ?? 0) - (b.rank ?? 0);
    }
  });
}

/* ── Card templates ────────────────────────────────── */
function cardHTML(g, idx) {
  const name      = g.title      ?? g.name      ?? '—';
  const genre     = g.genre      ?? '';
  const year      = g.year       ?? '';
  const press     = (g.press_score     ?? g.press     ?? 0).toFixed(1);
  const community = (g.community_score ?? g.community ?? 0).toFixed(1);
  const rank      = g.rank ?? idx + 1;
  const coverClass = g.coverClass ?? `gc${(idx % 9) + 1}`;

  return `
    <div class="game-card" onclick="location.href='juego.html?id=${g.id}'">
      <div class="game-cover">
        <div class="game-cover-bg ${coverClass}"></div>
        <div class="game-rank${rank === 1 ? ' gold' : ''}">#${rank}</div>
        <div class="game-genre-tag">${genre}</div>
      </div>
      <div class="game-info">
        <div class="game-name">${name}</div>
        <div class="game-year">${year}</div>
        <div class="game-scores">
          <div class="score-row"><span class="score-label">${t('score.prensa')}</span><span class="score-val press">★ ${press}</span></div>
          <div class="score-row"><span class="score-label">${t('score.usuarios')}</span><span class="score-val community">★ ${community}</span></div>
        </div>
      </div>
    </div>`;
}

function rowHTML(g, idx) {
  const name      = g.title      ?? g.name      ?? '—';
  const genre     = g.genre      ?? '';
  const year      = g.year       ?? '';
  const press     = (g.press_score     ?? g.press     ?? 0).toFixed(1);
  const community = (g.community_score ?? g.community ?? 0).toFixed(1);
  const rank      = g.rank ?? idx + 1;
  const coverClass = g.coverClass ?? `gc${(idx % 9) + 1}`;

  return `
    <div class="game-row" onclick="location.href='juego.html?id=${g.id}'">
      <div class="row-rank${rank === 1 ? ' gold' : ''}">#${rank}</div>
      <div class="row-thumb"><div class="row-thumb-bg ${coverClass}"></div></div>
      <div class="row-info">
        <div class="row-name">${name}</div>
        <div class="row-meta">${genre} · ${year}</div>
      </div>
      <div class="row-scores">
        <div class="row-score">
          <span class="row-score-val press">★ ${press}</span>
          <span class="row-score-label">${t('score.prensa')}</span>
        </div>
        <div class="row-score">
          <span class="row-score-val community">★ ${community}</span>
          <span class="row-score-label">${t('score.usuarios')}</span>
        </div>
      </div>
    </div>`;
}

/* ── Render ─────────────────────────────────────────── */
function render() {
  const filtered = getFiltered(allGames);
  const grid  = document.getElementById('gamesGrid');
  const list  = document.getElementById('gamesList');
  const noRes = document.getElementById('noResults');
  const count = document.getElementById('resultsCount');

  grid.innerHTML = filtered.map((g, i) => cardHTML(g, i)).join('');
  list.innerHTML = filtered.map((g, i) => rowHTML(g, i)).join('');

  const n = filtered.length;
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'es';
  const countStr = lang === 'es'
    ? `${n} juego${n !== 1 ? 's' : ''} encontrado${n !== 1 ? 's' : ''}`
    : `${n} game${n !== 1 ? 's' : ''} found`;

  noRes.classList.toggle('visible', n === 0);
  count.innerHTML = countStr.replace(String(n), `<strong>${n}</strong>`);
}

/* ── Chips ─────────────────────────────────────────── */
function renderChips() {
  const CHIP_LABELS = {
    rpg: 'RPG', accion: 'Acción', estrategia: 'Estrategia', indie: 'Indie',
    pc: 'PC', ps5: 'PS5', xbox: 'Xbox', switch: 'Switch',
    '2024': '2024', '2023': '2023', '2022': '2022',
    old: t('catalogo.filter.old'),
    '9-10': '9 – 10', '8-9': '8 – 9', '7-8': '7 – 8', '6-7': '6 – 7',
  };

  const wrap = document.getElementById('activeFilters');
  const chips = [];
  Object.entries(activeFilters).forEach(([group, vals]) => {
    vals.forEach(val => {
      const label = CHIP_LABELS[val] || val;
      chips.push(`<span class="filter-chip" data-group="${group}" data-val="${val}">${label} <span class="chip-x">×</span></span>`);
    });
  });
  wrap.innerHTML = chips.join('');
  wrap.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const g = chip.dataset.group, v = chip.dataset.val;
      activeFilters[g]?.delete(v);
      document.querySelector(`input[data-group="${g}"][value="${v}"]`).checked = false;
      renderChips(); render();
    });
  });
}

/* ── Reload from backend (genre/platform changed) ──── */
async function reloadAndRender() {
  allGames = await loadGames();
  render();
}

/* ── Event listeners ───────────────────────────────── */
document.querySelectorAll('.filter-opt input').forEach(cb => {
  cb.addEventListener('change', () => {
    const g = cb.dataset.group;
    if (!activeFilters[g]) activeFilters[g] = new Set();
    cb.checked ? activeFilters[g].add(cb.value) : activeFilters[g].delete(cb.value);
    renderChips();
    // Genre/platform → backend. Year/score → client only
    const backendFilters = ['genero', 'plataforma'];
    if (backendFilters.includes(g)) {
      reloadAndRender();
    } else {
      render();
    }
  });
});

document.getElementById('clearAll').addEventListener('click', () => {
  activeFilters = {};
  document.querySelectorAll('.filter-opt input').forEach(cb => cb.checked = false);
  renderChips();
  reloadAndRender();
});

let searchTimeout;
document.getElementById('searchInput').addEventListener('input', e => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value.toLowerCase().trim();
    render();
  }, 220);
});

document.getElementById('sortSelect').addEventListener('change', e => {
  sortKey = e.target.value;
  render();
});

const gridEl = document.getElementById('gamesGrid');
const listEl = document.getElementById('gamesList');
document.getElementById('btnGrid').addEventListener('click', () => {
  viewMode = 'grid';
  gridEl.style.display = ''; listEl.style.display = 'none';
  document.getElementById('btnGrid').classList.add('active');
  document.getElementById('btnList').classList.remove('active');
});
document.getElementById('btnList').addEventListener('click', () => {
  viewMode = 'list';
  gridEl.style.display = 'none'; listEl.style.display = '';
  document.getElementById('btnList').classList.add('active');
  document.getElementById('btnGrid').classList.remove('active');
});

document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.page-btn[data-page]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('prevPage').disabled = btn.dataset.page === '1';
    document.getElementById('nextPage').disabled = btn.dataset.page === '3';
  });
});

/* ── i18n hook ─────────────────────────────────────── */
if (typeof i18nHooks !== 'undefined') {
  i18nHooks.push(() => { render(); renderChips(); });
}

/* ── Init ──────────────────────────────────────────── */
reloadAndRender();
