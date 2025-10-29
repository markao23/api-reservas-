const express = require('express');
const controller = require('./resources.controller');
const router = express.Router();
// Rota INTERNA que o Gateway vai chamar

/**
 * @swagger
 * tags:
 * name: Interno
 * description: Rotas internas para comunicação entre serviços (ex: Gateway)
 */

/**
 * @swagger
 * /internal/resource/{id}:
 * get:
 * summary: Busca informação de um recurso específico pelo ID (Rota Interna)
 * description: Rota interna utilizada pelo API Gateway ou outros serviços para obter detalhes de um recurso.
 * tags: [Interno]
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: integer
 * required: true
 * description: O ID do recurso a ser buscado.
 * responses:
 * 200:
 * description: Retorna os detalhes do recurso.
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Resource'
 * 404:
 * description: Recurso não encontrado.
 * 500:
 * description: Erro interno do servidor.
 */
router.get('/internal/resource/:id', controller.handleGetResourceInfo);

module.exports = router;