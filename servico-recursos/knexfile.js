// knexfile.js
module.exports = {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgresql://postgres:docker@localhost:5435/recursos_db',
    migrations: {
        directory: './src/database/migrations'
    },
    seeds: {
        directory: './src/database/seeds'
    }
};