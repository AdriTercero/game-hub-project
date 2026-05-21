import os
import re
import html
from flask import Flask, request, jsonify, make_response
from flask_bcrypt import Bcrypt
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
bcrypt = Bcrypt(app)

from flask_cors import CORS
CORS(app, supports_credentials=True, origins=['http://localhost:5500'])

# Configuración de entorno y llave secreta de sesión
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'super-secret-key-game-hub-2026')

# Configuración de conexión a base de datos MySQL [cite: 343]
def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASSWORD', ''),
        database=os.environ.get('DB_NAME', 'game_hub_db')
    )

# --- MITIGACIÓN XSS Y SANITIZACIÓN (RNF-03) [cite: 180] ---
def sanitize_input(text):
    if not text:
        return ""
    return html.escape(text.strip())

# --- MIDDLEWARE DE AUTORIZACIÓN (RBAC) [cite: 182, 330] ---
def verify_role_and_session(request, allowed_roles):
    session_token = request.cookies.get('session_token')
    if not session_token:
        return None, "Unauthorized"
    
    # En producción se valida el token contra una firma JWT o una sesión activa en DB
    # Simulación de extracción del payload de la sesión:
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Consulta segura empleando Prepared Statements 
        query = "SELECT id, role_id, status FROM users WHERE id = %s"
        cursor.execute(query, (session_token,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if not user or not user['status']: # [cite: 77, 293]
            return None, "Forbidden"
        if user['role_id'] not in allowed_roles: # [cite: 183, 337]
            return None, "Insufficient Privileges"
        return user, None
    except Error:
        return None, "Database Error"

# --- CU-01: REGISTRO DE NUEVO SUSCRIPTOR [cite: 46, 267] ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Datos incompletos"}), 400 # [cite: 279]
    
    username = sanitize_input(data.get('username'))
    email = data.get('email').strip()
    password = data.get('password')
    
    # Validación básica de email en servidor [cite: 176, 274]
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Formato de email inválido"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Verificar unicidad de Email y Username [cite: 86, 178]
        cursor.execute("SELECT id FROM users WHERE email = %s OR username = %s", (email, username))
        if cursor.fetchone():
            return jsonify({"error": "El email o el nombre de usuario ya existe"}), 400 # [cite: 280]
        
        # Hasheo robusto de la contraseña [cite: 73, 177]
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # Inserción con Prepared Statements asignando Rol 3 por defecto (Suscriptor) [cite: 87, 277]
        insert_query = "INSERT INTO users (username, email, password_hash, role_id) VALUES (%s, %s, %s, 3)"
        cursor.execute(insert_query, (username, email, hashed_password))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"message": "Usuario registrado de forma exitosa"}), 211 # [cite: 278]
        
    except Error as e:
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500 # [cite: 282]

# --- CU-02: INICIO DE SESIÓN (LOGIN) [cite: 90, 284] ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier') # Puede ser email o username [cite: 93]
    password = data.get('password')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT id, password_hash, role_id, failed_attempts, status FROM users WHERE email = %s OR username = %s"
        cursor.execute(query, (identifier, identifier))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({"error": "Credenciales inválidas"}), 401 # [cite: 292]
        
        # Control de intentos fallidos (Bloqueo temporal) 
        if user['failed_attempts'] >= 5:
            return jsonify({"error": "Cuenta bloqueada temporalmente por exceso de intentos fallidos"}), 423
        
        # Verificación del Hash de la contraseña [cite: 177, 289]
        if bcrypt.check_password_hash(user['password_hash'], password):
            # Reiniciar intentos fallidos y actualizar último acceso [cite: 93]
            cursor.execute("UPDATE users SET failed_attempts = 0, last_login = NOW() WHERE id = %s", (user['id'],))
            conn.commit()
            
            # Generar Respuesta y establecer Cookie Segura (HttpOnly) [cite: 181, 290]
            response = make_response(jsonify({"message": "Login exitoso", "role_id": user['role_id']}))
            # En entorno de producción real, configurar secure=True y samesite='Strict'
            response.set_cookie('session_token', str(user['id']), httponly=True, max_age=3600) 
            
            cursor.close()
            conn.close()
            return response
        else:
            # Incrementar contador de intentos fallidos [cite: 93]
            cursor.execute("UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = %s", (user['id'],))
            conn.commit()
            cursor.close()
            conn.close()
            return jsonify({"error": "Credenciales inválidas"}), 401 # [cite: 292]
            
    except Error as e:
        return jsonify({"error": "Error interno del servidor"}), 500

# --- CU-04: NAVEGACIÓN DEL CATÁLOGO CON FILTRADO Y PAGINACIÓN SERVIDOR [cite: 170, 172, 311] ---
@app.route('/api/catalog', methods=['GET'])
def get_catalog():
    genre = request.args.get('genre')
    platform = request.args.get('platform')
    page = int(request.args.get('page', 1))
    limit = 12 # Bloques de carga regulados [cite: 170, 314]
    offset = (page - 1) * limit
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        # Construcción dinámica de la consulta segura empleando parámetros posicionales
        query = "SELECT * FROM games WHERE 1=1"
        params = []
        
        if genre:
            query += " AND genre = %s"
            params.append(genre)
        if platform:
            query += " AND platform = %s"
            params.append(platform)
            
        query += " ORDER BY community_rating DESC LIMIT %s OFFSET %s" # [cite: 318]
        params.extend([limit, offset])
        
        cursor.execute(query, tuple(params))
        games_list = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return jsonify({"games": games_list, "page": page, "count": len(games_list)}) # [cite: 321]
    except Error:
        return jsonify({"error": "Error al recuperar el catálogo"}), 500

# --- CU-03: CREACIÓN DE NOTICIAS (RESTRINGIDO A ADMIN/REDACTOR) [cite: 81, 109] ---
@app.route('/api/news', methods=['POST'])
def create_news():
    # Roles Permitidos: 1 (Admin), 2 (Redactor) [cite: 78, 81]
    user, error = verify_role_and_session(request, allowed_roles=[1, 2])
    if error:
        return jsonify({"error": error}), 403 if error != "Unauthorized" else 401
    
    data = request.get_json()
    title = sanitize_input(data.get('title')) # [cite: 180] (Prevención XSS)
    content = sanitize_input(data.get('content'))
    category = sanitize_input(data.get('category'))
    main_image = sanitize_input(data.get('main_image'))
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO news (title, content, main_image, category, author_id) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, (title, content, main_image, category, user['id']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Noticia publicada con éxito"}), 201
    except Error:
        return jsonify({"error": "Error de base de datos"}), 500

# --- CU-04: SISTEMA DE COMENTARIOS ---
@app.route('/api/comments', methods=['POST'])
def add_comment():
    user, error = verify_role_and_session(request, allowed_roles=[1, 2, 3, 4]) # Todos pueden comentar
    if error:
        return jsonify({"error": error}), 401
        
    data = request.get_json()
    news_id = data.get('news_id')
    text = sanitize_input(data.get('text'))
    
    if not news_id or not text:
        return jsonify({"error": "Faltan datos"}), 400
        
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO comments (news_id, user_id, texto) VALUES (%s, %s, %s)",
            (news_id, user['id'], text)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Comentario añadido"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500

# ── GET /api/auth/me ────────────────────────────────
# Devuelve los datos del usuario autenticado a partir
# de la cookie session_token. El frontend lo llama al
# cargar cualquier página para saber si hay sesión activa.

@app.route('/api/auth/me', methods=['GET'])
def me():
    user, error = verify_role_and_session(request, allowed_roles=[1, 2, 3, 4])
    if error:
        return jsonify({"error": error}), 401

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, username, email, role_id FROM users WHERE id = %s",
            (user['id'],)
        )
        user_data = cursor.fetchone()
        cursor.close()
        conn.close()

        if not user_data:
            return jsonify({"error": "Usuario no encontrado"}), 404

        return jsonify(user_data), 200

    except Error as e:
        return jsonify({"error": "Error interno del servidor"}), 500


# ── POST /api/logout ─────────────────────────────────
# Cierra la sesión eliminando la cookie session_token.
# El frontend redirige al login tras recibir 200.

@app.route('/api/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"message": "Sesión cerrada"}))
    response.delete_cookie('session_token')
    return response, 200


# ── GET /api/news ────────────────────────────────────
# Lista noticias publicadas con soporte de paginación
# y filtrado por categoría.
# Query params:
#   category (str, opcional) — filtra por categoría
#   page     (int, default 1)
#
# Respuesta:
#   { news: [...], page: int, total: int }

@app.route('/api/news', methods=['GET'])
def get_news():
    category = request.args.get('category')
    page     = int(request.args.get('page', 1))
    limit    = 10
    offset   = (page - 1) * limit

    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Consulta principal con filtro opcional
        query  = """
            SELECT n.id, n.title, n.main_image, n.category,
                   n.created_at, u.username AS author
            FROM news n
            JOIN users u ON n.author_id = u.id
            WHERE 1=1
        """
        params = []

        if category:
            query += " AND n.category = %s"
            params.append(category)

        query += " ORDER BY n.created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(query, tuple(params))
        news_list = cursor.fetchall()

        # Total para paginación
        count_query = "SELECT COUNT(*) AS total FROM news WHERE 1=1"
        count_params = []
        if category:
            count_query += " AND category = %s"
            count_params.append(category)
        cursor.execute(count_query, tuple(count_params))
        total = cursor.fetchone()['total']

        cursor.close()
        conn.close()

        return jsonify({"news": news_list, "page": page, "total": total}), 200

    except Error as e:
        return jsonify({"error": "Error al recuperar noticias"}), 500


# ── GET /api/news/<id> ───────────────────────────────
# Devuelve una noticia completa por su ID, incluyendo
# el cuerpo del artículo y sus comentarios.
# Usado por la página de detalle de noticia.
#
# Respuesta:
#   { id, title, content, main_image, category,
#     created_at, author, comments: [...] }

@app.route('/api/news/<int:news_id>', methods=['GET'])
def get_news_by_id(news_id):
    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Noticia principal
        cursor.execute("""
            SELECT n.id, n.title, n.content, n.main_image,
                   n.category, n.created_at, u.username AS author
            FROM news n
            JOIN users u ON n.author_id = u.id
            WHERE n.id = %s
        """, (news_id,))
        news = cursor.fetchone()

        if not news:
            cursor.close()
            conn.close()
            return jsonify({"error": "Noticia no encontrada"}), 404

        # Comentarios asociados
        cursor.execute("""
            SELECT c.id, c.texto AS text, c.created_at,
                   u.username AS author
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.news_id = %s
            ORDER BY c.created_at DESC
        """, (news_id,))
        news['comments'] = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(news), 200

    except Error:
        return jsonify({"error": "Error interno del servidor"}), 500


# ── GET /api/posts ───────────────────────────────────
# Lista posts del blog con soporte de paginación
# y filtrado por categoría.
# Query params:
#   category (str, opcional)
#   page     (int, default 1)
#
# Respuesta:
#   { posts: [...], page: int, total: int }

@app.route('/api/posts', methods=['GET'])
def get_posts():
    category = request.args.get('category')
    page     = int(request.args.get('page', 1))
    limit    = 9
    offset   = (page - 1) * limit

    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query  = """
            SELECT p.id, p.title, p.excerpt, p.main_image,
                   p.category, p.created_at, p.reading_time,
                   u.username AS author,
                   COUNT(c.id) AS comment_count
            FROM posts p
            JOIN users u ON p.author_id = u.id
            LEFT JOIN post_comments c ON c.post_id = p.id
            WHERE p.status = 'published'
        """
        params = []

        if category:
            query += " AND p.category = %s"
            params.append(category)

        query += """
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT %s OFFSET %s
        """
        params.extend([limit, offset])

        cursor.execute(query, tuple(params))
        posts = cursor.fetchall()

        # Total para paginación
        count_query = """
            SELECT COUNT(*) AS total FROM posts
            WHERE status = 'published'
        """
        count_params = []
        if category:
            count_query += " AND category = %s"
            count_params.append(category)

        cursor.execute(count_query, tuple(count_params))
        total = cursor.fetchone()['total']

        cursor.close()
        conn.close()
        return jsonify({"posts": posts, "page": page, "total": total}), 200

    except Error:
        return jsonify({"error": "Error al recuperar posts"}), 500


# ── GET /api/posts/<id> ──────────────────────────────
# Devuelve un post completo con su contenido y
# los comentarios asociados.
# Usado por post.html
#
# Respuesta:
#   { id, title, content, excerpt, main_image, category,
#     reading_time, created_at, author, comments: [...] }

@app.route('/api/posts/<int:post_id>', methods=['GET'])
def get_post_by_id(post_id):
    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Post principal
        cursor.execute("""
            SELECT p.id, p.title, p.content, p.excerpt,
                   p.main_image, p.category, p.reading_time,
                   p.created_at, u.username AS author,
                   u.id AS author_id
            FROM posts p
            JOIN users u ON p.author_id = u.id
            WHERE p.id = %s AND p.status = 'published'
        """, (post_id,))
        post = cursor.fetchone()

        if not post:
            cursor.close()
            conn.close()
            return jsonify({"error": "Post no encontrado"}), 404

        # Comentarios del post
        cursor.execute("""
            SELECT c.id, c.text, c.created_at,
                   u.username AS author
            FROM post_comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = %s
            ORDER BY c.created_at DESC
        """, (post_id,))
        post['comments'] = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(post), 200

    except Error:
        return jsonify({"error": "Error interno del servidor"}), 500

# ── GET /api/events ──────────────────────────────────
# Lista eventos del sector (lanzamientos, ferias,
# convenciones) con soporte de filtrado por tipo
# y rango de fechas.
# Query params:
#   type       (str, opcional) — 'lanzamiento' | 'feria' | 'convencion'
#   year       (int, opcional) — filtra por año
#   month      (int, opcional) — filtra por mes
#
# Respuesta:
#   { events: [...] }

@app.route('/api/events', methods=['GET'])
def get_events():
    event_type = request.args.get('type')
    year       = request.args.get('year',  type=int)
    month      = request.args.get('month', type=int)

    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query  = """
            SELECT id, name, event_type, event_date,
                   location, description
            FROM events
            WHERE 1=1
        """
        params = []

        if event_type:
            query += " AND event_type = %s"
            params.append(event_type)
        if year:
            query += " AND YEAR(event_date) = %s"
            params.append(year)
        if month:
            query += " AND MONTH(event_date) = %s"
            params.append(month)

        query += " ORDER BY event_date ASC"

        cursor.execute(query, tuple(params))
        events = cursor.fetchall()

        # Serializar fechas a string ISO para JSON
        for ev in events:
            if ev.get('event_date'):
                ev['event_date'] = ev['event_date'].isoformat()

        cursor.close()
        conn.close()
        return jsonify({"events": events}), 200

    except Error:
        return jsonify({"error": "Error al recuperar eventos"}), 500


# ── GET /api/games/<id> ──────────────────────────────
# Devuelve la ficha completa de un juego por su ID.
# Usado por la página de detalle de juego (juego.html).
#
# Respuesta:
#   { id, title, genre, platform, year,
#     press_score, community_score, description,
#     cover_image, trailer_url }

@app.route('/api/games/<int:game_id>', methods=['GET'])
def get_game_by_id(game_id):
    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, title, genre, platform, year,
                   press_score, community_score,
                   description, cover_image, trailer_url
            FROM games
            WHERE id = %s
        """, (game_id,))
        game = cursor.fetchone()

        cursor.close()
        conn.close()

        if not game:
            return jsonify({"error": "Juego no encontrado"}), 404

        return jsonify(game), 200

    except Error:
        return jsonify({"error": "Error interno del servidor"}), 500


# ── GET /api/dashboard/me ────────────────────────────
# Devuelve los datos del dashboard del usuario
# autenticado: KPIs, actividad reciente, favoritos
# y recomendaciones.
# Requiere sesión activa (cualquier rol).
#
# Respuesta:
#   {
#     user: { id, username, role_id },
#     kpis: { comments, favorites, following, saved_events },
#     recent_activity: [...],
#     last_comments: [...],
#     favorites: [...],
#     recommendations: [...]
#   }

@app.route('/api/dashboard/me', methods=['GET'])
def get_dashboard():
    user, error = verify_role_and_session(request, allowed_roles=[1, 2, 3, 4])
    if error:
        return jsonify({"error": error}), 401

    user_id = user['id']

    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # KPI: total comentarios del usuario
        cursor.execute(
            "SELECT COUNT(*) AS total FROM comments WHERE user_id = %s",
            (user_id,)
        )
        comment_count = cursor.fetchone()['total']

        # KPI: total favoritos
        cursor.execute(
            "SELECT COUNT(*) AS total FROM favorites WHERE user_id = %s",
            (user_id,)
        )
        fav_count = cursor.fetchone()['total']

        # KPI: usuarios que sigue
        cursor.execute(
            "SELECT COUNT(*) AS total FROM follows WHERE follower_id = %s",
            (user_id,)
        )
        following_count = cursor.fetchone()['total']

        # KPI: eventos guardados
        cursor.execute(
            "SELECT COUNT(*) AS total FROM saved_events WHERE user_id = %s",
            (user_id,)
        )
        saved_events_count = cursor.fetchone()['total']

        # Actividad reciente: últimas publicaciones de usuarios que sigue
        cursor.execute("""
            SELECT u.username AS author, n.title, n.created_at
            FROM news n
            JOIN users u ON n.author_id = u.id
            WHERE n.author_id IN (
                SELECT followed_id FROM follows WHERE follower_id = %s
            )
            ORDER BY n.created_at DESC
            LIMIT 4
        """, (user_id,))
        recent_activity = cursor.fetchall()

        # Últimos comentarios del usuario
        cursor.execute("""
            SELECT c.texto AS text, c.created_at,
                   n.title AS post_title, n.id AS post_id
            FROM comments c
            JOIN news n ON c.news_id = n.id
            WHERE c.user_id = %s
            ORDER BY c.created_at DESC
            LIMIT 3
        """, (user_id,))
        last_comments = cursor.fetchall()

        # Juegos favoritos
        cursor.execute("""
            SELECT g.id, g.title, g.cover_image,
                   g.community_score
            FROM favorites f
            JOIN games g ON f.game_id = g.id
            WHERE f.user_id = %s
            ORDER BY f.created_at DESC
            LIMIT 4
        """, (user_id,))
        favorites = cursor.fetchall()

        # Recomendaciones: juegos mejor valorados que el usuario
        # no tiene en favoritos
        cursor.execute("""
            SELECT id, title, cover_image, community_score
            FROM games
            WHERE id NOT IN (
                SELECT game_id FROM favorites WHERE user_id = %s
            )
            ORDER BY community_score DESC
            LIMIT 3
        """, (user_id,))
        recommendations = cursor.fetchall()

        # Serializar fechas
        for item in recent_activity + last_comments:
            if item.get('created_at'):
                item['created_at'] = item['created_at'].isoformat()

        cursor.close()
        conn.close()

        return jsonify({
            "user": {
                "id":      user_id,
                "role_id": user['role_id']
            },
            "kpis": {
                "comments":     comment_count,
                "favorites":    fav_count,
                "following":    following_count,
                "saved_events": saved_events_count
            },
            "recent_activity": recent_activity,
            "last_comments":   last_comments,
            "favorites":       favorites,
            "recommendations": recommendations
        }), 200

    except Error as e:
        return jsonify({"error": "Error interno del servidor", "details": str(e)}), 500


# ── POST /api/favorites ──────────────────────────────
# Añade un juego a favoritos del usuario autenticado.
# Requiere sesión activa (cualquier rol).
# Body: { game_id: int }
#
# Respuesta:
#   { message: "Añadido a favoritos" }
# Errores:
#   400 — ya existe en favoritos
#   401 — no autenticado

@app.route('/api/favorites', methods=['POST'])
def add_favorite():
    user, error = verify_role_and_session(request, allowed_roles=[1, 2, 3, 4])
    if error:
        return jsonify({"error": error}), 401

    data    = request.get_json()
    game_id = data.get('game_id')

    if not game_id:
        return jsonify({"error": "Falta game_id"}), 400

    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Comprobar si ya existe
        cursor.execute(
            "SELECT id FROM favorites WHERE user_id = %s AND game_id = %s",
            (user['id'], game_id)
        )
        if cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Ya está en favoritos"}), 400

        cursor.execute(
            "INSERT INTO favorites (user_id, game_id) VALUES (%s, %s)",
            (user['id'], game_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Añadido a favoritos"}), 201

    except Error:
        return jsonify({"error": "Error interno del servidor"}), 500


# ── DELETE /api/favorites/<game_id> ──────────────────
# Elimina un juego de favoritos del usuario autenticado.
# Requiere sesión activa (cualquier rol).
#
# Respuesta:
#   { message: "Eliminado de favoritos" }
# Errores:
#   404 — no estaba en favoritos
#   401 — no autenticado

@app.route('/api/favorites/<int:game_id>', methods=['DELETE'])
def remove_favorite(game_id):
    user, error = verify_role_and_session(request, allowed_roles=[1, 2, 3, 4])
    if error:
        return jsonify({"error": error}), 401

    try:
        conn   = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "DELETE FROM favorites WHERE user_id = %s AND game_id = %s",
            (user['id'], game_id)
        )
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "No estaba en favoritos"}), 404

        cursor.close()
        conn.close()
        return jsonify({"message": "Eliminado de favoritos"}), 200

    except Error:
        return jsonify({"error": "Error interno del servidor"}), 500


# ── GET /api/admin/users ─────────────────────────────
# Lista todos los usuarios registrados.
# Restringido a rol 1 (Admin).
# Query params:
#   page     (int, default 1)
#   role_id  (int, opcional) — filtra por rol
#   search   (str, opcional) — busca por username o email
#
# Respuesta:
#   { users: [...], page: int, total: int }

@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    user, error = verify_role_and_session(request, allowed_roles=[1])
    if error:
        return jsonify({"error": error}), 403 if error != "Unauthorized" else 401

    page   = int(request.args.get('page', 1))
    limit  = 20
    offset = (page - 1) * limit
    role_filter = request.args.get('role_id', type=int)
    search      = request.args.get('search', '').strip()

    try:
        conn   = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query  = """
            SELECT u.id, u.username, u.email, u.role_id,
                   u.status, u.created_at, u.last_login,
                   u.failed_attempts
            FROM users u
            WHERE 1=1
        """
        params = []

        if role_filter:
            query += " AND u.role_id = %s"
            params.append(role_filter)
        if search:
            query += " AND (u.username LIKE %s OR u.email LIKE %s)"
            like = f"%{search}%"
            params.extend([like, like])

        query += " ORDER BY u.created_at DESC LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(query, tuple(params))
        users = cursor.fetchall()

        # Serializar fechas
        for u in users:
            for field in ('created_at', 'last_login'):
                if u.get(field):
                    u[field] = u[field].isoformat()

        # Total
        count_query  = "SELECT COUNT(*) AS total FROM users WHERE 1=1"
        count_params = []
        if role_filter:
            count_query += " AND role_id = %s"
            count_params.append(role_filter)
        if search:
            count_query += " AND (username LIKE %s OR email LIKE %s)"
            like = f"%{search}%"
            count_params.extend([like, like])

        cursor.execute(count_query, tuple(count_params))
        total = cursor.fetchone()['total']

        cursor.close()
        conn.close()
        return jsonify({"users": users, "page": page, "total": total}), 200

    except Error:
        return jsonify({"error": "Error interno del servidor"}), 500

# ── PUT /api/admin/users/<id>/role ───────────────────
# Cambia el rol de un usuario.
# Restringido a rol 1 (Admin).
# Body: { role_id: int }
# Roles válidos: 1 (Admin), 2 (Redactor), 3 (Suscriptor), 4 (Invitado)
#
# Respuesta:
#   { message: "Rol actualizado" }
# Errores:
#   400 — rol inválido o intento de cambiar el propio rol
#   404 — usuario no encontrado

@app.route('/api/admin/users/<int:target_id>/role', methods=['PUT'])
def admin_change_role(target_id):
    user, error = verify_role_and_session(request, allowed_roles=[1])
    if error:
        return jsonify({"error": error}), 403 if error != "Unauthorized" else 401

    # Un admin no puede cambiar su propio rol
    if user['id'] == target_id:
        return jsonify({"error": "No puedes cambiar tu propio rol"}), 400

    data    = request.get_json()
    role_id = data.get('role_id')

    if role_id not in [1, 2, 3, 4]:
        return jsonify({"error": "Rol inválido"}), 400

    try:
        conn   = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE users SET role_id = %s WHERE id = %s",
            (role_id, target_id)
        )
        conn.commit()

        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Usuario no encontrado"}), 404

        cursor.close()
        conn.close()
        return jsonify({"message": "Rol actualizado"}), 200

    except Error:
        return jsonify({"error": "Error interno del servidor"}), 500
        

if __name__ == '__main__':
    app.run(debug=True, port=5000)
