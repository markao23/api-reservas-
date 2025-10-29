exports.up = async function(knex) {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await knex.schema.createTable('resource', (table) => {
        table.uuid('resource_id').primary().defaultTo(knex.fn.uuid());
        table.string('name').notNullable();
        table.integer('capacity').notNullable();
    });
};
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('resource');
};