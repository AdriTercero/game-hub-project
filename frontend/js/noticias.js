    /* ── Category filter ───────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const noResults = document.getElementById('noResults');
    const countEl = document.getElementById('resultCount');

    let currentCat = 'todas';
    let currentPage = 1;

    /* Get news */
    async function fetchNews(cat, page = 1) {
        const params = new URLSearchParams({
            page
        });
        if (cat && cat !== 'todas') params.set('category', cat);
        const res = await fetch('/api/news?' + params);
        const data = await res.json();
        return data; // { news: [], total: int, page: int }
    }

    function renderCards(newsList) {
        const grid = document.getElementById('newsGrid');
        // Elimina las cards existentes pero mantén el #noResults
        grid.querySelectorAll('.news-card').forEach(c => c.remove());

        newsList.forEach((news, i) => {
            const card = document.createElement('article');
            card.className = 'news-card visible reveal';
            card.style.animationDelay = (i * 0.06) + 's';
            card.dataset.cat = news.category;
            card.onclick = () => location.href = `noticia.html?id=${news.id}`;
            card.innerHTML = `
      <div class="news-img"><div class="news-img-bg ni1"></div></div>
      <div class="news-body">
        <div class="news-meta">
          <span class="news-cat">${news.category}</span>
          <span class="news-time">${new Date(news.created_at).toLocaleDateString()}</span>
        </div>
        <div class="news-title">${news.title}</div>
        <div class="news-footer">
          <span class="news-author">por ${news.author}</span>
        </div>
      </div>`;
            grid.insertBefore(card, document.getElementById('noResults'));
        });

        noResults.classList.toggle('visible', newsList.length === 0);
        countEl.textContent = `${newsList.length} artículo${newsList.length !== 1 ? 's' : ''}`;
    }

    async function loadNews(cat, page = 1) {
        const data = await fetchNews(cat, page);
        renderCards(data.news);
        currentPage = page;

        // Load more button: ocultar si no hay más páginas
        const btn = document.getElementById('btnLoadMore');
        const loaded = (page - 1) * 10 + data.news.length;
        btn.disabled = loaded >= data.total;
        btn.textContent = loaded >= data.total ?
            (typeof t !== 'undefined' ? t('noticias.no_more') : 'No hay más noticias') :
            (typeof t !== 'undefined' ? t('noticias.load_more') : 'Cargar más noticias');
    }

    /* ── Category filter ─────────────────────────────── */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCat = btn.dataset.cat;
            loadNews(currentCat, 1);
        });
    });

    /* ── Load more ───────────────────────────────────── */
    document.getElementById('btnLoadMore').addEventListener('click', () => {
        loadNews(currentCat, currentPage + 1);
    });

    /* ── Init ────────────────────────────────────────── */
    loadNews('todas', 1);