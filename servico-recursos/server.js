const express = require('express');
const app = express();
app.use(express.json());

// Importa as rotas de dentro da pasta 'src'
const resourceRoutes = require('./src/resources.routes.js');

// Diz ao Express para usar as rotas
app.use('/api', resourceRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servico-Recursos rodando na porta ${PORT}`);
});