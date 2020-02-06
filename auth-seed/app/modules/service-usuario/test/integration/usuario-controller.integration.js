/* global it, describe, after, before */

const request = require('superagent');
const expect = require('chai').expect;
const config = require('../../../../config');

/**
 * Arrow Functions
 * Passing arrow functions (“lambdas”) to Mocha is discouraged.
 * Lambdas lexically bind this and cannot access the Mocha context.
 */

describe('Usuario', () => {
  it('should complete this test', () => request.get(`http://${config.app.host}:${config.app.port}${config.app.baseRoute}/usuarios`)
    .set('x-origin-application', config.app.name)
    .set('x-origin-channel', 'teste')
    .set('x-origin-device', 'desktop')
    .then((res) => {
      expect(res);
    }));
});
