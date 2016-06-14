const getConfig = require('./utils').serverProd;
const options = require('../../config');

module.exports = getConfig(options);