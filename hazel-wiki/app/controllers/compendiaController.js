"use strict";

const CompendiaViewModel = require("../models/homeViewModel");

const _ = require("lodash");

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
  }

  /**
   * Render the homepage
   */
  index(req, res, next) {
    var viewModel = new CompendiaViewModel();

    viewModel.config = this._config;

    res.render("compendia-home", viewModel);
  }
}

module.exports = CompendiaController;