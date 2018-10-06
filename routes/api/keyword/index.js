const router = require("express").Router();
const controller = require("./keyword.controller");

router.post("/register", controller.register);
router.get("/keywords", controller.keywords);

module.exports = router;
