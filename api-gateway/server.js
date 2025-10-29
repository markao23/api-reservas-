const express = require('express');
const axios = require('axios'); // Para fazer chamadas HTTP
const helmet = require('helmet');

const app = express();
app.use(express.json());
// REMOVA a linha app.use(helmet()); e substitua por isto:

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"], // Permite carREgar tudo do seu próprio domínio
            scriptSrc: ["'self'"],  // Permite scripts do seu domínio
            styleSrc: ["'self'"],   // Permite CSS do seu domínio
            imgSrc: ["'self'"],     // Permite IMAGENS (como o favicon.ico) do seu domínio
            // Se você usa fontes do Google ou outro CDN, adicione-os aqui
            // Ex: fontSrc: ["'self'", "https://fonts.gstatic.com"]
        },
    })
);

// ... (Continue com o resto das suas configurações do app)
// Nomes dos serviços como definidos no docker-compose.yml
// O Docker tem um DNS interno:
const RECURSOS_API = 'http://servico-recursos:3001';
const RESERVAS_API = 'http://servico-reservas:3002';

/**
 * ESTE É O SEU ENTREGÁVEL FUNCIONAL
 * GET /resources/:id/availability
 */
app.get('/resources/:id/availability', async (req, res) => {
    try {
        const { id } = req.params;
        const { start, end } = req.query; // (Pegamos, mas a lógica simples não usa)

        // 1. Pergunta ao 'servico-recursos' pela capacidade
        const resourcePromise = axios.get(`${RECURSOS_API}/internal/resource/${id}`);

        // 2. Pergunta ao 'servico-reservas' pela contagem
        const reservationPromise = axios.get(
            `${RESERVAS_API}/internal/reservations/count?resource_id=${id}`
        );

        // Roda as duas perguntas em paralelo
        const [resourceResponse, reservationResponse] = await Promise.all([
            resourcePromise,
            reservationPromise,
        ]);

        const { capacity } = resourceResponse.data;
        const { count: confirmedCount } = reservationResponse.data;

        // 3. Junta as respostas
        const availableSpots = capacity - confirmedCount;

        return res.status(200).json({
            resource_id: id,
            requested_start: start || null,
            requested_end: end || null,
            total_capacity: capacity,
            active_reservations: confirmedCount,
            available_spots: availableSpots,
            is_available: availableSpots > 0,
        });

    } catch (error) {
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }
        return res.status(500).json({ error: 'Erro interno do gateway', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway rodando na porta ${PORT}`);
});