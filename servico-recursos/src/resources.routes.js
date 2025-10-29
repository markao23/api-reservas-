const express = require('express');
const controller = require('./resources.controller');
const router = express.Router();
// Rota INTERNA que o Gateway vai chamar
router.get('/internal/resource/:id', controller.handleGetResourceInfo);
module.exports = router;