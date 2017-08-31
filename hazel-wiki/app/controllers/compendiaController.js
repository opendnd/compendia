"use strict";

const CompendiaViewModel = require('../models/homeViewModel');

const avataria = require('avataria');
const nomina = require('nomina');

const _ = require('lodash');

class CompendiaController {
  constructor(server, config, authMethod, documentRepository, searchProvider, analyticsService) {
    this._documents = documentRepository;
    this._auth = authMethod;
    this._server = server;
    this._config = config;
    this._searchProvider = searchProvider;
    this._analyticsService = analyticsService;

    this._bindRoutes();
  }

  _bindRoutes() {
    // /compendia
    this._server.get("/compendia", this._auth, this.index.bind(this));

    // /compendia/avataria
    this._server.post("/compendia/avataria", this._auth, this.avataria.bind(this));

    // /compendia/nomina
    this._server.post("/compendia/nomina", this._auth, this.nomina.bind(this));
  }

  /**
   * Render the homepage
   */
  index(req, res, next) {
    var viewModel = new CompendiaViewModel();

    viewModel.config = this._config;

    res.render("compendia-home", viewModel);
  }

  /**
   * Respond with the avatar
   */
  avataria(req, res, next) {
    const { body } = req;
    const { gender, species } = body;
    const options = {
      gender,
      species,
    };

    // generate from avataria
    avataria(options, function (err, data) {
      const { base64 } = data;
      res.send({
        base64,
      })
    });
  }

  /**
   * Respond with the name
   */
  nomina(req, res, next) {
    const { body } = req;
    const { gender, type } = body;
    const options = {
      gender,
      type,
    };

    // generate from avataria
    const output = nomina(options);

    res.send({
      output,
    });
  }
}

module.exports = CompendiaController;