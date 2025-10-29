const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Recursos',
            version: '1.0.0',
            description: 'API para gerenciamento de recursos de hospedagem'
        },
        severs: [
            {
                url: 'http://localhost:3001',
                description: 'Servidor de Recursos'
            },
        ],
    },
    apis: ['./src/*.routes.js'],
};

const swaggerSpec = swaggerJSDoc(options)
module.exports = swaggerSpec;