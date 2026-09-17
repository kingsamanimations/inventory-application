-- Drops so file is rerunnable
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;


CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
);

-- Categories (Anything you want) 
INSERT INTO categories (name, description) VALUES
 ('Pencil', 'Sharp for sketches'),
 ('Paperbook', '200 A-4 paperbook');