/* ── Game data ─────────────────────────────────────── */
async function loadGames() {
    const params = new URLSearchParams();
    if (activeFilters.genero?.size) params.set('genre', [...activeFilters.genero][0]);
    if (activeFilters.plataforma?.size) params.set('platform', [...activeFilters.plataforma][0]);
    params.set('page', 1);

    const res = await fetch('/api/catalog?' + params.toString());
    const data = await res.json();
    return data.games; // array con los juegos
}
/* ── State ─────────────────────────────────────────── */
let activeFilters = {}; // { genero: Set, plataforma: Set, ... }
let searchQuery = '';
let sortKey = 'ranking';
let viewMode = 'grid'; // 'grid' | 'list'

/* ── Render ─────────────────────────────────────────── */
function getFiltered() {
    return GAMES.filter(g => {
        // Search
        if (searchQuery && !g.name.toLowerCase().includes(searchQuery)) return false;
        // Genre
        const genreF = activeFilters.genero;
        if (genreF && genreF.size > 0) {
            const gLow = g.genre.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (![...genreF].some(f => gLow.includes(f))) return false;
        }
        // Platform
        const platF = activeFilters.plataforma;
        if (platF && platF.size > 0) {
            if (![...platF].some(f => g.platform.includes(f))) return false;
        }
        // Year
        const yearF = activeFilters.anyo;
        if (yearF && yearF.size > 0) {
            const matchYear = [...yearF].some(f => {
                if (f === 'old') return g.year < 2022;
                return g.year === parseInt(f);
            });
            if (!matchYear) return false;
        }
        // Score
        const notaF = activeFilters.nota;
        if (notaF && notaF.size > 0) {
            const matchNota = [...notaF].some(f => {
                const [lo, hi] = f.split('-').map(Number);
                return g.press >= lo && g.press <= hi;
            });
            if (!matchNota) return false;
        }
        return true;
    }).sort((a, b) => {
        switch (sortKey) {
            case 'press':
                return b.press - a.press;
            case 'community':
                return b.community - a.community;
            case 'year-desc':
                return b.year - a.year;
            case 'year-asc':
                return a.year - b.year;
            case 'name':
                return a.name.localeCompare(b.name);
            default:
                return a.rank - b.rank;
        }
    });
}

function cardHTML(g) {
    const isTop3 = g.rank <= 3;
    return `
        <div class="game-card" onclick="location.href='juego.html'">
          <div class="game-cover">
            <div class="game-cover-bg ${g.coverClass}"></div>
            <div class="game-rank${g.rank === 1 ? ' gold' : ''}">#${g.rank}</div>
            <div class="game-genre-tag">${g.genre}</div>
          </div>
          <div class="game-info">
            <div class="game-name">${g.name}</div>
            <div class="game-year">${g.year}</div>
            <div class="game-scores">
              <div class="score-row"><span class="score-label">${t('score.prensa')}</span><span class="score-val press">★ ${g.press.toFixed(1)}</span></div>
              <div class="score-row"><span class="score-label">${t('score.usuarios')}</span><span class="score-val community">★ ${g.community.toFixed(1)}</span></div>
            </div>
          </div>
        </div>`;
}

function rowHTML(g) {
    return `
        <div class="game-row" onclick="location.href='juego.html'">
          <div class="row-rank${g.rank === 1 ? ' gold' : ''}">#${g.rank}</div>
          <div class="row-thumb"><div class="row-thumb-bg ${g.coverClass}"></div></div>
          <div class="row-info">
            <div class="row-name">${g.name}</div>
            <div class="row-meta">${g.genre} · ${g.year}</div>
          </div>
          <div class="row-scores">
            <div class="row-score">
              <span class="row-score-val press">★ ${g.press.toFixed(1)}</span>
              <span class="row-score-label">${t('score.prensa')}</span>
            </div>
            <div class="row-score">
              <span class="row-score-val community">★ ${g.community.toFixed(1)}</span>
              <span class="row-score-label">${t('score.usuarios')}</span>
            </div>
          </div>
        </div>`;
}

function render() {
    const filtered = getFiltered();
    const grid = document.getElementById('gamesGrid');
    const list = document.getElementById('gamesList');
    const noRes = document.getElementById('noResults');
    const count = document.getElementById('resultsCount');

    grid.innerHTML = filtered.map(cardHTML).join('');
    list.innerHTML = filtered.map(rowHTML).join('');

    const n = filtered.length;
    const hasResults = n > 0;
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'es';
    const countStr = lang === 'es' ?
        `${n} juego${n !== 1 ? 's' : ''} encontrado${n !== 1 ? 's' : ''}` :
        `${n} game${n !== 1 ? 's' : ''} found`;
    noRes.classList.toggle('visible', !hasResults);
    count.innerHTML = countStr.replace(String(n), `<strong>${n}</strong>`);
}

function renderChips() {
    // Map raw filter values to human-readable translated labels
    const CHIP_LABELS = {
        // genero
        rpg: 'RPG',
        accion: 'Acción',
        estrategia: 'Estrategia',
        indie: 'Indie',
        // plataforma
        pc: 'PC',
        ps5: 'PS5',
        xbox: 'Xbox',
        switch: 'Switch',
        // anyo
        '2024': '2024',
        '2023': '2023',
        '2022': '2022',
        old: t('catalogo.filter.old'),
        // nota
        '9-10': '9 – 10',
        '8-9': '8 – 9',
        '7-8': '7 – 8',
        '6-7': '6 – 7',
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
            const g = chip.dataset.group,
                v = chip.dataset.val;
            activeFilters[g]?.delete(v);
            document.querySelector(`input[data-group="${g}"][value="${v}"]`).checked = false;
            renderChips();
            render();
        });
    });
}

/* ── Event listeners ───────────────────────────────── */
// Checkboxes
document.querySelectorAll('.filter-opt input').forEach(cb => {
    cb.addEventListener('change', () => {
        const g = cb.dataset.group;
        if (!activeFilters[g]) activeFilters[g] = new Set();
        cb.checked ? activeFilters[g].add(cb.value) : activeFilters[g].delete(cb.value);
        renderChips();
        render();
    });
});

// Clear all
document.getElementById('clearAll').addEventListener('click', () => {
    activeFilters = {};
    document.querySelectorAll('.filter-opt input').forEach(cb => cb.checked = false);
    renderChips();
    render();
});

// Search
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchQuery = e.target.value.toLowerCase().trim();
        render();
    }, 220);
});

// Sort
document.getElementById('sortSelect').addEventListener('change', e => {
    sortKey = e.target.value;
    render();
});

// View toggle
const gridEl = document.getElementById('gamesGrid');
const listEl = document.getElementById('gamesList');
document.getElementById('btnGrid').addEventListener('click', () => {
    viewMode = 'grid';
    gridEl.style.display = '';
    listEl.style.display = 'none';
    document.getElementById('btnGrid').classList.add('active');
    document.getElementById('btnList').classList.remove('active');
});
document.getElementById('btnList').addEventListener('click', () => {
    viewMode = 'list';
    gridEl.style.display = 'none';
    listEl.style.display = '';
    document.getElementById('btnList').classList.add('active');
    document.getElementById('btnGrid').classList.remove('active');
});

// Pagination (demo — just visual)
document.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.page-btn[data-page]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('prevPage').disabled = btn.dataset.page === '1';
        document.getElementById('nextPage').disabled = btn.dataset.page === '3';
    });
});

// Init
render();

// Re-render cards when language changes
if (typeof i18nHooks !== 'undefined') {
    i18nHooks.push(() => {
        render();
        renderChips();
    });
}