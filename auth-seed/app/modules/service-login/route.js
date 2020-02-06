
const express = require('express');

const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login');
const passport = require('passport');
const oauth2 = require('../../config/strategy/auth/oauth2');
const config = require('../../config');

const ensureLogged = ensureLoggedIn.ensureLoggedIn;

// curl -X 'GET' localhost:3000/categoria-dashboard-backend/categorias
// server.get(`${info.base}/login`, controller.before.bind(controller), controller.carregar.bind(controller));
const opts = { failureRedirect: `${config.app.baseRoute}/` };

router.post('/login', oauth2.token);

router.get('/auth/google', passport.authorize('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/login/callback',
  passport.authenticate('google', opts), (req, res) => {
    res.redirect(`${config.app.baseRoute}/profile`);
  });


router.get(
  '/profile',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    res.send({ teste: 'teste' });
  },
);

router.get(
  '/profileTeste',
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    res.send({ teste: 'teste' });
  },
);

router.get(
  '/notLogged',
  (req, res, next) => {
    res.redirect('');
  },
);


module.exports = router;
