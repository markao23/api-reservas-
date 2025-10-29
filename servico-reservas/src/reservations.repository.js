const db = require('./database/connection');
exports.countConfirmedByResourceId = async (resourceId) => {
    const result = await db('reservation')
        .where({ resource_id: resourceId, status: 'CONFIRMED' })
        .count()
        .first();
    return parseInt(result.count, 10);
};