const express = require('express');
const controller = require('./reservations.controller');
const router = express.Router();
// Rota INTERNA que o Gateway vai chamar
// GET /internal/reservations/count?resource_id=...
router.get('/internal/reservations/count', controller.handleCountReservations);
module.exports = router;