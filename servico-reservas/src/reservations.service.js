const repository = require('./reservations.repository');
exports.countReservations = (resourceId) => {
    return repository.countConfirmedByResourceId(resourceId);
};