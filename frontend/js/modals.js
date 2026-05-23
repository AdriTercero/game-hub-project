/* ═══════════════════════════════════════════════════════
   GameHub — Modales informativos
   About, Contacto, Privacidad, Términos
   Uso: añade la clase correspondiente al link/botón:
     open-sobre | open-contacto | open-privacidad | open-tos
═══════════════════════════════════════════════════════ */

/* ── Shared CSS ─────────────────────────────────────── */
const modalStyle = document.createElement('style');
modalStyle.textContent = `
  .gh-modal-overlay {
    display: none;
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(6px);
    align-items: center;
    justify-content: center;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .gh-modal-overlay.open { display: flex; opacity: 1; }

  .gh-modal {
    background: var(--surface, #1A1A24);
    border: 1px solid var(--border, rgba(255,255,255,0.07));
    border-radius: 16px;
    width: 100%;
    max-width: 520px;
    max-height: 88vh;
    overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.7);
    animation: ghModalIn 0.28s cubic-bezier(0.4,0,0.2,1) both;
  }
  @keyframes ghModalIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .gh-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 22px 26px 18px;
    border-bottom: 1px solid var(--border, rgba(255,255,255,0.07));
  }
  .gh-modal-header-left { display: flex; align-items: center; gap: 12px; }
  .gh-modal-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--accent-dim, rgba(217,119,87,0.12));
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .gh-modal-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 17px;
    color: var(--text, #EEECEA);
    letter-spacing: -0.3px;
  }
  .gh-modal-close {
    width: 32px; height: 32px;
    background: transparent;
    border: 1px solid var(--border, rgba(255,255,255,0.1));
    border-radius: 8px; cursor: pointer;
    color: var(--muted, #6A6870); font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s; flex-shrink: 0;
  }
  .gh-modal-close:hover { background: rgba(255,255,255,0.08); color: var(--text, #EEECEA); }

  .gh-modal-body { padding: 22px 26px 26px; }

  .gh-modal-section { margin-bottom: 20px; }
  .gh-modal-section:last-child { margin-bottom: 0; }
  .gh-modal-section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 600; font-size: 13px;
    text-transform: uppercase; letter-spacing: 0.8px;
    color: var(--accent, #D97757);
    margin-bottom: 8px;
  }
  .gh-modal-text {
    font-size: 14px; color: var(--text-2, #A8A6A2);
    line-height: 1.7;
  }
  .gh-modal-text a { color: var(--accent, #D97757); }
  .gh-modal-text a:hover { opacity: 0.8; }

  .gh-modal-divider {
    height: 1px; background: var(--border, rgba(255,255,255,0.07));
    margin: 20px 0;
  }

  /* Contact form */
  .gh-contact-form { display: flex; flex-direction: column; gap: 12px; margin-top: 4px; }
  .gh-contact-form input,
  .gh-contact-form textarea {
    width: 100%;
    background: var(--input-bg, #13131C);
    border: 1px solid var(--border-2, rgba(255,255,255,0.13));
    border-radius: 8px;
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--text, #EEECEA);
    outline: none; transition: border-color 0.18s;
    resize: none;
  }
  .gh-contact-form input::placeholder,
  .gh-contact-form textarea::placeholder { color: var(--muted, #6A6870); }
  .gh-contact-form input:focus,
  .gh-contact-form textarea:focus { border-color: rgba(217,119,87,0.6); }
  .gh-contact-form textarea { min-height: 100px; }
  .gh-contact-submit {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500;
    color: #fff; background: var(--accent, #D97757);
    border: none; border-radius: 8px;
    padding: 11px; cursor: pointer;
    transition: background 0.15s;
  }
  .gh-contact-submit:hover { background: var(--accent-h, #C4633F); }
  .gh-contact-success {
    display: none; text-align: center;
    padding: 20px 0; font-size: 14px;
    color: var(--text-2, #A8A6A2);
  }
  .gh-contact-success-icon { font-size: 32px; margin-bottom: 10px; }

  @media (max-width: 480px) {
    .gh-modal-header { padding: 18px 18px 14px; }
    .gh-modal-body { padding: 18px 18px 20px; }
    .gh-modal-title { font-size: 15px; }
  }
`;
document.head.appendChild(modalStyle);

/* ══════════════════════════════════════════════════════
   MODAL DEFINITIONS
══════════════════════════════════════════════════════ */

const MODALS = {

  /* ── SOBRE ──────────────────────────────────────── */
  sobre: {
    icon: 'ℹ️',
    title: { es: 'Sobre GameHub', en: 'About GameHub' },
    render: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">¿Qué es GameHub?</div>
        <div class="gh-modal-text">
          GameHub es una plataforma de referencia para la industria del videojuego, desarrollada como proyecto universitario en la Universidad Miguel Hernández (UMH). Centraliza noticias, análisis, rankings, streams y eventos del sector en un único espacio.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Proyecto académico</div>
        <div class="gh-modal-text">
          Este proyecto forma parte de la asignatura de Ingeniería del Software del Grado en Ingeniería Informática de Tecnologías de la Información (GIITI), curso 2025–2026. Todo el contenido es de carácter demostrativo.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Tecnologías</div>
        <div class="gh-modal-text">
          Frontend: HTML5, CSS3, JavaScript vanilla.<br>
          Backend: Python · Base de datos: MySQL.<br>
          Control de versiones: Git.
        </div>
      </div>
    `,
    renderEn: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">What is GameHub?</div>
        <div class="gh-modal-text">
          GameHub is a reference platform for the video game industry, developed as a university project at Universidad Miguel Hernández (UMH). It centralises news, analysis, rankings, streams and events in a single space.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Academic project</div>
        <div class="gh-modal-text">
          This project is part of the Software Engineering course of the Computer Engineering degree (GIITI), academic year 2025–2026. All content is for demonstration purposes only.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Technologies</div>
        <div class="gh-modal-text">
          Frontend: HTML5, CSS3, vanilla JavaScript.<br>
          Backend: Python · Database: MySQL.<br>
          Version control: Git.
        </div>
      </div>
    `,
  },

  /* ── CONTACTO ───────────────────────────────────── */
  contacto: {
    icon: '✉️',
    title: { es: 'Contacto', en: 'Contact' },
    render: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Envíanos un mensaje</div>
        <div class="gh-contact-form" id="contactForm">
          <input type="text" id="contactName" placeholder="Tu nombre">
          <input type="email" id="contactEmail" placeholder="Tu email">
          <textarea id="contactMsg" placeholder="Tu mensaje…"></textarea>
          <button class="gh-contact-submit" onclick="submitContact()">Enviar mensaje</button>
        </div>
        <div class="gh-contact-success" id="contactSuccess">
          <div class="gh-contact-success-icon">✅</div>
          <strong>Mensaje enviado</strong><br>
          Te responderemos en breve.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Email directo</div>
        <div class="gh-modal-text">
          <a href="mailto:gamehub@umh.es">gamehub@umh.es</a>
        </div>
      </div>
    `,
    renderEn: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Send us a message</div>
        <div class="gh-contact-form" id="contactForm">
          <input type="text" id="contactName" placeholder="Your name">
          <input type="email" id="contactEmail" placeholder="Your email">
          <textarea id="contactMsg" placeholder="Your message…"></textarea>
          <button class="gh-contact-submit" onclick="submitContact()">Send message</button>
        </div>
        <div class="gh-contact-success" id="contactSuccess">
          <div class="gh-contact-success-icon">✅</div>
          <strong>Message sent</strong><br>
          We'll get back to you shortly.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Direct email</div>
        <div class="gh-modal-text">
          <a href="mailto:gamehub@umh.es">gamehub@umh.es</a>
        </div>
      </div>
    `,
  },

  /* ── PRIVACIDAD ─────────────────────────────────── */
  privacidad: {
    icon: '🔒',
    title: { es: 'Política de privacidad', en: 'Privacy policy' },
    render: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Datos recogidos</div>
        <div class="gh-modal-text">
          GameHub recoge únicamente los datos necesarios para el funcionamiento de la plataforma: nombre, email y nombre de usuario al registrarte. No se recogen datos de pago ni información sensible.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Uso de los datos</div>
        <div class="gh-modal-text">
          Los datos se utilizan exclusivamente para gestionar tu cuenta y personalizar tu experiencia en la plataforma. No se ceden a terceros ni se usan con fines publicitarios.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Cookies</div>
        <div class="gh-modal-text">
          Usamos cookies de sesión para mantenerte autenticado y cookies de preferencias para guardar tu tema e idioma seleccionados. No usamos cookies de seguimiento ni publicidad.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Tus derechos</div>
        <div class="gh-modal-text">
          Puedes solicitar el acceso, rectificación o eliminación de tus datos en cualquier momento escribiendo a <a href="mailto:gamehub@umh.es">gamehub@umh.es</a>. Este proyecto es de carácter académico y no está sujeto a tratamiento comercial de datos.
        </div>
      </div>
    `,
    renderEn: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Data collected</div>
        <div class="gh-modal-text">
          GameHub only collects data necessary for the platform to function: name, email and username upon registration. No payment data or sensitive information is collected.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Use of data</div>
        <div class="gh-modal-text">
          Data is used solely to manage your account and personalise your experience. It is not shared with third parties or used for advertising purposes.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Cookies</div>
        <div class="gh-modal-text">
          We use session cookies to keep you logged in and preference cookies to save your selected theme and language. We do not use tracking or advertising cookies.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Your rights</div>
        <div class="gh-modal-text">
          You may request access, rectification or deletion of your data at any time by writing to <a href="mailto:gamehub@umh.es">gamehub@umh.es</a>. This is an academic project and is not subject to commercial data processing.
        </div>
      </div>
    `,
  },

  /* ── TÉRMINOS ───────────────────────────────────── */
  tos: {
    icon: '📄',
    title: { es: 'Términos y condiciones', en: 'Terms and conditions' },
    render: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Aceptación</div>
        <div class="gh-modal-text">
          Al registrarte en GameHub aceptas estos términos. El uso de la plataforma implica la aceptación de las presentes condiciones y de la política de privacidad.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Uso de la plataforma</div>
        <div class="gh-modal-text">
          GameHub es una plataforma de contenido sobre videojuegos. El usuario se compromete a hacer un uso responsable, sin publicar contenido ofensivo, spam ni información falsa.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Cuentas de usuario</div>
        <div class="gh-modal-text">
          Cada usuario es responsable de mantener la confidencialidad de sus credenciales. GameHub se reserva el derecho de suspender cuentas que incumplan estos términos.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Contenido</div>
        <div class="gh-modal-text">
          Todo el contenido de GameHub tiene carácter informativo y de entretenimiento. Al ser un proyecto académico, los datos mostrados son de ejemplo y no constituyen información comercial real.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Modificaciones</div>
        <div class="gh-modal-text">
          GameHub puede modificar estos términos en cualquier momento. Los cambios se comunicarán a los usuarios registrados por email.
        </div>
      </div>
    `,
    renderEn: () => `
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Acceptance</div>
        <div class="gh-modal-text">
          By registering on GameHub you accept these terms. Using the platform implies acceptance of these conditions and the privacy policy.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Platform use</div>
        <div class="gh-modal-text">
          GameHub is a video game content platform. Users agree to use it responsibly, without posting offensive content, spam or false information.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">User accounts</div>
        <div class="gh-modal-text">
          Each user is responsible for maintaining the confidentiality of their credentials. GameHub reserves the right to suspend accounts that breach these terms.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Content</div>
        <div class="gh-modal-text">
          All GameHub content is for informational and entertainment purposes. As an academic project, all data shown is sample data and does not constitute real commercial information.
        </div>
      </div>
      <div class="gh-modal-divider"></div>
      <div class="gh-modal-section">
        <div class="gh-modal-section-title">Modifications</div>
        <div class="gh-modal-text">
          GameHub may modify these terms at any time. Changes will be communicated to registered users by email.
        </div>
      </div>
    `,
  },
};

/* ══════════════════════════════════════════════════════
   EQUIPO DATA
══════════════════════════════════════════════════════ */

const TEAM = [
  { initials: 'A1', name: 'Adrian Tercero Delicado', role: 'Project Manager & Backend',  email: 'adrian.tercero@goumh.umh.es', color: '#3a6eb0' },
  { initials: 'A2', name: 'Pablo Fernández Llorca', role: 'Frontend & UX/UI',            email: 'pablo.fernandez25@goumh.umh.es', color: '#D97757' },
  { initials: 'A3', name: 'Alejandro Pomares García', role: 'Backend & Base de Datos',     email: 'alejandro.pomares05@goumh.umh.es', color: '#5B8C5A' },
  { initials: 'A4', name: 'Pedro Martínez Torres', role: 'QA & Documentación',          email: 'pedro.martinez51@goumh.umh.es', color: '#8A5BAD' },
];

const PROJECT_NAME   = 'GameHub & Services Ecosystem';
const PROJECT_YEAR   = '2025 – 2026';
const PROJECT_COURSE = 'Ingeniería del Software · UMH';

/* ══════════════════════════════════════════════════════
   ENGINE
══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // Create one shared overlay
  const overlay = document.createElement('div');
  overlay.className = 'gh-modal-overlay';
  overlay.id = 'ghModalOverlay';
  overlay.innerHTML = `<div class="gh-modal" id="ghModal"></div>`;
  document.body.appendChild(overlay);

  const modal = document.getElementById('ghModal');

  function getLang() {
    return typeof currentLang !== 'undefined' ? currentLang : 'es';
  }

  function openModal(key) {
    const def  = MODALS[key];
    if (!def) return;
    const lang = getLang();
    const titleStr = def.title[lang] || def.title.es;
    const bodyFn   = lang === 'en' && def.renderEn ? def.renderEn : def.render;

    modal.innerHTML = `
      <div class="gh-modal-header">
        <div class="gh-modal-header-left">
          <div class="gh-modal-icon">${def.icon}</div>
          <div class="gh-modal-title">${titleStr}</div>
        </div>
        <button class="gh-modal-close" id="ghModalClose">✕</button>
      </div>
      <div class="gh-modal-body">${bodyFn()}</div>
    `;

    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';

    document.getElementById('ghModalClose').addEventListener('click', closeModal);
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { overlay.style.display = 'none'; }, 250);
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Intercept clicks
  const MAP = {
    'open-sobre':      'sobre',
    'open-contacto':   'contacto',
    'open-privacidad': 'privacidad',
    'open-tos':        'tos',
  };

  document.addEventListener('click', e => {
    for (const [cls, key] of Object.entries(MAP)) {
      if (e.target.closest('.' + cls)) {
        e.preventDefault();
        openModal(key);
        return;
      }
    }
  });

  // Contact form submit (simulated)
  window.submitContact = function() {
    const name  = document.getElementById('contactName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const msg   = document.getElementById('contactMsg')?.value.trim();
    if (!name || !email || !msg) return;
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('contactSuccess').style.display = 'block';
  };

  /* ══════════════════════════════════════════════════
     EQUIPO MODAL
  ══════════════════════════════════════════════════ */
  const eqStyle = document.createElement('style');
  eqStyle.textContent = `
    .eq-overlay {
      display: none; position: fixed; inset: 0; z-index: 1001;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(6px);
      opacity: 0; transition: opacity 0.25s ease;
      align-items: center; justify-content: center; padding: 16px;
    }
    .eq-overlay.open { display: flex; opacity: 1; }
    .eq-modal {
      background: var(--surface, #1A1A24);
      border: 1px solid var(--border, rgba(255,255,255,0.07));
      border-radius: 16px; width: 100%; max-width: 560px;
      max-height: 90vh; overflow-y: auto;
      box-shadow: 0 24px 80px rgba(0,0,0,0.7);
      animation: eqSlideUp 0.3s cubic-bezier(0.4,0,0.2,1) both;
    }
    @keyframes eqSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    .eq-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 24px 28px 20px; border-bottom: 1px solid var(--border, rgba(255,255,255,0.07)); }
    .eq-project { font-family: 'Syne',sans-serif; font-weight: 800; font-size: 18px; color: var(--text,#EEECEA); letter-spacing: -0.4px; margin-bottom: 4px; }
    .eq-project em { font-style: normal; color: var(--accent,#D97757); }
    .eq-meta { font-size: 12.5px; color: var(--muted,#6A6870); }
    .eq-close { width: 32px; height: 32px; background: transparent; border: 1px solid var(--border,rgba(255,255,255,0.1)); border-radius: 8px; cursor: pointer; color: var(--muted,#6A6870); font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background .15s, color .15s; flex-shrink: 0; margin-left: 16px; }
    .eq-close:hover { background: rgba(255,255,255,.08); color: var(--text,#EEECEA); }
    .eq-body { padding: 20px 28px 28px; display: flex; flex-direction: column; gap: 10px; }
    .eq-card { background: var(--surface-2,#20202C); border: 1px solid var(--border,rgba(255,255,255,.07)); border-radius: 10px; padding: 14px 16px; display: flex; align-items: center; gap: 14px; transition: border-color .15s; }
    .eq-card:hover { border-color: var(--border-2,rgba(255,255,255,.13)); }
    .eq-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne',sans-serif; font-weight: 700; font-size: 15px; color: #fff; flex-shrink: 0; }
    .eq-info { flex: 1; min-width: 0; }
    .eq-name { font-family: 'Syne',sans-serif; font-weight: 600; font-size: 14.5px; color: var(--text,#EEECEA); margin-bottom: 2px; }
    .eq-role { font-size: 12.5px; color: var(--muted,#6A6870); }
    .eq-email { font-size: 12px; color: var(--accent,#D97757); text-decoration: none; flex-shrink: 0; opacity: .85; transition: opacity .15s; }
    .eq-email:hover { opacity: 1; }
    @media (max-width: 480px) { .eq-header { padding: 20px 20px 16px; } .eq-body { padding: 16px 20px 20px; } .eq-project { font-size: 16px; } .eq-email { display: none; } }
  `;
  document.head.appendChild(eqStyle);

  const eqOverlay = document.createElement('div');
  eqOverlay.className = 'eq-overlay';
  eqOverlay.id = 'equipoOverlay';
  eqOverlay.innerHTML = `
    <div class="eq-modal" id="equipoModal">
      <div class="eq-header">
        <div class="eq-header-info">
          <div class="eq-project"><em>${PROJECT_NAME}</em></div>
          <div class="eq-meta">${PROJECT_COURSE} &nbsp;·&nbsp; ${PROJECT_YEAR}</div>
        </div>
        <button class="eq-close" id="equipoClose" aria-label="Cerrar">✕</button>
      </div>
      <div class="eq-body">
        ${TEAM.map(m => `
          <div class="eq-card">
            <div class="eq-avatar" style="background:${m.color}">${m.initials}</div>
            <div class="eq-info">
              <div class="eq-name">${m.name}</div>
              <div class="eq-role">${m.role}</div>
            </div>
            <a href="mailto:${m.email}" class="eq-email">${m.email}</a>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(eqOverlay);

  window.openEquipo = function() {
    eqOverlay.style.display = 'flex';
    requestAnimationFrame(() => eqOverlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
  };

  function closeEquipo() {
    eqOverlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { eqOverlay.style.display = 'none'; }, 250);
  }

  document.getElementById('equipoClose').addEventListener('click', closeEquipo);
  eqOverlay.addEventListener('click', e => { if (e.target === eqOverlay) closeEquipo(); });

  document.querySelectorAll('.open-equipo').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); window.openEquipo(); });
  });

  // Shared Escape handler covers both modals
});