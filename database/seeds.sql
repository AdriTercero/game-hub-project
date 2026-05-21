USE game_hub_db;

-- Inserción de Roles Obligatorios [cite: 78-83]
INSERT INTO roles (id, role_name) VALUES 
(1, 'Administrador'),
(2, 'Redactor'),
(3, 'Suscriptor'),
(4, 'Colaborador');

-- Inserción de Usuarios de Prueba (Las contraseñas reales deben ir hasheadas por seguridad) [cite: 177]
-- Contraseña en texto plano para pruebas: "Secret123*" (se guarda el hash simulado de 60 chars)
INSERT INTO users (username, email, password_hash, role_id) VALUES 
('admin_hub', 'admin@gamehub.com', '$2b$12$K3v0KJKX7b8YhE9vXv5u9e3Z2Wp1M2r3s4t5u6v7w8x9y0z1a2b3c', 1),
('periodista_gamer', 'redactor@gamehub.com', '$2b$12$K3v0KJKX7b8YhE9vXv5u9e3Z2Wp1M2r3s4t5u6v7w8x9y0z1a2b3c', 2),
('user_demo', 'user@gmail.com', '$2b$12$K3v0KJKX7b8YhE9vXv5u9e3Z2Wp1M2r3s4t5u6v7w8x9y0z1a2b3c', 3);

-- Inserción de Videojuegos de Prueba [cite: 95]
INSERT INTO games (title, description, genre, platform, cover_image, press_rating, community_rating, release_year) VALUES 
('Elden Ring', 'Un juego de rol de acción de fantasía oscura.', 'RPG', 'PC, PS5, Xbox', 'elden_ring.jpg', 9.5, 9.7, 2022),
('Cyberpunk 2077', 'Un RPG de acción de mundo abierto en Night City.', 'Sci-Fi', 'PC, PS5', 'cyberpunk.jpg', 8.0, 8.5, 2020),
('Hollow Knight', 'Una aventura de acción clásica en 2D en un vasto mundo interconectado.', 'Metroidvania', 'PC, Switch', 'hollow_knight.jpg', 9.0, 9.2, 2017);

-- Inserción de Noticias [cite: 108]
INSERT INTO news (title, content, main_image, category, author_id) VALUES 
('Lanzamiento del nuevo DLC', 'Detalles completos de la expansión de contenido...', 'dlc_news.jpg', 'Noticia', 2),
('Análisis en profundidad de la industria', 'Evaluación de las métricas económicas del año...', 'analysis.jpg', 'Análisis', 2);