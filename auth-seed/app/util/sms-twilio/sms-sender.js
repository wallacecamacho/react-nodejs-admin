const events = require('events');
const twilioClient = require('twilio');
const config = require('../../config');

class SendSms {
  constructor(from, to, message) {
    this.from = from;
    this.to = to;
    this.message = message;
    this.events = new events.EventEmitter();
    this.tClient = twilioClient(config.sms.twilio.twilioAccountSid,
      config.sms.twilio.twilioAuthToken);
  }

  send() {
    const options = {
      from: this.from,
      to: this.to,
      body: this.message,
    };

    this.tClient.messages.create(options, (err, success) => {
      if (err) {
        this.events.emit('error', err);
      }
      if (success) {
        this.events.emit('success', success);
      }
    });
  }
}
module.exports = SendSms;
