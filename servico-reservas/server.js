const express = require('express');
const app = express();
// Linha 3 (corrigida):
const routes = require('./src/reservations.routes');
app.use(express.json());
app.use(routes);
app.listen(3002, () => console.log('Servico-Reservas rodando'));