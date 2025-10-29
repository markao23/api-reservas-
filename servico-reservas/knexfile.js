// knexfile.js
module.exports = {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgresql://postgres:docker@localhost:5436/reservas_db',
    migrations: {
        directory: './src/database/migrations'
    },
    seeds: {
        directory: './src/database/seeds'
    }
};