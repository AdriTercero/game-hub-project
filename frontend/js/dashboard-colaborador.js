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

/* ── Article data ──────────────────────────────────── */
let ARTICLES = [
  { id:1, title:'Mi artículo número 1', status:'Borrador',    cat:'Industria', edited:'hace 2h' },
  { id:2, title:'Mi artículo número 2', status:'En revisión', cat:'Tech',      edited:'hace 1d' },
  { id:3, title:'Mi artículo número 3', status:'Borrador',    cat:'Reseñas',   edited:'hace 3d' },
  { id:4, title:'Mi artículo número 4', status:'Publicado',   cat:'eSports',   edited:'hace 1 sem' },
  { id:5, title:'Mi artículo número 5', status:'Rechazado',   cat:'Industria', edited:'hace 2 sem' },
];

/* ── State ─────────────────────────────────────────── */
let editingId    = null;
let activeStatus = ''; // '' = all

/* ── KPI counts ────────────────────────────────────── */
function updateKPIs() {
  const counts = { 'Borrador': 0, 'En revisión': 0, 'Publicado': 0, 'Rechazado': 0 };
  ARTICLES.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });

  document.getElementById('kpiBorrador').textContent  = counts['Borrador'];
  document.getElementById('kpiRevision').textContent  = counts['En revisión'];
  document.getElementById('kpiPublicado').textContent = counts['Publicado'];
  document.getElementById('badgeBorrador').textContent = counts['Borrador'];
  document.getElementById('badgePending').textContent  = counts['En revisión'];
}

/* ── KPI tab click ─────────────────────────────────── */
window.setKpiTab = function(el, status) {
  document.querySelectorAll('.kpi-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  activeStatus = status;
  document.getElementById('filterStatus').value = status;
  renderTable();
}

/* ── Sidebar filter shortcut ───────────────────────── */
window.filterByStatus = function(status) {
  activeStatus = status;
  document.getElementById('filterStatus').value = status;
  renderTable();
}

/* ── Filtered list ─────────────────────────────────── */
function getFiltered() {
  const q   = document.getElementById('tableSearch').value.toLowerCase().trim();
  const cat = document.getElementById('filterCat').value;
  const st  = document.getElementById('filterStatus').value;
  return ARTICLES.filter(a => {
    if (q && !a.title.toLowerCase().includes(q)) return false;
    if (cat && a.cat !== cat) return false;
    if (st  && a.status !== st) return false;
    return true;
  });
}

/* ── Status pill class ─────────────────────────────── */
function statusClass(s) {
  return s.toLowerCase().replace(/\s+/g,'-').replace('ó','o');
}

/* ── Render table ──────────────────────────────────── */
function renderTable() {
  const list  = getFiltered();
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('tableEmpty');

  if (list.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = list.map(a => {
    const canSend   = a.status === 'Borrador' || a.status === 'Rechazado';
    const canDelete = a.status === 'Borrador' || a.status === 'Rechazado';
    return `
    <tr>
      <td class="article-title">${a.title}</td>
      <td><span class="status-pill ${statusClass(a.status)}">${a.status}</span></td>
      <td>${a.cat}</td>
      <td>${a.edited}</td>
      <td>
        <div class="action-btns">
          ${canSend
            ? `<button class="btn-edit" onclick="openModal(${a.id})">Editar</button>
               <button class="btn-send" onclick="sendToReview(${a.id})">Enviar</button>`
            : `<button class="btn-edit" onclick="openModal(${a.id})">Ver</button>`
          }
          ${canDelete ? `<button class="btn-delete" onclick="deleteArticle(${a.id})">Eliminar</button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* ── Send to review — collaborator restriction ──────── */
window.sendToReview = function(id) {
  const a = ARTICLES.find(a => a.id === id);
  if (!a) return;
  /* Collaborator cannot publish directly — always goes to review */
  a.status = 'En revisión';
  a.edited = 'ahora';
  updateKPIs();
  renderTable();
  showToast(`"${a.title}" enviado a revisión`);
}

/* ── Delete ────────────────────────────────────────── */
window.deleteArticle = function(id) {
  const a = ARTICLES.find(a => a.id === id);
  if (!a) return;
  ARTICLES = ARTICLES.filter(a => a.id !== id);
  updateKPIs();
  renderTable();
  showToast(`"${a.title}" eliminado`);
}

/* ── Modal ─────────────────────────────────────────── */
window.openModal = function(id) {
  const overlay = document.getElementById('modalOverlay');
  const modal   = document.getElementById('modal');
  overlay.classList.add('open');
  requestAnimationFrame(() => modal.classList.add('open'));

  if (id) {
    const a = ARTICLES.find(a => a.id === id);
    if (!a) return;
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Editar artículo';
    document.getElementById('mTitle').value   = a.title;
    document.getElementById('mCat').value     = a.cat;
    document.getElementById('mContent').value = '';
  } else {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo artículo';
    document.getElementById('mTitle').value   = '';
    document.getElementById('mCat').value     = 'Industria';
    document.getElementById('mContent').value = '';
  }
}

window.closeModal = function() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
}

/* ── Save article ──────────────────────────────────── */
window.saveArticle = function(status) {
  const title = document.getElementById('mTitle').value.trim();
  const cat   = document.getElementById('mCat').value;

  if (!title) { showToast('⚠️ El título no puede estar vacío.'); return; }

  /* Collaborator restriction: can only set Borrador or En revisión */
  if (status !== 'Borrador' && status !== 'En revisión') {
    showToast('⚠️ No puedes publicar directamente como Colaborador.');
    return;
  }

  if (editingId) {
    const a = ARTICLES.find(a => a.id === editingId);
    a.title  = title;
    a.cat    = cat;
    a.status = status;
    a.edited = 'ahora';
    showToast(status === 'Borrador' ? 'Borrador guardado' : `"${title}" enviado a revisión`);
  } else {
    ARTICLES.unshift({ id: Date.now(), title, status, cat, edited: 'ahora' });
    showToast(status === 'Borrador' ? 'Borrador creado' : `"${title}" enviado a revisión`);
  }

  updateKPIs();
  renderTable();
  closeModal();
}

/* ── Filters ───────────────────────────────────────── */
let searchTimeout;
document.getElementById('tableSearch').addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => renderTable(), 200);
});
document.getElementById('filterCat').addEventListener('change', renderTable);
document.getElementById('filterStatus').addEventListener('change', renderTable);

document.getElementById('modalOverlay').addEventListener('click', closeModal);

/* ── Toast ─────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Init ──────────────────────────────────────────── */
updateKPIs();
renderTable();
