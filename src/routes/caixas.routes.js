const express = require('express');

const routes = express.Router();

const caixasControllers = require('../controllers/caixas.controllers');

routes.get('/modo-ap-reboot', caixasControllers.ativarModoAPReboot);
routes.get('/tarar-balanca', caixasControllers.tararBalanaca);
routes.get('/reiniciar', caixasControllers.reiniciarRaspberry);
routes.post('/calibrar-reference', caixasControllers.calibrarReferenceBalanaca);

module.exports = routes;