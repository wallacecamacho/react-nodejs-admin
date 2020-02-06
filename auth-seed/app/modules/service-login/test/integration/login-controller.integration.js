/* global it, describe, after, before */

const request = require('superagent');
const expect = require('chai').expect;
const config = require('../../../../config');

/**
 * Arrow Functions
 * Passing arrow functions (“lambdas”) to Mocha is discouraged.
 * Lambdas lexically bind this and cannot access the Mocha context.
 */

describe('Login não permitido', () => {
  it('Não Deve realizar o login', () => request.post(`${config.app.host}:${config.app.port}${config.app.baseRoute}/login`)
    .set('x-origin-application', config.app.name)
    .set('x-origin-channel', 'teste')
    .set('x-origin-device', 'desktop')
    .set('X-API-Key', 'foobar')
    .send({ email: 'Manny', password: 'cat' })
    .set('Accept', 'application/json')
    .then((res) => {
    })
    .catch((res) => {
      expect(res.status).equals(401);
    }));
});
