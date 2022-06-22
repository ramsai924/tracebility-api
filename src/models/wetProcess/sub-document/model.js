const mongoose = require('mongoose');
const { schema } = require('./schema');

module.exports = mongoose.model('StorageLocationDetail_WP', schema, 'StorageLocationDetail_WP');
