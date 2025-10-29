const service = require('./reservations.service');
exports.handleCountReservations = async (req, res) => {
    try {
        const { resource_id } = req.query;
        if (!resource_id) {
            return res.status(400).json({ error: 'resource_id é obrigatório' });
        }
        const count = await service.countReservations(resource_id);
        return res.status(200).json({ count: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};