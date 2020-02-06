const express = require('express');

const router = express.Router();
const controller = require('./controller');
const controllerValidate = require('./validate/validate');

router.get('/imoveis', controller.before.bind(controller), controller.getAll.bind(controller));

router.get('/imoveis/:id', controller.before.bind(controller), controller.getById.bind(controller));

router.post('/imoveis', controllerValidate.validateSchema.bind(controller), controller.before.bind(controller), controller.post.bind(controller));

router.put('/imoveis/:id', controllerValidate.validateSchema.bind(controller), controller.before.bind(controller), controller.put.bind(controller));

router.delete('/imoveis/:id', controller.before.bind(controller), controller.delete.bind(controller));

router.get('/imoveis/coordinates/:lng/:lat', controller.before.bind(controller), controller.getByCoordinates.bind(controller));

module.exports = router;
