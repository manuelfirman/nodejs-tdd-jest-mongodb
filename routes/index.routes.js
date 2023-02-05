// RUTAS GLOBALES
const router = require("express").Router();

router.use("/api", require("./api/index.api.routes"));

module.exports = router;

