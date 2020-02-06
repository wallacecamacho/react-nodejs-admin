const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');
// const libs = `${process.cwd()}/app/modules/`;
const config = require('../../../config');
const log = require('../../log')({ module });
const User = require('../../../modules/service-usuario/model/usuario-model');
const AccessToken = require('../../../modules/service-token/model/accessToken');
const RefreshToken = require('../../../modules/service-token/model/refreshToken');
const Clients = require('../../../modules/service-token/model/client');

// Create OAuth 2.0 server
const aserver = oauth2orize.createServer();

aserver.serializeClient((client, done) => {
  done(null, client.id);
});

aserver.deserializeClient((id, done) => {
  Clients.findById(id, (error, client) => {
    if (error) return done(error);
    return done(null, client);
  });
});

// Generic error handler
const errFn = (cb, err) => {
  if (err) {
    return cb(err);
  }
  return null;
};

// Destroy any old tokens and generates a new access and refresh token
const generateTokens = (pdata, done) => {
  const data = pdata;
  // Curries in `done` callback so we don't need to pass it
  const errorHandler = errFn.bind(undefined, done);

  RefreshToken.remove(data, errorHandler);
  AccessToken.remove(data, errorHandler);

  const tokenValue = crypto.randomBytes(32).toString('hex');
  const refreshTokenValue = crypto.randomBytes(32).toString('hex');

  data.token = tokenValue;
  const token = new AccessToken(data);

  data.token = refreshTokenValue;
  const refreshToken = new RefreshToken(data);

  refreshToken.save(errorHandler);

  token.save((err) => {
    if (err) {
      log.error(err);
      return done(err);
    }
    return done(null, tokenValue, refreshTokenValue, {
      expires_in: config.security.tokenLife,
    });
  });
};

// Exchange username & password for access token
aserver.exchange(oauth2orize.exchange.password((client, username, password, scope, done) => {
  User.findOne({ email: username }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user || !user.checkPassword(password)) {
      return done(null, false);
    }

    const model = {
      userId: user.userId,
      clientId: client.clientId,
    };

    return generateTokens(model, done);
  });
}));

// Exchange refreshToken for access token
aserver.exchange(oauth2orize.exchange.refreshToken((client, refreshToken, scope, done) => {
  RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, (err, token) => {
    if (err) {
      return done(err);
    }

    if (!token) {
      return done(null, false);
    }

    User.findById(token.userId, (erro, user) => {
      if (erro) { return done(erro); }
      if (!user) { return done(null, false); }

      const model = {
        userId: user.userId,
        clientId: client.clientId,
      };

      return generateTokens(model, done);
    });

    return false;
  });
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens. Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request. Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
  aserver.token(),
  aserver.errorHandler(),
];

exports.generateTokens = (pdata, done) => generateTokens(pdata, done);
