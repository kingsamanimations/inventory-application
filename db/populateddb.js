// The Seed Script
require("dotenv").config();
const { Client } = require("pg");

const SQL = `
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

INSERT INTO categories (name, description) VALUES
    ('Pencils', 'Colourful, and gradient'),
    ('Papers', 'Sheets, pads and notebooks'),
    ('Pens','Ballpoint, sharp, gel, and fountain');
    
INSERT INTO items (name, description, price, quantity, category_id) VALUES
    ('HB Pencil', 'Standing writing pencil', 0.80, 120, (SELECT id FROM categories WHERE name = 'Pencils')),
    ('A4 Paper Ream','500 sheets, 80gsm', 6.50, 40, (SELECT id FROM categories WHERE name = 'Papers')),
    ('Gel Pen','Smooth 0.5mm black', 2.10, 85, (SELECT id FROM categories WHERE name = 'Pens'))
`;

async function main() {
    console.log("seeding...");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

console.log(SQL.slice(820, 920));

main();