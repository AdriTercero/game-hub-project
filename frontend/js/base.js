/* ── Theme toggle ─────────────────────────────────── */
const html = document.documentElement;
const btn  = document.getElementById('themeToggle');
const saved = localStorage.getItem('gh-theme') || 'dark';
html.setAttribute('data-theme', saved);
btn.textContent = saved === 'dark' ? '☀️' : '🌙';
btn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  btn.textContent = next === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('gh-theme', next);
});

/* ── Language toggle ──────────────────────────────── */
document.querySelectorAll('.nav-lang, .topbar-lang, .drawer-lang').forEach(el => {
  el.addEventListener('click', toggleLang);
});

/* ── Inject drawer ────────────────────────────────── */
(function injectDrawer() {
  // Detect current page for active link
  const page = location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    if (href === 'index.html' && (page === 'index.html' || page === '')) return true;
    return href === page;
  }

  const NAV_LINKS = [
    { href: 'index.html',      icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',  key: 'nav.inicio' },
    { href: 'catalogo.html',   icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>', key: 'nav.catalogo' },
    { href: 'noticias.html',   icon: '<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z"/>', key: 'nav.noticias' },
    { href: 'blog.html',       icon: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>',  key: 'nav.blog' },
    { href: 'multimedia.html', icon: '<circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/>', key: 'nav.multimedia' },
    { href: 'agenda.html',     icon: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>', key: 'nav.agenda' },
    { href: '#',               icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>', key: 'nav.equipo', cls: 'open-equipo' },
  ];

  const linksHTML = NAV_LINKS.map(l => {
    const active = isActive(l.href) ? ' class="active"' : (l.cls ? ` class="${l.cls}"` : '');
    const label  = typeof t === 'function' ? t(l.key) : l.key.split('.')[1];
    return `<a href="${l.href}"${active}>
      <svg viewBox="0 0 24 24">${l.icon}</svg>
      <span data-i18n="${l.key}">${label}</span>
    </a>`;
  }).join('');

  const drawerHTML = `
    <div class="drawer-overlay" id="drawerOverlay"></div>
    <div class="drawer" id="drawer">
      <div class="drawer-header">
        <div class="drawer-logo">
          <div class="drawer-logo-icon">GH</div>
          <span class="drawer-logo-text">GameHub</span>
        </div>
        <button class="drawer-close" id="drawerClose">✕</button>
      </div>
      <nav class="drawer-nav">${linksHTML}</nav>
      <div class="drawer-footer">
        <div class="drawer-lang" data-i18n="nav.lang">ES / EN</div>
        <button class="drawer-btn-ghost" onclick="location.href='login.html'" data-i18n="drawer.login">Iniciar sesión</button>
        <button class="drawer-btn-primary" onclick="location.href='register.html'" data-i18n="drawer.registro">Crear cuenta</button>
      </div>
    </div>
  `;

  // Inject after navbar if present, else at start of body
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.insertAdjacentHTML('afterend', drawerHTML);
  } else {
    document.body.insertAdjacentHTML('afterbegin', drawerHTML);
  }

  // Wire up events
  const hamburger   = document.getElementById('hamburger');
  const drawer      = document.getElementById('drawer');
  const overlay     = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  if (!hamburger) return; // page has no hamburger button

  function openDrawer() {
    overlay.style.display = 'block';
    drawer.style.display  = 'flex';
    requestAnimationFrame(() => {
      overlay.classList.add('open');
      drawer.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      overlay.style.display = 'none';
      drawer.style.display  = 'none';
    }, 280);
  }

  hamburger.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.drawer-nav a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.querySelectorAll('.drawer-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      closeDrawer();
    });
  });
})();

/* ── Desktop nav active ───────────────────────────── */
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

/* ── Bottom nav active (mobile) ───────────────────── */
document.querySelectorAll('.bottom-nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.bottom-nav a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

/* ── Scroll reveal ────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 5) * 0.07 + 's';
  revealObserver.observe(el);
});

/* ── Inject footer ────────────────────────────────── */
(function injectFooter() {
  // Don't inject if a <footer> already exists in the HTML
  if (document.querySelector('footer')) return;

  const footerHTML = `
    <footer>
      <div class="footer-left">
        <div class="footer-logo">GH</div>
        <span class="footer-copy" data-i18n="footer.copy">GameHub © 2026</span>
      </div>
      <div class="footer-links">
        <a href="#" class="open-sobre"      data-i18n="footer.sobre">Sobre</a>
        <a href="#" class="open-equipo"     data-i18n="footer.equipo">Equipo</a>
        <a href="#" class="open-contacto"   data-i18n="footer.contacto">Contacto</a>
        <a href="#" class="open-privacidad" data-i18n="footer.privacidad">Privacidad</a>
      </div>
    </footer>
  `;

  // For dashboard pages: inject inside .main before .main-footer if present,
  // otherwise append to .main, otherwise append to body
  const mainFooter = document.querySelector('.main-footer');
  if (mainFooter) {
    mainFooter.outerHTML = footerHTML;
    return;
  }

  // If .main is inside a .layout grid (e.g. catalogo), inject after .layout
  const layout = document.querySelector('.layout');
  if (layout) {
    layout.insertAdjacentHTML('afterend', footerHTML);
    return;
  }

  const main = document.querySelector('.main');
  if (main) {
    main.insertAdjacentHTML('beforeend', footerHTML);
    return;
  }

  document.body.insertAdjacentHTML('beforeend', footerHTML);
})();