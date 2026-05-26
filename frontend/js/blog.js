/* ── State ─────────────────────────────────────────── */
let activeFilter = 'all';
let searchQuery  = '';
let currentPage  = 1;
let allPosts     = [];

/* ── Fetch ─────────────────────────────────────────── */
async function fetchPosts(cat, page = 1) {
  const params = new URLSearchParams({ page });
  if (cat && cat !== 'all') params.set('category', cat);
  const res  = await fetch('/api/posts?' + params);
  const data = await res.json();
  return data; // { posts: [], total: int, page: int }
}

/* ── Render cards ──────────────────────────────────── */
const BG_CLASSES = ['pc1', 'pc2', 'pc3', 'pc4', 'pc5'];

function renderCards(posts, append = false) {
  const grid  = document.getElementById('postsGrid');
  const noRes = document.getElementById('noResults');
  const countEl = document.getElementById('postsCount');
  const lang  = typeof currentLang !== 'undefined' ? currentLang : 'es';

  if (!append) {
    grid.querySelectorAll('.post-card').forEach(c => c.remove());
  }

  // Client-side search filter
  const filtered = posts.filter(p => {
    if (!searchQuery) return true;
    const text = ((p.title || '') + ' ' + (p.excerpt || '')).toLowerCase();
    return text.includes(searchQuery);
  });

  filtered.forEach((post, i) => {
    const card = document.createElement('article');
    card.className = 'post-card visible';
    card.dataset.cat = post.category;
    card.onclick = () => location.href = `post.html?id=${post.id}`;

    const bg    = BG_CLASSES[i % BG_CLASSES.length];
    const date  = new Date(post.created_at).toLocaleDateString(
      lang === 'es' ? 'es-ES' : 'en-GB',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );

    card.innerHTML = `
      <div class="post-card-img">
        <div class="post-card-bg ${bg}"></div>
      </div>
      <div class="post-card-body">
        <span class="post-cat ${post.category}">${post.category}</span>
        <h3 class="post-card-title">${post.title}</h3>
        <p class="post-card-excerpt">${post.excerpt || ''}</p>
        <div class="post-card-footer">
          <div class="post-author">
            <div class="post-avatar" style="background:#D97757">
              ${post.author ? post.author.slice(0,2).toUpperCase() : '??'}
            </div>
            <span class="post-author-name">${post.author || '—'}</span>
          </div>
          <div class="post-meta-sm">
            <span>${date}</span>
            <span>💬 ${post.comment_count ?? 0}</span>
          </div>
        </div>
      </div>`;

    grid.insertBefore(card, document.getElementById('noResults'));
  });

  noRes.classList.toggle('visible', filtered.length === 0 && !append);

  const total = append ? allPosts.length : filtered.length;
  const countStr = lang === 'es'
    ? `${total} artículo${total !== 1 ? 's' : ''}`
    : `${total} article${total !== 1 ? 's' : ''}`;
  countEl.textContent = countStr;
}

async function loadPosts(cat, page = 1, append = false) {
  const data = await fetchPosts(cat, page);

  if (append) {
    allPosts = allPosts.concat(data.posts);
  } else {
    allPosts = data.posts;
  }

  currentPage = page;
  renderCards(allPosts, append);

  // Load more button
  const btn    = document.getElementById('btnLoadMore');
  const loaded = allPosts.length;
  const hasMore = loaded < data.total;
  btn.disabled    = !hasMore;
  btn.textContent = hasMore
    ? (typeof t !== 'undefined' ? t('blog.load_more') : 'Cargar más artículos')
    : (typeof t !== 'undefined' ? t('blog.no_more')   : 'No hay más artículos');
}

/* ── Filters ───────────────────────────────────────── */
document.querySelectorAll('.blog-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.blog-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    searchQuery  = '';
    document.getElementById('blogSearch').value = '';
    loadPosts(activeFilter, 1, false);
  });
});

/* ── Search (client-side over loaded posts) ────────── */
let searchTimeout;
document.getElementById('blogSearch').addEventListener('input', e => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value.toLowerCase().trim();
    renderCards(allPosts, false);
  }, 220);
});

/* ── Load more ─────────────────────────────────────── */
document.getElementById('btnLoadMore').addEventListener('click', () => {
  loadPosts(activeFilter, currentPage + 1, true);
});

/* ── i18n hook ─────────────────────────────────────── */
if (typeof i18nHooks !== 'undefined') {
  i18nHooks.push(() => renderCards(allPosts, false));
}

/* ── Init ──────────────────────────────────────────── */
loadPosts('all', 1, false);