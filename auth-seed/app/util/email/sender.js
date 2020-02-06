const logger = require('../../config/log')({ module: 'Sender Email' });
const Mail = require('./mailer');

module.exports = (to, subject, template, templateValues) => {
  const mail = new Mail(to, subject, template, templateValues);
  mail.events.on('error', (error) => {
    logger.accessLog.debug('Error - Mail', error);
  });
  mail.events.on('success', (success) => {
    logger.accessLog.debug('Success - Mail', success);
  });
  mail.send();
};
