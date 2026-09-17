// 4/4 small files for item sql
const { Router } = require("express");
const controller = require("../controllers/itemController");

const router = Router();
router.get("/", controller.listItems);

// The item route
router.get("/new", controller.createItemGet);
router.post("/new", controller.createItemPost);

router.get("/:id", controller.itemDetail);
router.get("/:id/edit", controller.updateItemGet);
router.post("/:id/edit", controller.updateItemPost);
router.post("/:id/delete", controller.deleteItem);
module.exports = router;