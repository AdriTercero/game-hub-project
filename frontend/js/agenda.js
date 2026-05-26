/* ═══════════════════════════════════════════════════════
   GameHub — Agenda / Calendario
═══════════════════════════════════════════════════════ */

/* ── Get events ────────────────────────────────────────*/
async function fetchEvents() {
  const params = new URLSearchParams();
  if (activeFilter !== 'all') params.set('type', activeFilter);
  params.set('year',  currentYear);
  params.set('month', currentMonth + 1); // JS es 0-indexed, backend espera 1-indexed
  const res  = await fetch('/api/events?' + params);
  const data = await res.json();
  return data.events;
}

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
async function renderCalendar() {
  const grid      = document.getElementById('calGrid');
  const titleEl   = document.getElementById('calTitle');
  const headerDays = document.querySelectorAll('.cal-days-header div');

  titleEl.textContent = `${monthName(currentMonth)} ${currentYear}`;

  // Update day headers
  const days = getLang() === 'es' ? DAYS_SHORT_ES : DAYS_SHORT_EN;
  headerDays.forEach((el, i) => { el.textContent = days[i]; });

  grid.innerHTML = '';
  const EVENTS = await fetchEvents();

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

  renderUpcoming(EVENTS);
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
function renderUpcoming(EVENTS) {
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
