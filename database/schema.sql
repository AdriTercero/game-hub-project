-- ═══════════════════════════════════════════════════════
-- GameHub & Services Ecosystem — Schema v2
-- ═══════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS game_hub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE game_hub_db;

-- ── 1. Roles (RBAC) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
    id        INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ── 2. Usuarios ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(100) NOT NULL UNIQUE,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role_id         INT NOT NULL DEFAULT 3,          -- 3 = Suscriptor
    avatar_url      VARCHAR(255) NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status          BOOLEAN DEFAULT TRUE,             -- TRUE = Activo
    failed_attempts INT DEFAULT 0,
    last_login      TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ── 3. Videojuegos ────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    title            VARCHAR(150) NOT NULL,
    description      TEXT NOT NULL,
    genre            VARCHAR(100) NOT NULL,
    platform         VARCHAR(100) NOT NULL,
    cover_image      VARCHAR(255) NULL,
    trailer_url      VARCHAR(255) NULL,
    press_score      DECIMAL(4,1) DEFAULT 0.0,
    community_score  DECIMAL(4,1) DEFAULT 0.0,
    year             INT NOT NULL
) ENGINE=InnoDB;

-- ── 4. Noticias ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS news (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(200) NOT NULL,
    content    TEXT NOT NULL,
    main_image VARCHAR(255) NULL,
    category   VARCHAR(50) NOT NULL,
    author_id  INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 5. Comentarios de noticias ────────────────────────
CREATE TABLE IF NOT EXISTS comments (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    texto      TEXT NOT NULL,
    user_id    INT NOT NULL,
    news_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 6. Posts del blog ─────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    content      TEXT NOT NULL,
    excerpt      VARCHAR(500) NULL,
    main_image   VARCHAR(255) NULL,
    category     VARCHAR(50) NOT NULL,
    status       ENUM('draft','published') DEFAULT 'draft',
    reading_time VARCHAR(20) NULL,
    author_id    INT NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 7. Comentarios del blog ───────────────────────────
CREATE TABLE IF NOT EXISTS post_comments (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    text       TEXT NOT NULL,
    user_id    INT NOT NULL,
    post_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 8. Eventos ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    event_type  ENUM('lanzamiento','feria','convencion') NOT NULL,
    event_date  DATE NOT NULL,
    location    VARCHAR(150) NOT NULL,
    description TEXT NULL,
    official_url VARCHAR(255) NULL
) ENGINE=InnoDB;

-- ── 9. Favoritos ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    game_id    INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_fav (user_id, game_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 10. Seguimientos entre usuarios ──────────────────
CREATE TABLE IF NOT EXISTS follows (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_follow (follower_id, followed_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 11. Eventos guardados ─────────────────────────────
CREATE TABLE IF NOT EXISTS saved_events (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    event_id   INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_saved (user_id, event_id),
    FOREIGN KEY (user_id)  REFERENCES users(id)   ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id)  ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── 12. Mensajes de soporte ───────────────────────────
CREATE TABLE IF NOT EXISTS messages (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    sender_name   VARCHAR(150) NOT NULL,
    contact_email VARCHAR(150) NOT NULL,
    subject       VARCHAR(150) NOT NULL,
    message       TEXT NOT NULL,
    is_read       BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Índices de rendimiento ────────────────────────────
CREATE INDEX idx_games_genre_platform  ON games(genre, platform);
CREATE INDEX idx_games_score           ON games(community_score DESC);
CREATE INDEX idx_news_category_date    ON news(category, created_at DESC);
CREATE INDEX idx_comments_news         ON comments(news_id);
CREATE INDEX idx_post_comments_post    ON post_comments(post_id);
CREATE INDEX idx_posts_category_status ON posts(category, status);
CREATE INDEX idx_events_date_type      ON events(event_date, event_type);
CREATE INDEX idx_favorites_user        ON favorites(user_id);
CREATE INDEX idx_follows_follower      ON follows(follower_id);
