const events = require('events');
const nodemailer = require('nodemailer');
const config = require('../../config');
const templateConf = require('./templateConfig');

const smtpTransport = nodemailer.createTransport(config.mailer.serverConfig,
  config.mailer.fromConfig);

class SendMailer {
  constructor(to, subject, template, templateValues) {
    this.to = to;
    this.subject = subject;
    templateConf(template, templateValues, (result) => {
      this.template = result;
    });
    this.events = new events.EventEmitter();
  }

  send() {
    const options = {
      from: config.mailer.fromConfig.from,
      to: this.to,
      subject: this.subject,
      html: this.template,
    };
    smtpTransport.sendMail(options, (err, success) => {
      if (err) {
        this.events.emit('error', err);
      }
      if (success) {
        this.events.emit('success', success);
      }
    });
  }
}
module.exports = SendMailer;
