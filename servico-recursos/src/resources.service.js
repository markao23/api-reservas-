const repository = require('./resources.repository');
exports.getResourceInfo = async (id) => {
    const resource = await repository.findResourceById(id);
    if (!resource) {
        throw new Error('Recurso não encontrado');
    }
    return resource;
};