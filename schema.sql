-- Creación de la Base de Datos
CREATE DATABASE IF NOT EXISTS game_hub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE game_hub_db;

-- 1. Tabla de Roles (RBAC) [cite: 47, 78]
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. Tabla de Usuarios [cite: 69]
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE, -- [cite: 71, 86]
    email VARCHAR(150) NOT NULL UNIQUE,    -- [cite: 72, 86]
    password_hash VARCHAR(255) NOT NULL,   -- [cite: 73, 88]
    role_id INT NOT NULL DEFAULT 3,        -- [cite: 74, 87] (Por defecto: Suscriptor)
    avatar_url VARCHAR(255) NULL,          -- [cite: 75]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- [cite: 76]
    status BOOLEAN DEFAULT TRUE,           -- [cite: 77] (True = Activo, False = Suspendido)
    failed_attempts INT DEFAULT 0,         -- [cite: 93] (Mitigación fuerza bruta)
    last_login TIMESTAMP NULL,             -- [cite: 93]
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. Tabla de Videojuegos [cite: 97]
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,          -- [cite: 99]
    description TEXT NOT NULL,             -- [cite: 100]
    genre VARCHAR(100) NOT NULL,           -- [cite: 101]
    platform VARCHAR(100) NOT NULL,        -- [cite: 104]
    cover_image VARCHAR(255) NULL,         -- [cite: 105]
    press_rating DECIMAL(3,2) DEFAULT 0.0, -- [cite: 106]
    community_rating DECIMAL(3,2) DEFAULT 0.0, -- [cite: 107]
    release_year INT NOT NULL
) ENGINE=InnoDB;

-- 4. Tabla de Noticias [cite: 110]
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,          -- [cite: 112]
    content TEXT NOT NULL,                 -- [cite: 113]
    main_image VARCHAR(255) NULL,          -- [cite: 114]
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- [cite: 115]
    category VARCHAR(50) NOT NULL,         -- [cite: 116] (Noticia, Análisis, Guía)
    author_id INT NOT NULL,                -- [cite: 117]
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabla de Comentarios [cite: 142] (Relación de composición lógica fuerte) [cite: 49]
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,                 -- [cite: 144]
    user_id INT NOT NULL,                  -- [cite: 146]
    news_id INT NOT NULL,                  -- [cite: 147]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- [cite: 149]
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabla de Eventos [cite: 128]
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,          -- [cite: 134]
    start_date DATE NOT NULL,              -- [cite: 136]
    end_date DATE NOT NULL,                -- [cite: 138]
    location VARCHAR(150) NOT NULL,        -- [cite: 139]
    official_url VARCHAR(255) NULL         -- [cite: 139]
) ENGINE=InnoDB;

-- 7. Tabla de Mensajes de Soporte [cite: 152]
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_name VARCHAR(150) NOT NULL,     -- [cite: 154]
    contact_email VARCHAR(150) NOT NULL,   -- [cite: 156]
    subject VARCHAR(150) NOT NULL,          -- [cite: 157]
    message TEXT NOT NULL,                 -- [cite: 158]
    is_read BOOLEAN DEFAULT FALSE,         -- [cite: 159]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --- INDEXACIÓN PARA OPTIMIZACIÓN DE RENDIMIENTO (RNF-02)  ---
CREATE INDEX idx_games_genre_platform ON games(genre, platform);
CREATE INDEX idx_news_category_date ON news(category, published_at DESC);
CREATE INDEX idx_comments_news ON comments(news_id);