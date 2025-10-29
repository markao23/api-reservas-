const express = require('express');
const controller = require('./reservations.controller');
const router = express.Router();

/**
 * @swagger
 * /recursos/{id}:
 * get:
 * summary: Busca um recurso específico pelo ID
 * tags: [Recursos]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: O ID numérico do recurso
 * responses:
 * 200:
 * description: Recurso encontrado com sucesso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Recurso'
 * 404:
 * description: Recurso não encontrado.
 * 500:
 * description: Erro no servidor.
 */
router.get('/internal/reservations/count', controller.handleCountReservations);
module.exports = router;