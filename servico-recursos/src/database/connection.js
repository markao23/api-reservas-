// src/database/connection.js  (VERSÃO CORRETA)

const knex = require('knex');
const configuration = require('../../knexfile'); // Carrega o knexfile.js

// LINHA 4 (CORRIGIDA): Passa a configuração direto
const connection = knex(configuration);

module.exports = connection;