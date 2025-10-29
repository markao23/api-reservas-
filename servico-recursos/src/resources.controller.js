const service = require('./resources.service');
exports.handleGetResourceInfo = async (req, res) => {
    try {
        const resource = await service.getResourceInfo(req.params.id);
        return res.status(200).json(resource);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
};