/* ── Sidebar active + panel switching ──────────────── */
window.setActive = function(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  const panelId = el.dataset.panel;
  if (!panelId) return;
  document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
  const target = document.getElementById('panel-' + panelId);
  if (target) target.style.display = 'block';
};

/* ── Load dashboard data ───────────────────────────── */
async function loadDashboard() {
  const res = await fetch('/api/dashboard/me', { credentials: 'include' });

  if (res.status === 401) {
    window.location.href = 'login.html';
    return;
  }

  const data = await res.json();
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'es';

  /* ── User info ─────────────────────────────────── */
  const username   = data.user?.username || '—';
  const initials   = username.slice(0, 2).toUpperCase();
  const roleLabel  = lang === 'es' ? 'Suscriptor' : 'Subscriber';

  // Greeting
  const greetingEm = document.querySelector('.welcome-greeting em');
  if (greetingEm) greetingEm.textContent = username;

  // Topbar avatar
  const avatar = document.querySelector('.user-avatar');
  if (avatar) { avatar.textContent = initials; avatar.title = username; }

  // Sidebar user card
  const sidebarName = document.querySelector('.sidebar-user-name');
  const sidebarRole = document.querySelector('.sidebar-user-role');
  const sidebarAvatar = document.querySelector('.sidebar-avatar');
  if (sidebarName)   sidebarName.textContent   = username;
  if (sidebarRole)   sidebarRole.textContent   = `● ${roleLabel}`;
  if (sidebarAvatar) sidebarAvatar.textContent = initials;

  // Role badge in topbar
  const roleBadge = document.querySelector('.role-badge');
  if (roleBadge) {
    roleBadge.innerHTML = `<span class="role-dot"></span>${roleLabel}`;
  }

  /* ── KPIs ──────────────────────────────────────── */
  const kpis = data.kpis || {};
  document.querySelectorAll('[data-kpi]').forEach(el => {
    const key = el.dataset.kpi;
    const map = {
      comentarios: kpis.comments,
      favoritos:   kpis.favorites,
      siguiendo:   kpis.following,
      eventos:     kpis.saved_events,
    };
    if (map[key] !== undefined) el.textContent = map[key];
  });

  /* ── Activity feed ─────────────────────────────── */
  const activityBody = document.querySelector('.widget-body');
  if (activityBody && data.recent_activity?.length) {
    const COLORS = ['#3a6eb0','#b03a6e','#3ab06e','#b06e3a'];
    activityBody.innerHTML = data.recent_activity.map((item, i) => {
      const initials = item.author.slice(0, 2).toUpperCase();
      const timeStr  = formatRelativeTime(item.created_at, lang);
      const action   = lang === 'es' ? 'publicó una noticia' : 'published a news article';
      return `
        <div class="activity-item">
          <div class="activity-avatar" style="background:${COLORS[i % COLORS.length]}">${initials}</div>
          <div class="activity-info">
            <div class="activity-text"><strong>${item.author}</strong> ${action}</div>
            <div class="activity-time">${timeStr}</div>
          </div>
          <div class="activity-dot${i > 1 ? ' read' : ''}"></div>
        </div>`;
    }).join('');
  }

  /* ── Last comments ─────────────────────────────── */
  const commentWidgets = document.querySelectorAll('.widget-body');
  const commentBody = commentWidgets[1]; // second widget
  if (commentBody && data.last_comments?.length) {
    commentBody.innerHTML = data.last_comments.map(c => {
      const timeStr = formatRelativeTime(c.created_at, lang);
      const inLabel = lang === 'es' ? 'en' : 'in';
      return `
        <div class="comment-item">
          <div class="comment-where">${inLabel} <a href="post.html?id=${c.post_id}">"${c.post_title}"</a> · ${timeStr}</div>
          <div class="comment-text">${c.text}</div>
        </div>`;
    }).join('');
  }

  /* ── Favorites ─────────────────────────────────── */
  const favsGrid = document.querySelector('.favorites-grid');
  if (favsGrid && data.favorites?.length) {
    const BG = ['fc1','fc2','fc3','fc4'];
    favsGrid.innerHTML = data.favorites.map((g, i) => `
      <div class="fav-card" onclick="location.href='juego.html?id=${g.id}'">
        <div class="fav-cover">
          <div class="fav-cover-bg ${BG[i % BG.length]}"></div>
          <div class="fav-name">${g.title}</div>
        </div>
      </div>`).join('');
  }

  /* ── Recommendations ───────────────────────────── */
  const recoGrid = document.querySelector('.reco-grid');
  if (recoGrid && data.recommendations?.length) {
    const BG = ['rc1','rc2','rc3'];
    const scoreLabel = lang === 'es' ? 'comunidad' : 'community';
    recoGrid.innerHTML = data.recommendations.map((g, i) => `
      <div class="reco-card" onclick="location.href='juego.html?id=${g.id}'">
        <div class="reco-cover"><div class="reco-cover-bg ${BG[i % BG.length]}"></div></div>
        <div class="reco-body">
          <div class="reco-name">${g.title}</div>
          <div class="reco-score">★ ${(g.community_score ?? 0).toFixed(1)} ${scoreLabel}</div>
        </div>
      </div>`).join('');
  }
}

/* ── Relative time helper ──────────────────────────── */
function formatRelativeTime(isoStr, lang = 'es') {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);

  if (lang === 'es') {
    if (mins  < 60)  return `hace ${mins}min`;
    if (hours < 24)  return `hace ${hours}h`;
    return `hace ${days}d`;
  } else {
    if (mins  < 60)  return `${mins}min ago`;
    if (hours < 24)  return `${hours}h ago`;
    return `${days}d ago`;
  }
}

/* ── Sidebar nav active ────────────────────────────── */
function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

/* ── Init ──────────────────────────────────────────── */
loadDashboard();
