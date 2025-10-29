const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Recursos',
            version: '1.0.0',
            description: 'Documentação da API para o microserviço de Recursos',
        },
        servers: [
            {
                url: 'http://localhost:3002', // Altere para a porta do seu servico-recursos
                description: 'Servidor de Desenvolvimento',
            },
        ],
    },
    apis: ['./src/*.routes.js'], // Ajuste o padrão se suas rotas estiverem em outro lugar
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;