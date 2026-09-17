// 2/4 small files for sql
const pool = require("./pool");

async function getAllCategories() {
    const { rows } = await pool.query("SELECT * FROM categories");
    return rows;
}

async function getCategoryById(id) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    return rows[0];
}

async function getItemsByCategory(categoryId) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1 ORDER BY name", [categoryId]);
    return rows;
}

// Select all the items, categories by name and join categories on the items' category id and order by the items' name
async function getAllItems() {
    const { rows } = await pool.query(`
        SELECT items. *, categories.name AS category_name
        FROM items
        JOIN categories ON items.category_id = categories.id
        ORDER BY items.name
    `);
    return rows;
}

// Same thing but where the items' id is one dollar
async function getItemById(id) {
    const { rows } = await pool.query(`
        SELECT items. *, categories.name AS category_name
        FROM items
        JOIN categories ON items.category_id = categories.id
        WHERE items.id = $1
    `, [id]);
    return rows[0];
}

//Deletion
async function deleteCategory(id) {
    await pool.query(" DELETE FROM categories WHERE id = $1");
}
async function deleteItem(id) {
    await pool.query(" DELETE FROM items WHERE id = $1");
}

//Form
async function createCategory(name, description) {
    await pool.query(
        "INSERT INTO categories (name, description) VALUES ($1, $2)",
        [name, description]
    );
}

// Update functions
async function updateCategory(name, description) {
    await pool.query(
        "UPDATE categories SET name = $1, description = $2 WHERE id = $3",
        [name, description, id]
    );
}

// Items
async function createItem(name, description, price, quantity, categoryId) {
    const { rows } = await pool.query(`
        INSERT items (name, description, price, quantity, category_id) 
        VALUES ($1, $2, $3, $4, $5)`,
        [name, description, price, quantity, categoryId]
    );
}

async function updateItem(id, name, description, price, quantity, categoryId) {
    await pool.query(`
        UPDATE items
        SET name = $1, description = $2, price = $3, quantity = $4, category_id = $5
        WHERE id = $6
        `, [name, description, price, quantity, categoryId, id]
    );
}

async function deleteItem(id) {
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
}

module.exports = { 
    getAllCategories, 
    getCategoryById, 
    getItemsByCategory,
    createCategory,
    updateCategory,
    deleteCategory, 
    getAllItems, 
    getItemById,
    createItem,
    updateItem,
    deleteItem,
};