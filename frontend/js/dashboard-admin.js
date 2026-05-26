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

/* ── User data ─────────────────────────────────────── */
let USERS = [
  { id:1, handle:'@user_1', email:'maria@gmail.com',      rol:'Suscriptor',    estado:'Activo',     registered:'2024', months:3,  color:'#1e3a6e' },
  { id:2, handle:'@user_2', email:'carlos@gmail.com',     rol:'Colaborador',   estado:'Activo',     registered:'2023', months:4,  color:'#6e1e3a' },
  { id:3, handle:'@user_3', email:'redactora@gmail.com',  rol:'Redactor',      estado:'Activo',     registered:'2022', months:5,  color:'#1e6e3a' },
  { id:4, handle:'@user_4', email:'spammer@x.com',        rol:'Suscriptor',    estado:'Suspendido', registered:'2024', months:6,  color:'#6e3a1e' },
  { id:5, handle:'@user_5', email:'admin@gmail.com',      rol:'Administrador', estado:'Activo',     registered:'2023', months:7,  color:'#D97757' },
  { id:6, handle:'@user_6', email:'lucia@gmail.com',      rol:'Suscriptor',    estado:'Activo',     registered:'2022', months:8,  color:'#3a6e6e' },
  { id:7, handle:'@user_7', email:'jorge@gmail.com',      rol:'Redactor',      estado:'Activo',     registered:'2023', months:9,  color:'#5a3a8a' },
  { id:8, handle:'@user_8', email:'ana@gmail.com',        rol:'Suscriptor',    estado:'Activo',     registered:'2024', months:2,  color:'#8a3a5a' },
  { id:9, handle:'@user_9', email:'pablo@gmail.com',      rol:'Colaborador',   estado:'Suspendido', registered:'2022', months:11, color:'#3a8a5a' },
  { id:10,handle:'@user_10',email:'sara@gmail.com',       rol:'Suscriptor',    estado:'Activo',     registered:'2024', months:1,  color:'#5a8a3a' },
  { id:11,handle:'@user_11',email:'miguel@gmail.com',     rol:'Suscriptor',    estado:'Activo',     registered:'2023', months:6,  color:'#3a5a8a' },
  { id:12,handle:'@user_12',email:'elena@gmail.com',      rol:'Redactor',      estado:'Activo',     registered:'2022', months:14, color:'#8a5a3a' },
];

/* ── State ─────────────────────────────────────────── */
let currentPage = 1;
const PER_PAGE  = 6;
let editingId   = null;

/* ── Helpers ───────────────────────────────────────── */
function rolClass(rol) {
  return rol.toLowerCase().replace('ó','o');
}
function initials(handle) {
  return handle.replace('@','').slice(0,2).toUpperCase();
}
function adminCount() {
  return USERS.filter(u => u.rol === 'Administrador' && u.estado === 'Activo').length;
}
function updateKPIs() {
  document.getElementById('suspendedCount').textContent =
    USERS.filter(u => u.estado === 'Suspendido').length;
}

/* ── Filter & render ───────────────────────────────── */
function getFiltered() {
  const q      = document.getElementById('tableSearch').value.toLowerCase().trim();
  const rolF   = document.getElementById('filterRol').value;
  const estF   = document.getElementById('filterEstado').value;
  return USERS.filter(u => {
    if (q && !u.handle.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    if (rolF && u.rol !== rolF) return false;
    if (estF && u.estado !== estF) return false;
    return true;
  });
}

function renderTable() {
  const filtered = getFiltered();
  const total    = filtered.length;
  const pages    = Math.max(1, Math.ceil(total / PER_PAGE));
  if (currentPage > pages) currentPage = pages;

  const slice = filtered.slice((currentPage-1)*PER_PAGE, currentPage*PER_PAGE);
  const tbody = document.getElementById('tableBody');
  const empty = document.getElementById('tableEmpty');

  if (slice.length === 0) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    tbody.innerHTML = slice.map(u => `
      <tr>
        <td>
          <div class="user-cell">
            <div class="user-initials" style="background:${u.color}">${initials(u.handle)}</div>
            <div>
              <div class="user-handle">${u.handle}</div>
              <div class="user-email">${u.email}</div>
            </div>
          </div>
        </td>
        <td><span class="role-pill ${rolClass(u.rol)}">${u.rol}</span></td>
        <td>
          <span class="status-badge ${u.estado.toLowerCase()}">
            <span class="status-dot"></span>${u.estado}
          </span>
        </td>
        <td>${u.registered} · ${u.months} meses</td>
        <td>
          <div class="action-btns">
            <button class="btn-edit" onclick="openModal('edit',${u.id})">Editar</button>
            ${u.estado === 'Activo'
              ? `<button class="btn-suspend" onclick="toggleSuspend(${u.id})">Suspender</button>`
              : `<button class="btn-restore" onclick="toggleSuspend(${u.id})">Reactivar</button>`
            }
          </div>
        </td>
      </tr>
    `).join('');
  }

  renderPagination(pages);
}

function renderPagination(pages) {
  const pag = document.getElementById('pagination');
  if (pages <= 1) { pag.innerHTML = ''; return; }

  let html = `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>←</button>`;
  for (let i=1; i<=pages; i++) {
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''}>→</button>`;
  pag.innerHTML = html;
}

window.goPage = function(p) {
  const pages = Math.ceil(getFiltered().length / PER_PAGE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
}

/* ── Filters ───────────────────────────────────────── */
let searchTimeout;
document.getElementById('tableSearch').addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => { currentPage = 1; renderTable(); }, 200);
});
document.getElementById('filterRol').addEventListener('change', () => { currentPage = 1; renderTable(); });
document.getElementById('filterEstado').addEventListener('change', () => { currentPage = 1; renderTable(); });

/* ── Toggle suspend ────────────────────────────────── */
window.toggleSuspend = function(id) {
  const u = USERS.find(u => u.id === id);
  if (!u) return;

  /* CU-05 flujo alternativo: no suspender al único admin */
  if (u.rol === 'Administrador' && u.estado === 'Activo' && adminCount() <= 1) {
    showToast('⚠️ No puedes suspender al único administrador del sistema.');
    return;
  }
  u.estado = u.estado === 'Activo' ? 'Suspendido' : 'Activo';
  updateKPIs();
  renderTable();
  showToast(u.estado === 'Activo' ? `${u.handle} reactivado` : `${u.handle} suspendido`);
}

/* ── Modal ─────────────────────────────────────────── */
window.openModal = function(mode, id) {
  const overlay = document.getElementById('modalOverlay');
  const modal   = document.getElementById('modal');
  const warn    = document.getElementById('lastAdminWarn');
  const btnDel  = document.getElementById('btnDelete');

  overlay.classList.add('open');
  // Use rAF to trigger transition after display
  requestAnimationFrame(() => modal.classList.add('open'));

  if (mode === 'create') {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Nuevo usuario';
    document.getElementById('mUsername').value = '';
    document.getElementById('mEmail').value    = '';
    document.getElementById('mRol').value      = 'Suscriptor';
    document.getElementById('mEstado').value   = 'Activo';
    btnDel.style.display = 'none';
    warn.style.display   = 'none';
  } else {
    const u = USERS.find(u => u.id === id);
    if (!u) return;
    editingId = id;
    document.getElementById('modalTitle').textContent = `Editar · ${u.handle}`;
    document.getElementById('mUsername').value = u.handle;
    document.getElementById('mEmail').value    = u.email;
    document.getElementById('mRol').value      = u.rol;
    document.getElementById('mEstado').value   = u.estado;
    btnDel.style.display = '';

    /* Warn if last admin */
    const isLastAdmin = u.rol === 'Administrador' && adminCount() <= 1;
    warn.style.display = isLastAdmin ? 'block' : 'none';
  }
}

window.closeModal = function() {
  const modal   = document.getElementById('modal');
  const overlay = document.getElementById('modalOverlay');
  modal.classList.remove('open');
  overlay.classList.remove('open');
}

window.saveUser = function() {
  const handle = document.getElementById('mUsername').value.trim();
  const email  = document.getElementById('mEmail').value.trim();
  const rol    = document.getElementById('mRol').value;
  const estado = document.getElementById('mEstado').value;

  if (!handle || !email) {
    showToast('⚠️ Rellena todos los campos.');
    return;
  }

  if (editingId) {
    const u = USERS.find(u => u.id === editingId);
    /* CU-05: bloquear degradación del único admin */
    if (u.rol === 'Administrador' && rol !== 'Administrador' && adminCount() <= 1) {
      showToast('⚠️ No puedes cambiar el rol del único administrador.');
      return;
    }
    u.handle = handle;
    u.email  = email;
    u.rol    = rol;
    u.estado = estado;
    showToast(`${handle} actualizado correctamente`);
  } else {
    USERS.push({
      id: Date.now(), handle, email, rol, estado,
      registered: new Date().getFullYear().toString(),
      months: 0, color: '#' + Math.floor(Math.random()*0xAAAAAA+0x333333).toString(16)
    });
    showToast(`${handle} creado correctamente`);
  }

  updateKPIs();
  renderTable();
  closeModal();
}

window.deleteUser = function() {
  const u = USERS.find(u => u.id === editingId);
  if (!u) return;

  /* CU-05: bloquear borrado del último admin */
  if (u.rol === 'Administrador' && adminCount() <= 1) {
    showToast('⚠️ No puedes eliminar al único administrador del sistema.');
    return;
  }
  USERS = USERS.filter(u => u.id !== editingId);
  updateKPIs();
  renderTable();
  closeModal();
  showToast(`${u.handle} eliminado`);
}

/* ── Export CSV (simulated) ────────────────────────── */
window.exportCSV = function() {
  const rows = ['Usuario,Email,Rol,Estado,Registrado',
    ...getFiltered().map(u => `${u.handle},${u.email},${u.rol},${u.estado},${u.registered}`)
  ].join('\n');
  const blob = new Blob([rows], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'usuarios-gamehub.csv';
  a.click();
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

/* ── Close modal on overlay click ─────────────────── */
document.getElementById('modalOverlay').addEventListener('click', closeModal);

/* ── Init ──────────────────────────────────────────── */
updateKPIs();
renderTable();
