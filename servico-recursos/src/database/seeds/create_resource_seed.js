exports.seed = async function(knex) {
    await knex('resource').del();
    await knex('resource').insert({
        name: 'Recurso Principal (Cap: 100)',
        capacity: 100, // <-- SEU REQUISITO
    });
};