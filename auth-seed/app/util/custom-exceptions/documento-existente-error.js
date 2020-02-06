const NE = require('node-exceptions');

class DocumentoExistenteError extends NE.LogicalException {}
module.exports = DocumentoExistenteError;
