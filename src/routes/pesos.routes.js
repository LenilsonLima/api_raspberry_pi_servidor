const express = require('express');

const routes = express.Router();

const pesosControllers = require('../controllers/pesos.controllers');

routes.post('/', pesosControllers.createPesoCaixa);

module.exports = routes;