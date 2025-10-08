const express = require('express');

const routes = express.Router();

const caixasControllers = require('../controllers/caixas.controllers');

routes.get('/mode-ap-reboot', caixasControllers.ativarModoAPReboot);
routes.get('/tarar', caixasControllers.tararBalanaca);

module.exports = routes;