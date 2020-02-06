const express = require('express');

const router = express.Router();
const controller = require('./controller');
const controllerValidate = require('./validate/imobiliarias-validate');
const route = require('../../config/route');

const info = route.info(__filename);

router.get('/imobiliarias', controller.before.bind(controller), controller.getAll.bind(controller));

router.get('/imobiliarias/:id', controller.before.bind(controller), controller.getById.bind(controller));

router.post('/imobiliarias', controllerValidate.validatSchema.bind(controller), controller.before.bind(controller), controller.post.bind(controller));

router.put('/imobiliarias', controllerValidate.validatSchema.bind(controller), controller.before.bind(controller), controller.put.bind(controller));

router.delete('/imobiliarias/:id', controller.before.bind(controller), controller.delete.bind(controller));

module.exports = router;
