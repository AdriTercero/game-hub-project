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

@app.route('/api/auth/me', methods=['GET'])
def me():
    user, error = verify_role_and_session(request, allowed_roles=[1, 2, 3, 4])
    if error:
        return jsonify({"error": error}), 401
    return jsonify({"id": user['id'], "role_id": user['role_id'], "username": "..."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

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
