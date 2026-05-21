/* ── State ─────────────────────────────────────────── */
let activeFilter = 'all';
let searchQuery  = '';

/* ── Render ─────────────────────────────────────────── */
function renderPosts() {
  const cards    = document.querySelectorAll('.post-card[data-cat]');
  const noRes    = document.getElementById('noResults');
  const countEl  = document.getElementById('postsCount');
  const lang     = typeof currentLang !== 'undefined' ? currentLang : 'es';

  let visible = 0;
  cards.forEach(card => {
    const catMatch    = activeFilter === 'all' || card.dataset.cat === activeFilter;
    const titleEl     = card.querySelector('.post-card-title');
    const excerptEl   = card.querySelector('.post-card-excerpt');
    const text        = ((titleEl?.textContent || '') + ' ' + (excerptEl?.textContent || '')).toLowerCase();
    const searchMatch = !searchQuery || text.includes(searchQuery);
    const show        = catMatch && searchMatch;
    card.classList.toggle('visible', show);
    if (show) visible++;
  });

  noRes.classList.toggle('visible', visible === 0);

  const countStr = lang === 'es'
    ? `${visible} artículo${visible !== 1 ? 's' : ''}`
    : `${visible} article${visible !== 1 ? 's' : ''}`;
  countEl.textContent = countStr;
}

/* ── Filters ───────────────────────────────────────── */
document.querySelectorAll('.blog-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    renderPosts();
  });
});

/* ── Search ────────────────────────────────────────── */
let searchTimeout;
document.getElementById('blogSearch').addEventListener('input', e => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderPosts();
  }, 220);
});

/* ── Load more (simulated) ─────────────────────────── */
document.getElementById('btnLoadMore').addEventListener('click', function() {
  this.textContent = typeof t !== 'undefined' ? t('blog.loading') : 'Cargando...';
  this.disabled = true;
  setTimeout(() => {
    this.textContent = typeof t !== 'undefined' ? t('blog.no_more') : 'No hay más artículos';
  }, 800);
});

/* ── i18n hook ─────────────────────────────────────── */
if (typeof i18nHooks !== 'undefined') {
  i18nHooks.push(() => renderPosts());
}

/* ── Init ──────────────────────────────────────────── */
renderPosts();
