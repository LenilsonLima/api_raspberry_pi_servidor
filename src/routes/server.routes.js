const express = require('express');

const routes = express.Router();

const serverControllers = require('../controllers/server.controllers');

routes.get('/modo-ap-reboot-server', serverControllers.ativarModoAPComRebootServer);

module.exports = routes;