// 3/4 small files for item sql
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

exports.listItems = async (req, res) => {
  const items = await db.getAllItems();
  console.log("ITEMS:", items);
  res.render("items/index", { items });
};

// Extracting validator for items
const validateItem = [
    body("name").trim().notEmpty().withMessage("Name is required")
        .isLength({ max: 100 }).withMessage("Name must be under 100 characters").escape(),
    body("description").trim().escape(),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a postive number"),
    body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a postive number"),
    body("category_id").isInt().withMessage("Please choose a category")
]

exports.itemDetail = async (req, res) => {
    const item = await db.getItemById(req.params.id);
    if (!item) {
        return res.status(404).send("Item not found");
    }
    res.render("items/detail", { item });
}

// Functions for creating items (Get & Post)
exports.createItemGet = async (req, res) => {
    const categories = await db.getAllCategories();
    res.render("items/form", {
        title: "New Item",
        item: {},
        categories,
        errors: [],
    });
};

exports.createItemPost = [
    ...validateItem,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const categories = await db.getAllCategories();
            return res.status(400).render("items/form", {
                title: "New Item",
                item: req.body,
                categories,
                errors: errors.array(),
            });
        }
        const { name, description, price, quantity, category_id} = req.body;
        await db.createItem(name, description, price, quantity, category_id);
        res.redirect("/items");
    },
];

// Functions for updating items (get & post)
exports.updateItemGet = async (req, res) => {
    const [item, categories] = await Promise.all([
        db.getItemById(req.params.id),
        db.getAllCategories(),
    ]);
    
    if (!item) return res.status(404).send("Item not found");
    res.render("items/form", {
        title: "Edit Item",
        item,
        categories,
        errors: []
    });
};

exports.updateItemPost = [
    ...validateItem,
    async (req, res) => {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            const categories = await db.getAllCategories();
            return res.status(400).render("items/form", {
                title: "Edit Item",
                item: { ...req.body, id: req.params.id },
                categories,
                errors: errors.array()
            });
        }

        const { name, description, price, quantity, category_id} = req.body;
        await db.updateItem(req.params.id, name, description, price, quantity, category_id);
        res.redirect(`/categories/${req.params.id}`);
    }
]

exports.deleteItem = async (req, res) => {
    await db.deleteItem(req.params.id);
    res.redirect("/items");
}