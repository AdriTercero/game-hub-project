/* ═══════════════════════════════════════════════════════
   GameHub — Agenda / Calendario
   Datos de eventos: reemplaza con fetch al backend cuando
   esté disponible.
═══════════════════════════════════════════════════════ */

const EVENTS = [
  { id:1,  date:'2026-06-03', name:'Nintendo Direct',         type:'lanzamiento', location:'Online',          desc:'Presentación de los próximos lanzamientos de Nintendo para la segunda mitad de 2026.' },
  { id:2,  date:'2026-06-06', name:'Lanzamiento Juego A',     type:'lanzamiento', location:'Global',           desc:'Salida oficial de Juego A en todas las plataformas.' },
  { id:3,  date:'2026-06-10', name:'Summer Game Fest',        type:'feria',       location:'Los Ángeles, EE.UU.', desc:'Festival anual de videojuegos con anuncios de los principales estudios.' },
  { id:4,  date:'2026-06-12', name:'PC Gaming Show',          type:'convencion',  location:'Los Ángeles, EE.UU.', desc:'Evento dedicado al gaming en PC con novedades de hardware y software.' },
  { id:5,  date:'2026-06-16', name:'Gamelab Barcelona',       type:'feria',       location:'Barcelona, España',  desc:'Congreso internacional de la industria del videojuego en España.' },
  { id:6,  date:'2026-06-20', name:'Lanzamiento Juego B',     type:'lanzamiento', location:'Global',           desc:'Lanzamiento de Juego B exclusivamente en PS5 y PC.' },
  { id:7,  date:'2026-06-24', name:'EVO 2026',                type:'convencion',  location:'Las Vegas, EE.UU.',  desc:'El torneo de lucha más importante del mundo con los mejores competidores.' },
  { id:8,  date:'2026-07-04', name:'Fun & Serious',           type:'feria',       location:'Bilbao, España',     desc:'Festival internacional del videojuego artístico e independiente.' },
  { id:9,  date:'2026-07-10', name:'Lanzamiento Juego C',     type:'lanzamiento', location:'Global',           desc:'Esperado lanzamiento de Juego C, secuela de uno de los juegos más valorados del catálogo.' },
  { id:10, date:'2026-07-15', name:'Gamescom Latam',          type:'feria',       location:'São Paulo, Brasil',  desc:'Edición latinoamericana de la mayor feria de videojuegos de Europa.' },
  { id:11, date:'2026-07-22', name:'IndieGame Summit',        type:'convencion',  location:'Madrid, España',     desc:'Cumbre dedicada al desarrollo independiente de videojuegos.' },
  { id:12, date:'2026-08-05', name:'Gamescom 2026',           type:'feria',       location:'Colonia, Alemania',  desc:'La mayor feria de videojuegos de Europa con más de 300.000 visitantes esperados.' },
  { id:13, date:'2026-08-12', name:'Lanzamiento Juego D',     type:'lanzamiento', location:'Global',           desc:'Lanzamiento mundial de Juego D, disponible en todas las plataformas.' },
  { id:14, date:'2026-08-20', name:'PAX West 2026',           type:'feria',       location:'Seattle, EE.UU.',    desc:'Evento de gaming para fans y desarrolladores en la costa oeste de EE.UU.' },
];

/* ── State ─────────────────────────────────────────── */
const today    = new Date();
let currentYear  = today.getFullYear();
let currentMonth = today.getMonth(); // 0-indexed
let activeFilter = 'all';
let selectedEvent = null;

const MONTHS_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT_ES = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const DAYS_SHORT_EN = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function getLang() {
  return typeof currentLang !== 'undefined' ? currentLang : 'es';
}

function monthName(m) {
  return getLang() === 'es' ? MONTHS_ES[m] : MONTHS_EN[m];
}

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return getLang() === 'es'
    ? `${d} de ${MONTHS_ES[m-1]} de ${y}`
    : `${MONTHS_EN[m-1]} ${d}, ${y}`;
}

/* ── Render calendar ───────────────────────────────── */
function renderCalendar() {
  const grid      = document.getElementById('calGrid');
  const titleEl   = document.getElementById('calTitle');
  const headerDays = document.querySelectorAll('.cal-days-header div');

  titleEl.textContent = `${monthName(currentMonth)} ${currentYear}`;

  // Update day headers
  const days = getLang() === 'es' ? DAYS_SHORT_ES : DAYS_SHORT_EN;
  headerDays.forEach((el, i) => { el.textContent = days[i]; });

  grid.innerHTML = '';

  // First day of month (Mon=0 ... Sun=6)
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const offset   = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth    = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement('div');
    cell.className = 'cal-cell';

    let day, month, year, otherMonth = false;

    if (i < offset) {
      // Prev month
      day = daysInPrevMonth - offset + i + 1;
      month = currentMonth - 1;
      year  = currentYear;
      if (month < 0) { month = 11; year--; }
      otherMonth = true;
    } else if (i >= offset + daysInMonth) {
      // Next month
      day = i - offset - daysInMonth + 1;
      month = currentMonth + 1;
      year  = currentYear;
      if (month > 11) { month = 0; year++; }
      otherMonth = true;
    } else {
      day   = i - offset + 1;
      month = currentMonth;
      year  = currentYear;
    }

    if (otherMonth) cell.classList.add('other-month');

    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    if (isToday) cell.classList.add('today');

    const dayNum = document.createElement('div');
    dayNum.className = 'cal-day-num';
    dayNum.textContent = day;
    cell.appendChild(dayNum);

    // Events for this cell
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const dayEvents = EVENTS.filter(e => e.date === dateStr);

    const eventsWrap = document.createElement('div');
    eventsWrap.className = 'cal-events';

    const MAX_VISIBLE = 2;
    dayEvents.forEach((ev, idx) => {
      if (idx < MAX_VISIBLE) {
        const evEl = document.createElement('div');
        evEl.className = `cal-event ${ev.type}`;
        if (activeFilter !== 'all' && ev.type !== activeFilter) {
          evEl.classList.add('hidden-by-filter');
        }
        evEl.textContent = ev.name;
        evEl.addEventListener('click', e => {
          e.stopPropagation();
          showEventPanel(ev);
        });
        eventsWrap.appendChild(evEl);
      }
    });

    if (dayEvents.length > MAX_VISIBLE) {
      const more = document.createElement('div');
      more.className = 'cal-more';
      more.textContent = `+${dayEvents.length - MAX_VISIBLE} más`;
      more.addEventListener('click', e => {
        e.stopPropagation();
        showEventPanel(dayEvents[MAX_VISIBLE]);
      });
      eventsWrap.appendChild(more);
    }

    cell.appendChild(eventsWrap);
    grid.appendChild(cell);
  }

  renderUpcoming();
}

/* ── Event panel ───────────────────────────────────── */
function showEventPanel(ev) {
  selectedEvent = ev;
  const panel    = document.getElementById('eventPanel');
  const title    = document.getElementById('panelTitle');
  const meta     = document.getElementById('panelMeta');
  const desc     = document.getElementById('panelDesc');

  const typeLabel = { lanzamiento: 'Lanzamiento', feria: 'Feria', convencion: 'Convención' };
  const typeLabelEn = { lanzamiento: 'Release', feria: 'Expo', convencion: 'Convention' };
  const label = getLang() === 'es' ? typeLabel[ev.type] : typeLabelEn[ev.type];

  title.textContent = ev.name;
  meta.innerHTML = `
    <span class="meta-badge ${ev.type}">${label}</span>
    <span>📅 ${formatDate(ev.date)}</span>
    <span>📍 ${ev.location}</span>
  `;
  desc.textContent = ev.desc;

  panel.classList.remove('visible');
  void panel.offsetWidth;
  panel.classList.add('visible');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideEventPanel() {
  document.getElementById('eventPanel').classList.remove('visible');
  selectedEvent = null;
}

/* ── Upcoming list ─────────────────────────────────── */
function renderUpcoming() {
  const list    = document.getElementById('upcomingList');
  const todayStr = today.toISOString().split('T')[0];

  const upcoming = EVENTS
    .filter(e => {
      if (e.date < todayStr) return false;
      if (activeFilter !== 'all' && e.type !== activeFilter) return false;
      return true;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  if (upcoming.length === 0) {
    list.innerHTML = `<p style="color:var(--muted);font-size:14px">${t('agenda.no_events')}</p>`;
    return;
  }

  const typeLabel   = { lanzamiento: 'Lanzamiento', feria: 'Feria', convencion: 'Convención' };
  const typeLabelEn = { lanzamiento: 'Release', feria: 'Expo', convencion: 'Convention' };

  list.innerHTML = upcoming.map(ev => {
    const [y, m, d] = ev.date.split('-').map(Number);
    const label = getLang() === 'es' ? typeLabel[ev.type] : typeLabelEn[ev.type];
    const monthStr = getLang() === 'es' ? MONTHS_ES[m-1].slice(0,3) : MONTHS_EN[m-1].slice(0,3);
    return `
      <div class="upcoming-row" onclick="showEventPanel(${JSON.stringify(ev).replace(/"/g,'&quot;')})">
        <div class="upcoming-date">
          <span class="upcoming-day">${d}</span>
          <span class="upcoming-month">${monthStr}</span>
        </div>
        <div class="upcoming-divider"></div>
        <div class="upcoming-info">
          <div class="upcoming-name">${ev.name}</div>
          <div class="upcoming-location">📍 ${ev.location}</div>
        </div>
        <span class="upcoming-badge ${ev.type}">${label}</span>
      </div>`;
  }).join('');
}

/* ── Event listeners ───────────────────────────────── */
document.getElementById('prevMonth').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  hideEventPanel();
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  hideEventPanel();
  renderCalendar();
});

document.getElementById('todayBtn').addEventListener('click', () => {
  currentMonth = today.getMonth();
  currentYear  = today.getFullYear();
  hideEventPanel();
  renderCalendar();
});

document.getElementById('panelClose').addEventListener('click', hideEventPanel);

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.type;
    hideEventPanel();
    renderCalendar();
  });
});

// Re-render on language change
if (typeof i18nHooks !== 'undefined') {
  i18nHooks.push(() => renderCalendar());
}

// Init
renderCalendar();
