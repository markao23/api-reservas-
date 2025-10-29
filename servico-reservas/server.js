const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('swaggerConfig')
const app = express();
const routes = require('./src/reservations.routes');

app.use(express.json());
app.use(routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3002, () => console.log('Servico-Reservas rodando'));