/* ═══════════════════════════════════════════════════════
   GameHub — Sistema de internacionalización (i18n)
   Uso:
     - Añade data-i18n="clave" a cualquier elemento de texto
     - Añade data-i18n-placeholder="clave" a inputs
     - Añade data-i18n-title="clave" a tooltips/title attrs
     - El idioma se guarda en localStorage con clave 'gh-lang'
═══════════════════════════════════════════════════════ */

const TRANSLATIONS = {
  es: {

    /* ── NAVBAR ─────────────────────────────────────── */
    'nav.inicio':       'Inicio',
    'nav.catalogo':     'Catálogo',
    'nav.noticias':     'Noticias',
    'nav.blog':         'Blog',
    'nav.multimedia':   'Multimedia',
    'nav.agenda':       'Agenda',
    'nav.equipo':       'Equipo',
    'nav.login':        'Iniciar sesión',
    'nav.registro':     'Registro',
    'nav.lang':         'ES / EN',

    /* ── DRAWER (móvil) ─────────────────────────────── */
    'drawer.login':     'Iniciar sesión',
    'drawer.registro':  'Crear cuenta',
    'drawer.lang':      'ES / EN',

    /* ── FOOTER ─────────────────────────────────────── */
    'footer.sobre':     'Sobre',
    'footer.equipo':    'Equipo',
    'footer.contacto':  'Contacto',
    'footer.privacidad':'Privacidad',
    'footer.copy':      'GameHub © 2026',

    /* ── SECCIONES COMUNES ──────────────────────────── */
    'section.ver_todo': 'Ver todo →',

    /* ── INDEX — HERO ───────────────────────────────── */
    'hero.badge':       'Temporada 2026',
    'hero.h1_1':        'La industria del videojuego, en un',
    'hero.h1_em':       'solo sitio',
    'hero.tagline':     'Noticias · Rankings · Comunidad · Calendario · Streams',
    'hero.cta_primary': 'Crear cuenta',
    'hero.cta_secondary':'Explorar catálogo',
    'hero.stat1_val':   '+12k',
    'hero.stat1_label': 'Juegos catalogados',
    'hero.stat2_val':   '+48k',
    'hero.stat2_label': 'Usuarios activos',
    'hero.stat3_val':   'Diario',
    'hero.stat3_label': 'Actualización',
    'hero.img_label':   'Imagen destacada',

    /* ── INDEX — SECCIONES ──────────────────────────── */
    'index.ranking.title':   'Top 10 — Mejores juegos',
    'index.noticias.title':  'Últimas noticias',
    'index.blog.title':      'Blog de opinión',
    'index.agenda.title':    'Próximos lanzamientos y ferias',
    'index.streams.title':   'En directo ahora',

    /* ── INDEX — TABS MÓVIL ─────────────────────────── */
    'tab.top':          'Top',
    'tab.noticias':     'Noticias',
    'tab.blog':         'Blog',
    'tab.live':         'Live',
    'tab.agenda':       'Agenda',

    /* ── INDEX — BOTTOM NAV ─────────────────────────── */
    'bottom.inicio':    'Inicio',
    'bottom.catalogo':  'Catálogo',
    'bottom.live':      'Live',
    'bottom.agenda':    'Agenda',
    'bottom.yo':        'Yo',

    /* ── SCORES ─────────────────────────────────────── */
    'score.prensa':     'Prensa',
    'score.comunidad':  'Comunidad',
    'score.usuarios':   'Usuarios',

    /* ── STREAMS ────────────────────────────────────── */
    'stream.espectadores': 'espectadores',

    /* ── LOGIN ──────────────────────────────────────── */
    'login.title':          'Iniciar sesión',
    'login.subtitle':       'Bienvenido de nuevo',
    'login.email.label':    'Email',
    'login.email.placeholder': 'user@example.com',
    'login.pass.label':     'Contraseña',
    'login.pass.placeholder': '••••••••',
    'login.remember':       'Recordarme',
    'login.forgot':         '¿Olvidaste tu contraseña?',
    'login.submit':         'Entrar',
    'login.no_cuenta':      '¿No tienes cuenta?',
    'login.registrate':     'Regístrate',
    'login.error.credenciales': 'Email o contraseña incorrectos.',
    'login.error.email':    'Introduce un email válido.',
    'login.error.pass':     'Introduce tu contraseña.',
    'login.intentos':       'Intento {n} de {max}. {left} intento{s} restante{s2}.',
    'login.lockout.title':  'Cuenta bloqueada temporalmente',
    'login.lockout.text':   'Has superado el límite de 5 intentos fallidos. Podrás volver a intentarlo en:',
    'login.success':        '✓ Accediendo...',

    /* ── REGISTER ───────────────────────────────────── */
    'register.title':           'Crear cuenta',
    'register.subtitle':        'Únete a la comunidad GameHub',
    'register.nombre.label':    'Nombre y apellidos',
    'register.nombre.placeholder': 'María García',
    'register.email.label':     'Email',
    'register.email.placeholder': 'maria@example.com',
    'register.user.label':      'Nombre de usuario',
    'register.user.placeholder': '@gamergirl',
    'register.user.hint':       'Solo letras, números y guiones bajos. Mín. 3 caracteres.',
    'register.pass.label':      'Contraseña',
    'register.pass.placeholder': '••••••••',
    'register.confirm.label':   'Confirmar contraseña',
    'register.confirm.placeholder': '••••••••',
    'register.role.text':       'Te registras como',
    'register.role.value':      'Suscriptor (por defecto)',
    'register.role.admin':      'Un administrador puede cambiar tu rol posteriormente.',
    'register.terms':           'Acepto los',
    'register.terms.link1':     'términos',
    'register.terms.y':         'y la',
    'register.terms.link2':     'política de privacidad',
    'register.submit':          'Crear cuenta',
    'register.ya_cuenta':       '¿Ya tienes cuenta?',
    'register.login':           'Inicia sesión',
    'register.error.nombre':    'Introduce tu nombre completo (mín. 2 caracteres).',
    'register.error.email':     'Introduce un email válido.',
    'register.error.email_taken': 'Este email ya está registrado. ¿Quieres iniciar sesión?',
    'register.error.user':      'Nombre de usuario no válido (mín. 3 caracteres, sin espacios).',
    'register.error.pass':      'Mín. 8 caracteres, 1 mayúscula y 1 número.',
    'register.error.confirm':   'Las contraseñas no coinciden.',
    'register.error.general':   'Corrige los errores antes de continuar.',
    'register.creando':         'Creando cuenta...',
    'register.success':         '¡Cuenta creada! Revisa tu email para confirmarla. Redirigiendo al login...',
    'register.strength.1':      'Muy débil',
    'register.strength.2':      'Débil',
    'register.strength.3':      'Aceptable',
    'register.strength.4':      'Fuerte',
    'register.strength.5':      'Muy fuerte',

    /* ── NOTICIAS ───────────────────────────────────── */
    'noticias.title':           'Noticias y actualidad',
    'noticias.subtitle':        'Novedades del sector, avances tecnológicos y tendencias',
    'noticias.filter.todas':    'Todas',
    'noticias.filter.industria':'Industria',
    'noticias.filter.tech':     'Tecnología',
    'noticias.filter.esports':  'eSports',
    'noticias.filter.resenas':  'Reseñas',
    'noticias.featured.badge':  '★ Destacada',
    'noticias.more.title':      'Más noticias',
    'noticias.load_more':       'Cargar más noticias',
    'noticias.loading':         'Cargando...',
    'noticias.no_more':         'No hay más noticias',
    'noticias.no_results':      'No hay noticias en esta categoría todavía.',
    'noticias.cat.industria':   'Industria',
    'noticias.cat.tech':        'Tecnología',
    'noticias.cat.esports':     'eSports',
    'noticias.cat.resenas':     'Reseñas',

    /* ── CATÁLOGO ───────────────────────────────────── */
    'catalogo.title':           'Catálogo de videojuegos',
    'catalogo.subtitle':        'Los mejores juegos de la historia · valorados por prensa y comunidad',
    'catalogo.search.placeholder': '🔍 Buscar juego…',
    'catalogo.sort.ranking':    'Ordenar por: ranking',
    'catalogo.sort.press':      'Nota prensa',
    'catalogo.sort.community':  'Nota comunidad',
    'catalogo.sort.year_desc':  'Año (más reciente)',
    'catalogo.sort.year_asc':   'Año (más antiguo)',
    'catalogo.sort.name':       'Nombre A–Z',
    'catalogo.view.grid':       'Vista cuadrícula',
    'catalogo.view.list':       'Vista lista',
    'catalogo.filters.title':   'Filtros',
    'catalogo.filters.clear':   'Limpiar',
    'catalogo.filter.genero':   'Género',
    'catalogo.filter.plataforma':'Plataforma',
    'catalogo.filter.anyo':     'Año',
    'catalogo.filter.nota':     'Nota',
    'catalogo.filter.old':      '+ Antiguos',
    'catalogo.no_results':      'Ningún juego coincide con los filtros seleccionados.',
    'catalogo.results':         '{n} juego{s} encontrado{s2}',

    /* ── MULTIMEDIA ─────────────────────────────────── */
    'multimedia.title':         'Hub multimedia',
    'multimedia.subtitle':      'Streams, gameplays y trailers · contenido externo integrado',
    'multimedia.tab.live':      'En directo',
    'multimedia.tab.videos':    'Vídeos',
    'multimedia.tab.trailers':  'Trailers',
    'multimedia.player.live':   'EN DIRECTO',
    'multimedia.player.share':  '↑ Compartir',
    'multimedia.player.twitch': 'Abrir en Twitch',
    'multimedia.player.youtube':'Abrir en YouTube',
    'multimedia.player.label':  'Reproductor integrado',
    'multimedia.player.hint':   'Selecciona un streamer para ver el stream',
    'multimedia.streamers.title':'Streamers destacados',
    'multimedia.trailers.title':'Trailers de lanzamientos',
    'multimedia.tag.trailer':   'Trailer oficial',
    'multimedia.tag.gameplay':  'Gameplay',
    'multimedia.tag.reveal':    'Reveal',
    'multimedia.tag.teaser':    'Teaser',
    'multimedia.vistas':        'vistas',
    'multimedia.espectadores':  'espectadores',
    'multimedia.offline':       'Offline',

    /* ── DASHBOARD SUSCRIPTOR ───────────────────────── */
    'dash.search.placeholder':  'Buscar…',
    'dash.role.suscriptor':     'Suscriptor',
    'dash.nav.principal':       'Principal',
    'dash.nav.resumen':         'Resumen',
    'dash.nav.perfil':          'Mi perfil',
    'dash.nav.favoritos':       'Favoritos',
    'dash.nav.comentarios':     'Mis comentarios',
    'dash.nav.comunidad':       'Comunidad',
    'dash.nav.siguiendo':       'Siguiendo',
    'dash.nav.agenda':          'Mi agenda',
    'dash.nav.cuenta':          'Cuenta',
    'dash.nav.ajustes':         'Ajustes',
    'dash.nav.logout':          'Cerrar sesión',
    'dash.welcome.sub':         'Esto es lo que pasa en tu comunidad hoy',
    'dash.kpi.comentarios':     'Comentarios',
    'dash.kpi.favoritos':       'Favoritos',
    'dash.kpi.siguiendo':       'Siguiendo',
    'dash.kpi.eventos':         'Eventos guardados',
    'dash.activity.title':      'Actividad reciente',
    'dash.comments.title':      'Tus últimos comentarios',
    'dash.favorites.title':     'Tus favoritos',
    'dash.reco.title':          'Recomendado para ti',
    'dash.reco.link':           'Ver catálogo →',
    'dash.footer.privacidad':   'Privacidad',
    'dash.footer.contacto':     'Contacto',
    'dash.footer.ayuda':        'Ayuda',

    /* ── AGENDA ─────────────────────────────────────── */
    'agenda.title':             'Agenda de la industria',
    'agenda.subtitle':          'Lanzamientos, ferias y convenciones del sector gaming',
    'agenda.filter.all':        'Todos',
    'agenda.filter.lanzamiento':'Lanzamiento',
    'agenda.filter.feria':      'Feria',
    'agenda.filter.convencion': 'Convención',
    'agenda.today':             'Hoy',
    'agenda.upcoming.title':    'Próximos eventos',
    'agenda.no_events':         'No hay eventos próximos en esta categoría.',

    /* ── BLOG ───────────────────────────────────────── */
    'blog.title':               'Blog de opinión',
    'blog.subtitle':            'Reflexiones y análisis de figuras destacadas del sector',
    'blog.search.placeholder':  'Buscar en el blog…',
    'blog.filter.all':          'Todos',
    'blog.filter.opinion':      'Opinión',
    'blog.filter.analisis':     'Análisis',
    'blog.filter.entrevista':   'Entrevista',
    'blog.filter.tendencias':   'Tendencias',
    'blog.featured':            '★ Destacado',
    'blog.author.role':         'Redactor senior',
    'blog.comments':            'comentarios',
    'blog.readtime':            'min lectura',
    'blog.all.title':           'Todos los artículos',
    'blog.no_results':          'No hay artículos en esta categoría todavía.',
    'blog.load_more':           'Cargar más artículos',
    'blog.loading':             'Cargando...',
    'blog.no_more':             'No hay más artículos',

    /* ── PAGE TITLES ─────────────────────────────────── */
    'title.home':        'GameHub — La industria del videojuego, en un solo sitio',
    'title.login':       'Iniciar sesión — GameHub',
    'title.register':    'Crear cuenta — GameHub',
    'title.catalogo':    'Catálogo — GameHub',
    'title.noticias':    'Noticias — GameHub',
    'title.blog':        'Blog — GameHub',
    'title.multimedia':  'Multimedia — GameHub',
    'title.agenda':      'Agenda — GameHub',
    'title.dashboard':   'Dashboard — GameHub',

    /* ── POST ───────────────────────────────────────── */
    'post.back':                 'Volver al blog',
    'post.readtime':             'min lectura',
    'post.share':                'Compartir',
    'post.share.copy':           'Copiar enlace',
    'post.share.copied':         '✓ Copiado',
    'post.comments.title':       'Comentarios',
    'post.comments.cta':         'Inicia sesión para participar en la conversación.',
    'post.comments.placeholder': 'Escribe tu comentario…',
    'post.comments.hint':        'Solo visible para usuarios registrados',
    'post.comments.submit':      'Publicar',
    'post.comments.just_now':    'ahora mismo',

    /* ── DASHBOARD ADMIN ─────────────────────────────── */
    'dash.role.admin':               'Administrador',
    'dash.role.redactor':            'Redactor',
    'dash.role.colaborador':         'Colaborador',
    'dash.role.suscriptor':          'Suscriptor',
    'dash.admin.usuarios':           'Usuarios',
    'dash.admin.gestion':            'Gestión de usuarios',
    'dash.admin.roles':              'Roles & permisos',
    'dash.admin.noticias_blog':      'Noticias & Blog',
    'dash.admin.moderacion':         'Moderación',
    'dash.admin.comentarios':        'Comentarios',
    'dash.admin.logs':               'Logs',
    'dash.admin.export':             '↓ Exportar CSV',
    'dash.admin.new_user':           '+ Nuevo usuario',
    'dash.admin.search':             'Buscar por email, usuario…',
    'dash.admin.filter.all_roles':   'Rol: todos',
    'dash.admin.filter.all_status':  'Estado: todos',
    'dash.admin.status.activo':      'Activos',
    'dash.admin.status.suspendido':  'Suspendidos',
    'dash.admin.kpi.total':          'Total usuarios',
    'dash.admin.kpi.suscriptores':   'Suscriptores',
    'dash.admin.kpi.redactores':     'Redactores',
    'dash.admin.kpi.suspendidos':    'Suspendidos',
    'dash.admin.th.usuario':         'Usuario',
    'dash.admin.th.rol':             'Rol',
    'dash.admin.th.estado':          'Estado',
    'dash.admin.th.registrado':      'Registrado',
    'dash.admin.th.acciones':        'Acciones',
    'dash.admin.no_results':         'Ningún usuario coincide con los filtros',
    'dash.admin.modal.edit':         'Editar usuario',
    'dash.admin.modal.create':       'Nuevo usuario',
    'dash.admin.modal.username':     'Nombre de usuario',
    'dash.admin.modal.email':        'Email',
    'dash.admin.modal.delete':       'Eliminar cuenta',
    'dash.admin.modal.cancel':       'Cancelar',
    'dash.admin.modal.save':         'Guardar cambios',
    'dash.admin.last_admin_warn':    '⚠️ No puedes degradar al único administrador del sistema.',
    'dash.coming_soon':              'Sección en desarrollo',

    /* ── DASHBOARD COLABORADOR ───────────────────────── */
    'dash.colab.mis_articulos':      'Mis artículos',
    'dash.colab.borradores':         'Borradores',
    'dash.colab.pendientes':         'Pendientes',
    'dash.colab.publicados':         'Publicados',
    'dash.colab.en_revision':        'En revisión',
    'dash.colab.esta_semana':        'esta semana',
    'dash.colab.new_article':        '+ Nuevo artículo',
    'dash.colab.search':             'Buscar artículo…',
    'dash.colab.filter.all_cat':     'Categoría: todas',
    'dash.colab.filter.all_status':  'Estado: todos',
    'dash.colab.status.borrador':    'Borrador',
    'dash.colab.status.revision':    'En revisión',
    'dash.colab.status.publicado':   'Publicado',
    'dash.colab.status.rechazado':   'Rechazado',
    'dash.colab.th.titulo':          'Título',
    'dash.colab.th.estado':          'Estado',
    'dash.colab.th.categoria':       'Categoría',
    'dash.colab.th.edicion':         'Última edición',
    'dash.colab.no_results':         'No hay artículos que coincidan con los filtros',
    'dash.colab.notice':             '💡 Como colaborador, tus artículos se envían a revisión. Un redactor o administrador los publicará si los aprueba.',
    'dash.colab.modal.title':        'Nuevo artículo',
    'dash.colab.modal.title_ph':     'Título del artículo',
    'dash.colab.modal.content_label':'Contenido (resumen)',
    'dash.colab.modal.content_ph':   'Escribe aquí el resumen o cuerpo del artículo…',
    'dash.colab.modal.notice':       '📤 Al enviar, el artículo pasará a En revisión. No puedes publicarlo directamente.',
    'dash.colab.modal.draft':        'Guardar borrador',
    'dash.colab.modal.send':         'Enviar a revisión',

    /* ── DASHBOARD REDACTOR ──────────────────────────── */
    'dash.red.panel_title':        'Panel de redacción',
    'dash.red.por_revisar':        'Por revisar',
    'dash.red.programadas':        'Programadas',
    'dash.red.media':              'Biblioteca media',
    'dash.red.comunidad':          'Comunidad',
    'dash.red.urgente':            'urgente',
    'dash.red.kpi.publicadas':     'Publicadas',
    'dash.red.kpi.lecturas':       'Lecturas mes',
    'dash.red.cola':               'Cola de publicación',
    'dash.red.nueva':              'Nueva',
    'dash.red.colaboradores':      '(colaboradores)',
    'dash.red.todo_revisado':      'Todo revisado',
    'dash.red.schedule':           '🗓 Programar',
    'dash.red.new_news':           '+ Nueva noticia',
    'dash.red.publish_now':        'Publicar ahora',
    'dash.red.modal.title':        'Nueva noticia',
    'dash.red.modal.headline':     'Titular',
    'dash.red.modal.headline_ph':  'Titular de la noticia',
    'dash.red.modal.readtime':     'Lectura estimada',
    'dash.red.modal.schedule_date':'Fecha y hora de publicación',
    'dash.red.modal.content':      'Resumen / cuerpo',
    'dash.red.modal.content_ph':   'Escribe aquí el contenido…',
    'dash.nav.contenido':          'Contenido',
  },

  en: {

    /* ── NAVBAR ─────────────────────────────────────── */
    'nav.inicio':       'Home',
    'nav.catalogo':     'Catalogue',
    'nav.noticias':     'News',
    'nav.blog':         'Blog',
    'nav.multimedia':   'Multimedia',
    'nav.agenda':       'Events',
    'nav.equipo':       'Team',
    'nav.login':        'Log in',
    'nav.registro':     'Sign up',
    'nav.lang':         'EN / ES',

    /* ── DRAWER (móvil) ─────────────────────────────── */
    'drawer.login':     'Log in',
    'drawer.registro':  'Create account',
    'drawer.lang':      'EN / ES',

    /* ── FOOTER ─────────────────────────────────────── */
    'footer.sobre':     'About',
    'footer.equipo':    'Team',
    'footer.contacto':  'Contact',
    'footer.privacidad':'Privacy',
    'footer.copy':      'GameHub © 2026',

    /* ── SECCIONES COMUNES ──────────────────────────── */
    'section.ver_todo': 'See all →',

    /* ── INDEX — HERO ───────────────────────────────── */
    'hero.badge':       'Season 2026',
    'hero.h1_1':        'The gaming industry, all in',
    'hero.h1_em':       'one place',
    'hero.tagline':     'News · Rankings · Community · Calendar · Streams',
    'hero.cta_primary': 'Create account',
    'hero.cta_secondary':'Explore catalogue',
    'hero.stat1_val':   '+12k',
    'hero.stat1_label': 'Games catalogued',
    'hero.stat2_val':   '+48k',
    'hero.stat2_label': 'Active users',
    'hero.stat3_val':   'Daily',
    'hero.stat3_label': 'Content update',
    'hero.img_label':   'Featured image',

    /* ── INDEX — SECCIONES ──────────────────────────── */
    'index.ranking.title':   'Top 10 — Best games ever',
    'index.noticias.title':  'Latest news',
    'index.blog.title':      'Opinion blog',
    'index.agenda.title':    'Upcoming releases & events',
    'index.streams.title':   'Live right now',

    /* ── INDEX — TABS MÓVIL ─────────────────────────── */
    'tab.top':          'Top',
    'tab.noticias':     'News',
    'tab.blog':         'Blog',
    'tab.live':         'Live',
    'tab.agenda':       'Events',

    /* ── INDEX — BOTTOM NAV ─────────────────────────── */
    'bottom.inicio':    'Home',
    'bottom.catalogo':  'Catalogue',
    'bottom.live':      'Live',
    'bottom.agenda':    'Events',
    'bottom.yo':        'Me',

    /* ── SCORES ─────────────────────────────────────── */
    'score.prensa':     'Press',
    'score.comunidad':  'Community',
    'score.usuarios':   'Users',

    /* ── STREAMS ────────────────────────────────────── */
    'stream.espectadores': 'viewers',

    /* ── LOGIN ──────────────────────────────────────── */
    'login.title':          'Log in',
    'login.subtitle':       'Welcome back',
    'login.email.label':    'Email',
    'login.email.placeholder': 'user@example.com',
    'login.pass.label':     'Password',
    'login.pass.placeholder': '••••••••',
    'login.remember':       'Remember me',
    'login.forgot':         'Forgot your password?',
    'login.submit':         'Log in',
    'login.no_cuenta':      "Don't have an account?",
    'login.registrate':     'Sign up',
    'login.error.credenciales': 'Incorrect email or password.',
    'login.error.email':    'Enter a valid email.',
    'login.error.pass':     'Enter your password.',
    'login.intentos':       'Attempt {n} of {max}. {left} attempt{s} remaining.',
    'login.lockout.title':  'Account temporarily locked',
    'login.lockout.text':   'You have exceeded the 5 failed attempt limit. You can try again in:',
    'login.success':        '✓ Logging in...',

    /* ── REGISTER ───────────────────────────────────── */
    'register.title':           'Create account',
    'register.subtitle':        'Join the GameHub community',
    'register.nombre.label':    'Full name',
    'register.nombre.placeholder': 'Maria Garcia',
    'register.email.label':     'Email',
    'register.email.placeholder': 'maria@example.com',
    'register.user.label':      'Username',
    'register.user.placeholder': '@gamergirl',
    'register.user.hint':       'Letters, numbers and underscores only. Min. 3 characters.',
    'register.pass.label':      'Password',
    'register.pass.placeholder': '••••••••',
    'register.confirm.label':   'Confirm password',
    'register.confirm.placeholder': '••••••••',
    'register.role.text':       'You are registering as',
    'register.role.value':      'Subscriber (default)',
    'register.role.admin':      'An administrator can change your role later.',
    'register.terms':           'I accept the',
    'register.terms.link1':     'terms',
    'register.terms.y':         'and the',
    'register.terms.link2':     'privacy policy',
    'register.submit':          'Create account',
    'register.ya_cuenta':       'Already have an account?',
    'register.login':           'Log in',
    'register.error.nombre':    'Enter your full name (min. 2 characters).',
    'register.error.email':     'Enter a valid email.',
    'register.error.email_taken': 'This email is already registered. Want to log in?',
    'register.error.user':      'Invalid username (min. 3 characters, no spaces).',
    'register.error.pass':      'Min. 8 characters, 1 uppercase and 1 number.',
    'register.error.confirm':   'Passwords do not match.',
    'register.error.general':   'Please fix the errors before continuing.',
    'register.creando':         'Creating account...',
    'register.success':         'Account created! Check your email to confirm it. Redirecting to login...',
    'register.strength.1':      'Very weak',
    'register.strength.2':      'Weak',
    'register.strength.3':      'Fair',
    'register.strength.4':      'Strong',
    'register.strength.5':      'Very strong',

    /* ── NOTICIAS ───────────────────────────────────── */
    'noticias.title':           'News & updates',
    'noticias.subtitle':        'Industry news, tech advances and gaming trends',
    'noticias.filter.todas':    'All',
    'noticias.filter.industria':'Industry',
    'noticias.filter.tech':     'Technology',
    'noticias.filter.esports':  'eSports',
    'noticias.filter.resenas':  'Reviews',
    'noticias.featured.badge':  '★ Featured',
    'noticias.more.title':      'More news',
    'noticias.load_more':       'Load more news',
    'noticias.loading':         'Loading...',
    'noticias.no_more':         'No more news',
    'noticias.no_results':      'No news in this category yet.',
    'noticias.cat.industria':   'Industry',
    'noticias.cat.tech':        'Technology',
    'noticias.cat.esports':     'eSports',
    'noticias.cat.resenas':     'Reviews',

    /* ── CATÁLOGO ───────────────────────────────────── */
    'catalogo.title':           'Games catalogue',
    'catalogo.subtitle':        'The best games ever · rated by press and community',
    'catalogo.search.placeholder': '🔍 Search game…',
    'catalogo.sort.ranking':    'Sort by: ranking',
    'catalogo.sort.press':      'Press score',
    'catalogo.sort.community':  'Community score',
    'catalogo.sort.year_desc':  'Year (newest)',
    'catalogo.sort.year_asc':   'Year (oldest)',
    'catalogo.sort.name':       'Name A–Z',
    'catalogo.view.grid':       'Grid view',
    'catalogo.view.list':       'List view',
    'catalogo.filters.title':   'Filters',
    'catalogo.filters.clear':   'Clear',
    'catalogo.filter.genero':   'Genre',
    'catalogo.filter.plataforma':'Platform',
    'catalogo.filter.anyo':     'Year',
    'catalogo.filter.nota':     'Score',
    'catalogo.filter.old':      'Older',
    'catalogo.no_results':      'No games match the selected filters.',
    'catalogo.results':         '{n} game{s} found',

    /* ── MULTIMEDIA ─────────────────────────────────── */
    'multimedia.title':         'Multimedia hub',
    'multimedia.subtitle':      'Streams, gameplays and trailers · integrated external content',
    'multimedia.tab.live':      'Live',
    'multimedia.tab.videos':    'Videos',
    'multimedia.tab.trailers':  'Trailers',
    'multimedia.player.live':   'LIVE',
    'multimedia.player.share':  '↑ Share',
    'multimedia.player.twitch': 'Open on Twitch',
    'multimedia.player.youtube':'Open on YouTube',
    'multimedia.player.label':  'Integrated player',
    'multimedia.player.hint':   'Select a streamer to watch the stream',
    'multimedia.streamers.title':'Featured streamers',
    'multimedia.trailers.title':'Release trailers',
    'multimedia.tag.trailer':   'Official trailer',
    'multimedia.tag.gameplay':  'Gameplay',
    'multimedia.tag.reveal':    'Reveal',
    'multimedia.tag.teaser':    'Teaser',
    'multimedia.vistas':        'views',
    'multimedia.espectadores':  'viewers',
    'multimedia.offline':       'Offline',

    /* ── DASHBOARD SUSCRIPTOR ───────────────────────── */
    'dash.search.placeholder':  'Search…',
    'dash.role.suscriptor':     'Subscriber',
    'dash.nav.principal':       'Main',
    'dash.nav.resumen':         'Overview',
    'dash.nav.perfil':          'My profile',
    'dash.nav.favoritos':       'Favourites',
    'dash.nav.comentarios':     'My comments',
    'dash.nav.comunidad':       'Community',
    'dash.nav.siguiendo':       'Following',
    'dash.nav.agenda':          'My calendar',
    'dash.nav.cuenta':          'Account',
    'dash.nav.ajustes':         'Settings',
    'dash.nav.logout':          'Log out',
    'dash.welcome.sub':         "Here's what's happening in your community today",
    'dash.kpi.comentarios':     'Comments',
    'dash.kpi.favoritos':       'Favourites',
    'dash.kpi.siguiendo':       'Following',
    'dash.kpi.eventos':         'Saved events',
    'dash.activity.title':      'Recent activity',
    'dash.comments.title':      'Your latest comments',
    'dash.favorites.title':     'Your favourites',
    'dash.reco.title':          'Recommended for you',
    'dash.reco.link':           'See catalogue →',
    'dash.footer.privacidad':   'Privacy',
    'dash.footer.contacto':     'Contact',
    'dash.footer.ayuda':        'Help',

    /* ── AGENDA ─────────────────────────────────────── */
    'agenda.title':             'Industry calendar',
    'agenda.subtitle':          'Game releases, expos and conventions',
    'agenda.filter.all':        'All',
    'agenda.filter.lanzamiento':'Release',
    'agenda.filter.feria':      'Expo',
    'agenda.filter.convencion': 'Convention',
    'agenda.today':             'Today',
    'agenda.upcoming.title':    'Upcoming events',
    'agenda.no_events':         'No upcoming events in this category.',

    /* ── BLOG ───────────────────────────────────────── */
    'blog.title':               'Opinion blog',
    'blog.subtitle':            'Reflections and analysis from leading industry figures',
    'blog.search.placeholder':  'Search the blog…',
    'blog.filter.all':          'All',
    'blog.filter.opinion':      'Opinion',
    'blog.filter.analisis':     'Analysis',
    'blog.filter.entrevista':   'Interview',
    'blog.filter.tendencias':   'Trends',
    'blog.featured':            '★ Featured',
    'blog.author.role':         'Senior editor',
    'blog.comments':            'comments',
    'blog.readtime':            'min read',
    'blog.all.title':           'All articles',
    'blog.no_results':          'No articles in this category yet.',
    'blog.load_more':           'Load more articles',
    'blog.loading':             'Loading...',
    'blog.no_more':             'No more articles',

    /* ── PAGE TITLES ─────────────────────────────────── */
    'title.home':        'GameHub — The gaming industry, all in one place',
    'title.login':       'Log in — GameHub',
    'title.register':    'Create account — GameHub',
    'title.catalogo':    'Catalogue — GameHub',
    'title.noticias':    'News — GameHub',
    'title.blog':        'Blog — GameHub',
    'title.multimedia':  'Multimedia — GameHub',
    'title.agenda':      'Events — GameHub',
    'title.dashboard':   'Dashboard — GameHub',

    /* ── POST ───────────────────────────────────────── */
    'post.back':                 'Back to blog',
    'post.readtime':             'min read',
    'post.share':                'Share',
    'post.share.copy':           'Copy link',
    'post.share.copied':         '✓ Copied',
    'post.comments.title':       'Comments',
    'post.comments.cta':         'Log in to join the conversation.',
    'post.comments.placeholder': 'Write your comment…',
    'post.comments.hint':        'Only visible to registered users',
    'post.comments.submit':      'Post',
    'post.comments.just_now':    'just now',

    /* ── DASHBOARD ADMIN ─────────────────────────────── */
    'dash.role.admin':               'Administrator',
    'dash.role.redactor':            'Editor',
    'dash.role.colaborador':         'Contributor',
    'dash.role.suscriptor':          'Subscriber',
    'dash.admin.usuarios':           'Users',
    'dash.admin.gestion':            'User management',
    'dash.admin.roles':              'Roles & permissions',
    'dash.admin.noticias_blog':      'News & Blog',
    'dash.admin.moderacion':         'Moderation',
    'dash.admin.comentarios':        'Comments',
    'dash.admin.logs':               'Logs',
    'dash.admin.export':             '↓ Export CSV',
    'dash.admin.new_user':           '+ New user',
    'dash.admin.search':             'Search by email, username…',
    'dash.admin.filter.all_roles':   'Role: all',
    'dash.admin.filter.all_status':  'Status: all',
    'dash.admin.status.activo':      'Active',
    'dash.admin.status.suspendido':  'Suspended',
    'dash.admin.kpi.total':          'Total users',
    'dash.admin.kpi.suscriptores':   'Subscribers',
    'dash.admin.kpi.redactores':     'Editors',
    'dash.admin.kpi.suspendidos':    'Suspended',
    'dash.admin.th.usuario':         'User',
    'dash.admin.th.rol':             'Role',
    'dash.admin.th.estado':          'Status',
    'dash.admin.th.registrado':      'Registered',
    'dash.admin.th.acciones':        'Actions',
    'dash.admin.no_results':         'No users match the filters',
    'dash.admin.modal.edit':         'Edit user',
    'dash.admin.modal.create':       'New user',
    'dash.admin.modal.username':     'Username',
    'dash.admin.modal.email':        'Email',
    'dash.admin.modal.delete':       'Delete account',
    'dash.admin.modal.cancel':       'Cancel',
    'dash.admin.modal.save':         'Save changes',
    'dash.admin.last_admin_warn':    '⚠️ You cannot demote the only administrator.',
    'dash.coming_soon':              'Section under development',

    /* ── DASHBOARD COLABORADOR ───────────────────────── */
    'dash.colab.mis_articulos':      'My articles',
    'dash.colab.borradores':         'Drafts',
    'dash.colab.pendientes':         'Pending',
    'dash.colab.publicados':         'Published',
    'dash.colab.en_revision':        'Under review',
    'dash.colab.esta_semana':        'this week',
    'dash.colab.new_article':        '+ New article',
    'dash.colab.search':             'Search article…',
    'dash.colab.filter.all_cat':     'Category: all',
    'dash.colab.filter.all_status':  'Status: all',
    'dash.colab.status.borrador':    'Draft',
    'dash.colab.status.revision':    'Under review',
    'dash.colab.status.publicado':   'Published',
    'dash.colab.status.rechazado':   'Rejected',
    'dash.colab.th.titulo':          'Title',
    'dash.colab.th.estado':          'Status',
    'dash.colab.th.categoria':       'Category',
    'dash.colab.th.edicion':         'Last edited',
    'dash.colab.no_results':         'No articles match the filters',
    'dash.colab.notice':             '💡 As a contributor, your articles are sent for review. An editor or admin will publish them if approved.',
    'dash.colab.modal.title':        'New article',
    'dash.colab.modal.title_ph':     'Article title',
    'dash.colab.modal.content_label':'Content (summary)',
    'dash.colab.modal.content_ph':   'Write your article summary or body here…',
    'dash.colab.modal.notice':       '📤 Once submitted, the article will move to Under review. You cannot publish it directly.',
    'dash.colab.modal.draft':        'Save draft',
    'dash.colab.modal.send':         'Submit for review',

    /* ── DASHBOARD REDACTOR ──────────────────────────── */
    'dash.red.panel_title':        'Editorial panel',
    'dash.red.por_revisar':        'Pending review',
    'dash.red.programadas':        'Scheduled',
    'dash.red.media':              'Media library',
    'dash.red.comunidad':          'Community',
    'dash.red.urgente':            'urgent',
    'dash.red.kpi.publicadas':     'Published',
    'dash.red.kpi.lecturas':       'Monthly reads',
    'dash.red.cola':               'Publication queue',
    'dash.red.nueva':              'New',
    'dash.red.colaboradores':      '(contributors)',
    'dash.red.todo_revisado':      'All reviewed',
    'dash.red.schedule':           '🗓 Schedule',
    'dash.red.new_news':           '+ New article',
    'dash.red.publish_now':        'Publish now',
    'dash.red.modal.title':        'New article',
    'dash.red.modal.headline':     'Headline',
    'dash.red.modal.headline_ph':  'Article headline',
    'dash.red.modal.readtime':     'Estimated read time',
    'dash.red.modal.schedule_date':'Publish date and time',
    'dash.red.modal.content':      'Summary / body',
    'dash.red.modal.content_ph':   'Write your content here…',
    'dash.nav.contenido':          'Content',
  }
};

/* ═══════════════════════════════════════════════════════
   Motor de traducción
═══════════════════════════════════════════════════════ */

let currentLang = localStorage.getItem('gh-lang') || 'es';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    || (TRANSLATIONS['es'] && TRANSLATIONS['es'][key])
    || key;
}

/* ── Hook system ─────────────────────────────────── */
// Páginas pueden registrar funciones que se llaman cada vez
// que cambia el idioma, para re-renderizar contenido dinámico.
// Uso en catalogo.js: i18nHooks.push(() => render());
const i18nHooks = [];

function applyTranslations() {
  // Texto de elementos
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Placeholders de inputs
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });

  // Atributos title (tooltips)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });

  // Actualizar el botón de idioma
  const langBtn = document.querySelector('.nav-lang, .topbar-lang, .drawer-lang');
  if (langBtn) langBtn.textContent = t('nav.lang');

  // Llamar a los hooks registrados por cada página
  i18nHooks.forEach(fn => fn());

  // Actualizar el título de la pestaña
  const pageKey = document.documentElement.getAttribute('data-page');
  if (pageKey) document.title = t('title.' + pageKey);
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('gh-lang', lang);
  applyTranslations();
}

function toggleLang() {
  setLang(currentLang === 'es' ? 'en' : 'es');
}

// Aplicar al cargar la página
document.addEventListener('DOMContentLoaded', applyTranslations);
