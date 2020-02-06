const ejs = require('ejs');
const logger = require('../../config/log')({ module: 'TemplateConfig Email' });

let htmlTemplate = null;

const loadTemplate = (template, data) => {
  ejs.renderFile(`${__dirname}/templates/${template}`, data, (err, templateFile) => {
    if (err) {
      logger.accessLog.error(`Erro ao realizar o parser do tempalte ${template}`, err);
    }
    htmlTemplate = templateFile;
    return templateFile;
  });
};

const callbackAcceptingFunction = (fn, data) => loadTemplate(fn, data);

module.exports = (template, data, callback) => {
  callbackAcceptingFunction(template, data);
  callback(htmlTemplate);
};
