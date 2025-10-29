const db = require('./database/connection');
exports.findResourceById = (id) => {
    return db('resource').where('resource_id', id).first();
};