const axios = require('axios')
const URL_API = 'http://localhost:3000/reservas';

const payloadDaReserva = {
    idHospede: "HOSP-OVERBOOK",
    idQuarto: "QRT-SUITE-PRESIDENCIAL", // O quarto que será duplamente reservado
    dataCheckin: "2026-08-01",
    dataCheckout: "2026-08-05"
};

async function fazerRequisicao(id) {
    try {
        const response = await axios.post(URL_API, payloadDaReserva);
        console.log(`✅ Sucesso na Requisição #${id}! Status: ${response.status}, Mensagem: ${response.data.mensagem}`);
    } catch (error) {
        console.error(`❌ Falha na Requisição #${id}! Status: ${error.response.status}, Mensagem: ${error.response.data.mensagem}`);
    }
}

async function iniciarTesteDeOverbooking() {
    console.log('--- Iniciando teste de Overbooking com 2 requisições simultâneas ---');

    // Promise.all dispara as duas requisições em paralelo, simulando a corrida
    await Promise.all([
        fazerRequisicao(1),
        fazerRequisicao(2)
    ]);

    console.log('\n--- Teste finalizado! Verifique os resultados. ---');
}

iniciarTesteDeOverbooking();
