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

/* ── Data ──────────────────────────────────────────── */
let QUEUE = [
  { id:1, title:'Titular noticia 1', cat:'Industria', read:'4 min lectura', status:'Programada', date:'12 jun · 09:00', thumb:'qt1' },
  { id:2, title:'Titular noticia 2', cat:'Industria', read:'4 min lectura', status:'Borrador',   date:'',             thumb:'qt2' },
  { id:3, title:'Titular noticia 3', cat:'Industria', read:'4 min lectura', status:'Publicada',  date:'5 jun · 14:30',thumb:'qt3' },
  { id:4, title:'Titular noticia 4', cat:'Industria', read:'4 min lectura', status:'Borrador',   date:'',             thumb:'qt4' },
  { id:5, title:'Titular noticia 5', cat:'Industria', read:'4 min lectura', status:'Publicada',  date:'4 jun',        thumb:'qt5' },
];

let REVIEWS = [
  { id:1, author:'@colab_1', title:'Borrador pendiente 1' },
  { id:2, author:'@colab_2', title:'Borrador pendiente 2' },
  { id:3, author:'@colab_3', title:'Borrador pendiente 3' },
];

/* ── State ─────────────────────────────────────────── */
let editingId   = null;
let modalMode   = 'new'; // 'new' | 'schedule' | 'edit'

/* ── KPI update ────────────────────────────────────── */
function updateKPIs() {
  document.getElementById('kpiBorradores').textContent =
    QUEUE.filter(a => a.status === 'Borrador').length;
  document.getElementById('kpiRevision').textContent  = REVIEWS.length;
  document.getElementById('kpiPublicadas').textContent =
    48 + QUEUE.filter(a => a.status === 'Publicada').length - 3; // base 48 minus the 3 already counted
  document.getElementById('badgeRevision').textContent = REVIEWS.length;
  document.getElementById('reviewCount').textContent   =
    REVIEWS.length > 0 ? `${REVIEWS.length} pendientes` : '';
}

/* ── Status class ──────────────────────────────────── */
function statusClass(s) {
  return s.toLowerCase().replace(/\s+/g,'-').replace('ó','o');
}

/* ── Render queue ──────────────────────────────────── */
function renderQueue() {
  const list = document.getElementById('queueList');
  list.innerHTML = QUEUE.map(a => `
    <div class="queue-item">
      <div class="queue-thumb"><div class="queue-thumb-bg ${a.thumb}"></div></div>
      <div class="queue-info">
        <div class="queue-title">${a.title}</div>
        <div class="queue-meta">${a.cat} · ${a.read}</div>
      </div>
      <div class="queue-right">
        <span class="queue-status ${statusClass(a.status)}">${a.status}</span>
        ${a.date ? `<span class="queue-date">${a.date}</span>` : ''}
      </div>
      <div class="queue-actions">
        <button class="btn-q" onclick="openModal(${a.id},'edit')">Editar</button>
        ${a.status === 'Borrador'
          ? `<button class="btn-q publish" onclick="publishNow(${a.id})">Publicar</button>`
          : ''}
        <button class="btn-q del" onclick="deleteArticle(${a.id})">✕</button>
      </div>
    </div>
  `).join('');
}

/* ── Render review queue ───────────────────────────── */
function renderReviews() {
  const list  = document.getElementById('reviewList');
  const empty = document.getElementById('reviewEmpty');
  if (REVIEWS.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    list.innerHTML = REVIEWS.map(r => `
      <div class="review-item" id="rev-${r.id}">
        <div class="review-from">de <span>${r.author}</span></div>
        <div class="review-title">${r.title}</div>
        <div class="review-actions">
          <button class="btn-approve" onclick="approveReview(${r.id})">Aprobar</button>
          <button class="btn-reject"  onclick="rejectReview(${r.id})">Rechazar</button>
        </div>
      </div>
    `).join('');
  }
}

/* ── CU-03: publish directly ───────────────────────── */
window.publishNow = function(id) {
  const a = QUEUE.find(a => a.id === id);
  if (!a) return;
  a.status = 'Publicada';
  a.date   = new Date().toLocaleDateString('es-ES', { day:'numeric', month:'short' });
  updateKPIs();
  renderQueue();
  showToast(`"${a.title}" publicada`);
}

/* ── Delete from queue ─────────────────────────────── */
window.deleteArticle = function(id) {
  const a = QUEUE.find(a => a.id === id);
  if (!a) return;
  QUEUE = QUEUE.filter(a => a.id !== id);
  updateKPIs();
  renderQueue();
  showToast(`"${a.title}" eliminada`);
}

/* ── Approve collaborator article ──────────────────── */
window.approveReview = function(id) {
  const r = REVIEWS.find(r => r.id === id);
  if (!r) return;
  /* Redactor can publish directly — CU-03 */
  QUEUE.push({
    id: Date.now(), title: r.title, cat: 'Industria',
    read: '4 min lectura', status: 'Publicada',
    date: new Date().toLocaleDateString('es-ES', { day:'numeric', month:'short' }),
    thumb: 'qt1'
  });
  REVIEWS = REVIEWS.filter(r => r.id !== id);
  updateKPIs();
  renderQueue();
  renderReviews();
  showToast(`"${r.title}" aprobada y publicada`);
}

/* ── Reject collaborator article ───────────────────── */
window.rejectReview = function(id) {
  const r = REVIEWS.find(r => r.id === id);
  if (!r) return;
  REVIEWS = REVIEWS.filter(r => r.id !== id);
  updateKPIs();
  renderReviews();
  showToast(`"${r.title}" rechazada — se notificará al colaborador`);
}

/* ── Modal ─────────────────────────────────────────── */
window.openModal = function(id, mode) {
  modalMode = mode || 'new';
  editingId = id;

  const overlay      = document.getElementById('modalOverlay');
  const modal        = document.getElementById('modal');
  const scheduleGrp  = document.getElementById('scheduleGroup');
  const btnSchedule  = document.getElementById('btnSchedule');
  const btnPublish   = document.getElementById('btnPublish');

  overlay.classList.add('open');
  requestAnimationFrame(() => modal.classList.add('open'));

  /* Toggle schedule field */
  const isSchedule = mode === 'schedule';
  scheduleGrp.style.display = isSchedule ? '' : 'none';
  btnSchedule.style.display  = isSchedule ? '' : 'none';
  btnPublish.style.display   = isSchedule ? 'none' : '';

  if (id && mode === 'edit') {
    const a = QUEUE.find(a => a.id === id);
    if (!a) return;
    document.getElementById('modalTitle').textContent = 'Editar noticia';
    document.getElementById('mTitle').value = a.title;
    document.getElementById('mCat').value   = a.cat;
  } else {
    document.getElementById('modalTitle').textContent = isSchedule ? 'Programar publicación' : 'Nueva noticia';
    document.getElementById('mTitle').value = '';
    document.getElementById('mCat').value   = 'Industria';
    document.getElementById('mContent').value = '';
  }
}

window.closeModal = function() {
  document.getElementById('modal').classList.remove('open');
  document.getElementById('modalOverlay').classList.remove('open');
}

/* ── Save / publish ────────────────────────────────── */
window.saveArticle = function(status) {
  const title = document.getElementById('mTitle').value.trim();
  const cat   = document.getElementById('mCat').value;
  const read  = document.getElementById('mRead').value;

  if (!title) { showToast('⚠️ El titular no puede estar vacío.'); return; }

  let date = '';
  if (status === 'Programada') {
    const rawDate = document.getElementById('mSchedule').value;
    if (!rawDate) { showToast('⚠️ Selecciona fecha y hora de publicación.'); return; }
    const d = new Date(rawDate);
    date = d.toLocaleDateString('es-ES', { day:'numeric', month:'short' })
         + ' · ' + d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
  } else if (status === 'Publicada') {
    date = new Date().toLocaleDateString('es-ES', { day:'numeric', month:'short' });
  }

  if (editingId && modalMode === 'edit') {
    const a = QUEUE.find(a => a.id === editingId);
    a.title  = title;
    a.cat    = cat;
    a.read   = read;
    a.status = status;
    a.date   = date;
  } else {
    const thumbs = ['qt1','qt2','qt3','qt4','qt5'];
    QUEUE.unshift({
      id: Date.now(), title, cat, read, status, date,
      thumb: thumbs[Math.floor(Math.random() * thumbs.length)]
    });
  }

  updateKPIs();
  renderQueue();
  closeModal();

  const msgs = { Borrador:'Borrador guardado', Publicada:`"${title}" publicada`, Programada:`"${title}" programada` };
  showToast(msgs[status] || 'Guardado');
}

/* ── Toast ─────────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

document.getElementById('modalOverlay').addEventListener('click', closeModal);

/* ── Init ──────────────────────────────────────────── */
updateKPIs();
renderQueue();
renderReviews();
