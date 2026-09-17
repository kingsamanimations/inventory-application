// 3/4 small files for category sql
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

// Extracting validator for items
const validateItem = [
    body("name").trim().notEmpty().withMessage("Name is required")
        .isLength({ max: 100 }).withMessage("Name must be under 100 characters").escape(),
    body("description").trim().escape(),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a postive number"),
    body("quantity").isInt({ min: 0 }).withMessage("Quantity must be a postive number"),
    body("category_id").isInt().withMessage("Please choose a category")
]

// Controllers for queries
exports.listCategories = async (req, res) => {
    const categories = await db.getAllCategories();
    res.render("categories/index", { categories });
};

exports.categoryDetail = async (req, res) => {
    const category = await db.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).send("Category not found");
    }

    const items = await db.getItemsByCategory(category.id);
    res.render("categories/detail", { category, items });
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    const items = await db.getItemsByCategory(req.params.id);
    if (items.length > 0) {
        const category = await db.getCategoryById(req.params.id);
        return res.render("categories/detail", { category, items, error: `Cannot delete - ${items.length} item(s) still in category` });
    }

    await db.deleteCategory(req.params.id);
    res.redirect("/categories");
};

// function for the get handler and val
exports.createCategoryGet = (req, res) => {
    res.render("categories/form", {
        title: "New Category",
        category: {},
        errors: [],
    });
};


// function for the post handler and val
exports.createCategoryPost = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 100 }).withMessage("Name must be under 100 characters")
        .escape(),
    body("description").trim().escape(),

    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("categories/form", {
                title: "New Category",
                category: req.body,
                errors: errors.array()
            });
        }

        await db.createCategory(req.body.name, req.body.description);
        res.redirect("/categories");
    },
];

// Functions for updating categories (get & post)
exports.updateCategoryGet = async (req, res) => {
    const category = await db.getCategoryById(req.params.id);
    if (!category) return res.status(404).send("Category not found");
    res.render("categories/form", {
        title: "Edit Category",
        category,
        errors: []
    });
};

exports.updateCategoryPost = [
    body("name").trim().notEmpty().withMessage("Name is required")
        .isLength({ max: 100 }).withMessage("Name must be under 100 characters").escape(),
    body("description").trim().escape(),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("categories/form", {
                title: "Edit Category",
                category: { ...req.body, id: req.params.id },
                errors: errors.array()
            });
        }

        await db.updateCategory(req.params.id, req.body.name, req.body.description);
        res.redirect(`/categories/${req.params.id}`);
    }
]