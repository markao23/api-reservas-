# Documentação da API de reservas de um hotel

**Versão:** 1.0 <br>
**Data:** 14/09/2025

## Visão geral
Esta documentação detalha os recursos da API de Reservas de Hotel, um sistema projetado para gerenciar a criação e consulta de reservas de quartos. A arquitetura utiliza uma abordagem de microsserviços e um sistema de mensageria com RabbitMQ para processamento assíncrono de tarefas, como o envio de e-mails de confirmação e a prevenção de condições de corrida como o overbooking.

## 2. Arquitetura do Sistema 
A arquitetura desacopla a API principal do processamento de tarefas secundárias, garantindo alta disponibilidade e resiliência.
**Fluxo Síncrono (Resposta Imediata ao Usuário)**
```
                   [ Cliente (App/Site) ]
                            |
                            |   1. POST /reservas
                            v
                   [ API Gateway ]
                   ( Autenticação, Rate Limit )
                            |
                            |  2. Encaminha requisição
                            |
                            v
                   [ Serviço de Reservas ]
                            |
                            | 3. Valida e trava disponibilidade no banco
                            |
                            v 
                   [ Banco de Dados (PostgreSQL, etc.) ]
                            ^
                            | 4. Confirma o lock e a criação inicial 
                            | 
                            |
                  [ Serviços de reserva ]
                            |  
                            |  5. retorna um " 202 Accepted " 
                            |     ( reserva em processo )
                            |  
                            v
                     [ API gateway ] 
                            |
                            | 6. Repassa a requisição
                            |
                            v
                     [ Cliente (App/Site) ]
```

**Fluxo Assíncrono (Processamento em Segundo Plano)**

```
             [ Cliente (App/Site) ]
                      |
                      | 1. POST /reservas
                      v
                [ API Gateway ]
                (Autenticação, Rate Limit)
                      |
                      | 2. Encaminha requisição
                      v
             [ Serviço de Reservas ]
                      |
                      | 3. Valida e trava disponibilidade no BD
                      v
             [️ Banco de Dados (PostgreSQL, etc.) ]
                      ^
                      | 4. Confirma o lock e a criação inicial
                      |
             [ Serviço de Reservas ]
                      |
                      | 5. Retorna "202 Accepted" 
                      |     (Reserva em processamento)
                      v
             [ API Gateway ]
                      |
                      | 6. Repassa a resposta
                      v
             [ Cliente (App/Site) ]
```

## 3. Exemplo de Arquitetura de Pastas (API de Reservas)

Estrutura sugerida para um projeto Node.js com Express, testes e prevenção de overbooking:

```
    api-reservas/
    |__ .idea/  
    |    .gitinore
    |     api-reservas.iml
    |     modules.xml
    |     workspace.xml
    |__ node_modules/
    |
    |__ routes/
    |      index.router.js
    |      login.router.js
    |
    |__ teste/
    |      node_modules/
    |      index.js
    |      package.json
    |      package-lock.json
    |
    |__ dados.json
    |__ package.json
    |__ package-lock.json
    |__ worker.js
```
pontos importantes e a explicação de cada pasta comforme a estrutura mostra <br>
* .idea/ é uma pasta criada pela propria IDE que eu to usando é as configuraçoes do projeto <br>
* node_modules/ essa pasta é muito importante ela onde fica todas as lib do projeto <br>
* router/ é a pasta onde vai ficar as rotas criada pra cada requisição que vc queira colocar 
* teste/ geralmente é pra colocar os testes utilitario mas to usando pra criar a simulação de overbooking
* dados.json esse é o arquivo que vamos tar utilizando pra criar o papel do banco de dados 
* index.js esse arquivo é onde vai ficar a logica de iniciar e poder usar as rotas juntas
* package.json esse arquivo onde vai ficar a representação do projeto nome autor se vai ter um git 
  licensa etc
* package-lock.json esse arquivo onde vao ficar as configurações das depedencias do projeto
* worker.js esse arquivo onde vai ficar a logica de processamento assincrono pra o Rabbitmq
  mandar o email da fila 

### testes que foi feito 
explicação do endpoint Criar uma nova reserva 

# o que o endpoint faz 
cria uma solicitação de reserva que é enviada pra uma fila na mensageria pra o processamento `assíncrono`

**Endpoint**: POST /reservas <br>
**Descrição**: Recebe os detalhes de uma nova reserva, realiza uma verificação preliminar de disponibilidade e, se o quarto parecer livre, enfileira a solicitação para processamento final.
**Corpo da Requisição**<br>
`idHospede`( Number, Obrigatorio ): id do Hospede<br>
`idQuarto`( Number, Obrigatorio ): id do quarto desejado<br>
`dataCheckin` ( String, Obrigatorio ): data de inicio da reserva (formato `YYYY-MM-DD`)<br>
`dataCheckout` ( Stirng, Obrigatorio ): data de fim da reserva (formato `YYYY-MM-DD`)<br>
`numeroHospedes` ( Number, Opcional): quantidade de hospedes (padrão 1)<br>
**Esemplo**:<br>
```json
{
  "idHospede": 101,
  "idQuarto": 205,
  "dataCheckin": "2025-10-22",
  "dataCheckout": "2025-10-25",
  "numeroHospedes": 2
}
```
**Respostas**:
(202 created): (Sucesso): a solicitação foi aceita e esta na fila o corpo 
da resposta contem o json com os detalhes da reserva<br>
(400 Bad Request): Faltam dados obrigatorios pra serem colocado na requisição<br>
(409 Conflict): A verificação preliminar indicou que o quarto já está ocupado nas datas solicitadas.<br>
(500 Internal Server Error): Um erro inesperado ocorreu no servidor.

## Detalhes da implementação
```js
app.post('/reservas', (res, req) => {
    const { idHospede, idQuarto, dataCheckin, dataCheckout, numeroHospedes } = req.body;
    if (!idHospede || !idQuarto || !dataCheckin || !dataCheckout) {
        return res.status(400).json({ mensagem: 'Dados inválidos ou incompletos.' });
    }
})
```
esse detalhe que foi colocado na implementação feita na resposta 404 Bad Request
ele efetua a extração dos dados e valida se eu coloco todos

```js
async function verificarDisponibilidade(idQuarto, dataCheckin, dataCheckout) {
    const listaDeReservas = await readReservasData();
    const dataCheckInDesejada = new Date(dataCheckin);
    const dataCheckOutDesejada = new Date(dataCheckout);
    const reservasConflitantes = listaDeReservas.filter(reserva => {
        if ( reserva.idQuarto !== idQuarto || reserva.status === 'cancelada' ) {
            return false;
        }
        const dataCheckInExistente = new Date(reserva.dataCheckin);
        const dataCheckOutExistente = new Date(reserva.dataCheckout);
        return dataCheckInDesejada < dataCheckOutExistente && dataCheckOutDesejada > dataCheckInExistente
    })
    return reservasConflitantes.length === 0;
}

const estaDisponivel = await verificarDisponibilidade(idQuarto, dataCheckin, dataCheckout);
if (!estaDisponivel) {
    return res.status(409).json({ mensagem: "Desculpe, este quarto não está disponível para as datas selecionadas." });
}
```
esse detalhe eu itencinamente coloquei um ponto muito critico pois com esse ponto foi 
um intervalo de tempo e uma falta de um trava (lock) pra acontecer um exemplo de overbooking
```js
const axios = require('axios');
const URL_API = 'http://localhost:3000/reservas';

async function fazerRequisição(id) {
    try {
        const response = await axios.post(URL_API, payloadDaReserva);
        console.log(`✅ Sucesso na Requisição #${id}! Status: ${response.status}, Mensagem: ${response.data.mensagem}`);
    } catch (error) {
        console.error(`❌ Falha na Requisição #${id}! Status: ${error.response.status}, Mensagem: ${error.response.data.mensagem}`);
    }
}

async function iniciarTesteDeOverbooking() {
    await Promise.all([
        fazerRequisicao(1),
        fazerRequisicao(2)
    ])
}
iniciarTesteDeOverbooking();
```
bem esse detahe foi um exemplo de como eu fiz pra testar o overbooking tem como nome Overbooking por Condição de Corrida
É o que acontece quando duas ou mais operações tentam acessar e modificar o mesmo recurso (no seu caso, a disponibilidade de um quarto de hotel) ao mesmo tempo, e o sistema não possui um mecanismo para garantir que essas operações ocorram em uma ordem segura.
e tbm irei dar um exemplo de melhor forma pra criar 

```sql
BEGIN TRANSACTION;
select * from quartos id = 205 for update;
INSERT INTO reservas (idQuarto, dataCheckin, ...) VALUES (205, '2025-10-22', ...);
COMMIT;
```

```js
async function criarReservaComLock(idHospede, idQuarto, dataCheckin, dataCheckout) {
    
    const client = await dbClient.connect();

    try {
        await client.query('BEGIN');

        await client.query('SELECT id FROM quartos WHERE id = $1 FOR UPDATE', [idQuarto]);

        const estaDisponivel = await verificarDisponibilidade(client, idQuarto, dataCheckin, dataCheckout);

        if (!estaDisponivel) {
            await client.query('ROLLBACK');
            throw new Error("Quarto indisponível.");
        }

        await client.query(
            'INSERT INTO reservas (idHospede, idQuarto, ...) VALUES ($1, $2, ...)',
            [idHospede, idQuarto, ...]
        );

        await client.query('COMMIT');
        
        console.log("✅ Reserva confirmada com sucesso!");

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("❌ Falha na transação da reserva:", error);
        throw error; // Propaga o erro
    } finally {
        client.release();
    }
}
```
e estes dois blocos de escritos é fazendo a melhor forma mais 
pratica de evitar o overbooking com uma lock otimizada 
e distrivuida com redis
