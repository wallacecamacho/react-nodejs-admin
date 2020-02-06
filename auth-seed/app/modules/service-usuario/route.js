const express = require('express');

const router = express.Router();
const controller = require('./controller');
const controllerValidate = require('./validate/usuario-validate');
const route = require('../../config/route');
const captchaValidade = require('../../util/captcha-validate');

const info = route.info(__filename);

router.get('/usuarios', controller.before.bind(controller), controller.carregar.bind(controller));

router.get('/usuario/:email', controllerValidate.validateEmail.bind(controller), controller.consultarPorEmail.bind(controller));

router.post('/usuario',
  controllerValidate.validatSchemaNewUser.bind(controller),
  captchaValidade.validate.bind(controller),
  controller.cadastrar.bind(controller));

router.post('/usuario/resend-sms',
 // controllerValidate.validatSchemaNewUser.bind(controller),
 // captchaValidade.validate.bind(controller),
  controller.reenviarSms.bind(controller));

router.put('/usuario', controllerValidate.validatSchema.bind(controller), controller.atualizar.bind(controller));

router.put('/usuario/code-validate', controllerValidate.validatSmsCodeSchema.bind(controller), controller.atualizarSmsCode.bind(controller));


router.delete('/usuario', controller.before.bind(controller), controller.remover.bind(controller));

module.exports = router;
