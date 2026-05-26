    /* ── Sidebar nav ───────────────────────────────────── */
    function setActive(el) {
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      el.classList.add('active');
    }
	
async function loadDashboard() {
  const res  = await fetch('/api/dashboard/me', { credentials: 'include' });
  if (res.status === 401) { location.href = 'login.html'; return; }
  const data = await res.json();

  // KPIs
  document.querySelector('[data-kpi="comentarios"]').textContent = data.kpis.comments;
  document.querySelector('[data-kpi="favoritos"]').textContent   = data.kpis.favorites;
  document.querySelector('[data-kpi="siguiendo"]').textContent   = data.kpis.following;
  document.querySelector('[data-kpi="eventos"]').textContent     = data.kpis.saved_events;

  // Greeting
  document.querySelector('.welcome-greeting em').textContent = data.user.username;

  // Actividad reciente, comentarios, favoritos, recomendaciones
  // → regenerar cada widget con sus datos
}

loadDashboard();