    /* ── Category filter ───────────────────────────────── */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.news-card[data-cat]');
    const noResults  = document.getElementById('noResults');
    const countEl    = document.getElementById('resultCount');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.cat;
        let visible = 0;

        cards.forEach((card, i) => {
          const match = cat === 'todas' || card.dataset.cat === cat;
          card.classList.toggle('visible', match);
          if (match) {
            card.style.animationDelay = (visible * 0.06) + 's';
            // re-trigger animation
            card.classList.remove('reveal');
            void card.offsetWidth;
            card.classList.add('reveal');
            visible++;
          }
        });

        noResults.classList.toggle('visible', visible === 0);
        countEl.textContent = visible === 0
          ? 'Sin resultados'
          : `${visible} artículo${visible !== 1 ? 's' : ''}`;
      });
    });

    /* ── Load more (simulated) ─────────────────────────── */
    let page = 1;
    document.getElementById('btnLoadMore').addEventListener('click', function() {
      this.textContent = 'Cargando...';
      this.disabled = true;
      setTimeout(() => {
        // In production: fetch next page from backend and append cards
        this.textContent = 'No hay más noticias';
        // this.disabled stays true — no more pages in demo
      }, 800);
    });