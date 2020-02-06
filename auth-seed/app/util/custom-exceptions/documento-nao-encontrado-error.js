const NE = require('node-exceptions');

class DocumentoNaoEncontradoError extends NE.LogicalException {}
module.exports = DocumentoNaoEncontradoError;
