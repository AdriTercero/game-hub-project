/* ── Auth state simulation ─────────────────────────
   En producción esto lo gestiona el backend.
   Cambia data-logged a "true" en el HTML para ver
   el formulario de comentario activo.
─────────────────────────────────────────────────── */
const formWrap = document.getElementById('commentFormWrap');
const isLogged = formWrap?.getAttribute('data-logged') === 'true';

if (isLogged) {
  document.getElementById('commentCta').style.display = 'none';
  document.getElementById('commentForm').style.display = 'block';
}

/* ── Submit comment (simulated) ────────────────────── */
const submitBtn = document.getElementById('commentSubmit');
if (submitBtn) {
  submitBtn.addEventListener('click', () => {
    const input = document.getElementById('commentInput');
    const text  = input?.value.trim();
    if (!text) return;

    const list = document.getElementById('commentsList');
    const newComment = document.createElement('div');
    newComment.className = 'comment-item';
    newComment.innerHTML = `
      <div class="comment-avatar" style="background:#D97757">MG</div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-author">María García</span>
          <span class="comment-date">${typeof t !== 'undefined' ? t('post.comments.just_now') : 'ahora mismo'}</span>
        </div>
        <p class="comment-text">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
        <div class="comment-actions">
          <button class="comment-like" data-liked="false" onclick="toggleLike(this)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
            <span>0</span>
          </button>
        </div>
      </div>
    `;
    list.insertAdjacentElement('afterbegin', newComment);
    input.value = '';

    // Update count
    const countEl = document.querySelector('.comments-count');
    if (countEl) countEl.textContent = String(parseInt(countEl.textContent || '0') + 1);
  });
}

/* ── Like toggle ───────────────────────────────────── */
function toggleLike(btn) {
  const liked    = btn.getAttribute('data-liked') === 'true';
  const countEl  = btn.querySelector('span');
  const current  = parseInt(countEl.textContent) || 0;

  btn.setAttribute('data-liked', !liked);
  btn.classList.toggle('liked', !liked);
  countEl.textContent = liked ? current - 1 : current + 1;
}

/* ── Share button fallback ─────────────────────────── */
document.querySelectorAll('.share-btn-social').forEach(btn => {
  btn.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url: location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(location.href).catch(() => {});
      const span = btn.querySelector('span');
      const orig = span.textContent;
      span.textContent = typeof t !== 'undefined' ? t('post.share.copied') : '✓ Copiado';
      setTimeout(() => { span.textContent = orig; }, 1800);
    }
  });
});

/* ── i18n hook ─────────────────────────────────────── */
if (typeof i18nHooks !== 'undefined') {
  i18nHooks.push(() => {
    // Update placeholder of textarea
    const ta = document.getElementById('commentInput');
    if (ta) ta.placeholder = typeof t !== 'undefined'
      ? t('post.comments.placeholder')
      : 'Escribe tu comentario…';
  });
}
