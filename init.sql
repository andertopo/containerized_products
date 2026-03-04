CREATE TABLE tbl_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    priority SMALLINT,
    create_date DATE DEFAULT CURRENT_DATE,
    metadata JSONB
);

CREATE TABLE tbl_products (
    sku UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id INTEGER REFERENCES tbl_categories(id),
    product_name TEXT NOT NULL,
    price NUMERIC(10,2),
    current_stock INTEGER DEFAULT 0,
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags TEXT[]
);


INSERT INTO tbl_categories (name, description, is_active, priority, create_date, metadata)
VALUES 
('Laptops', 'Computadoras portátiles para oficina y gaming', true, 1, '2026-02-28', '{"garantia_minima": "1 año", "importado": true}'),
('Monitores', 'Pantallas 4K, UltraWide y oficina', true, 2, '2026-02-28', '{"tecnologia": "OLED/IPS"}');

INSERT INTO tbl_products (category_id, product_name, price, current_stock, tags)
VALUES 
((SELECT id FROM tbl_categories WHERE name = 'Laptops'), 'MacBook Air M2', 1200.00, 15, '{"apple", "m2", "silver"}'),
((SELECT id FROM tbl_categories WHERE name = 'Laptops'), 'Dell XPS 13', 1100.50, 8, '{"dell", "windows", "carbon"}'),
((SELECT id FROM tbl_categories WHERE name = 'Monitores'), 'LG UltraGear 27"', 350.00, 20, '{"144hz", "gaming", "ips"}');