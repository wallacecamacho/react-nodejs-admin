
const fs = require('fs');
const mapLodash = require('lodash/map');
const path = require('path');

class Locale {
  loadMessagesLocale(locale, key, values) {
    this.locale = locale || 'pt-BR';
    this.key = key;
    this.values = values;
    const directory = path.join(__dirname, './messages');
    const message = fs.readFileSync(`${directory}/${this.locale}.json`, (err, data) => {
      if (err) throw err;
    });
    this.template = JSON.parse(message);
    //      return this.loadMessages();
    return this.loadMessages();
  }

  loadMessages() {
    let dataValue = this.template[`${this.key}`];
    if (this.values) {
      mapLodash(this.values, (value, index) => {
        dataValue = dataValue.replace(`{{${index}}}`, value);
      });
    }
    return dataValue;
  }
}
module.exports = new Locale();
