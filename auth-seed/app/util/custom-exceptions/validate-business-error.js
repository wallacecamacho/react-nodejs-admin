const NE = require('node-exceptions');

class ValidateBusinessError extends NE.LogicalException {}
module.exports = ValidateBusinessError;
