const express = require('express');

const routes = express.Router();

const ativarModoAPComReboot = require('../controllers/ativarModoAPComReboot');

routes.get('/mode-ap-reboot', ativarModoAPComReboot.ativarModoAPComReboot);

module.exports = routes;