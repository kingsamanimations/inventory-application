// 4/4 small files for category sql
const { Router } = require("express");
const controller = require("../controllers/categoryController");

const router = Router();

const requireAdmin = require("../middleware/requireAdmin");

router.get("/", controller.listCategories);

// The form route
router.get("/new", controller.createCategoryGet);
router.post("/new", requireAdmin, controller.createCategoryPost);

router.get("/:id", controller.categoryDetail);
router.get("/:id/edit", controller.updateCategoryGet);
router.post("/:id/edit", requireAdmin, controller.updateCategoryPost);

// The deleting route
router.post("/:id/delete", requireAdmin, controller.deleteCategory);
module.exports = router;
