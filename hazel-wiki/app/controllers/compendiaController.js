"use strict";

const CompendiaViewModel = require('../models/homeViewModel');

const avataria = require('avataria');
const nomina = require('nomina');
const dynastia = require('dynastia');

const _ = require('lodash');

class CompendiaController {
  constructor(server, config, authMethod, documentRepository, searchProvider, analyticsService, storageProvider) {
    this._documents = documentRepository;
    this._auth = authMethod;
    this._server = server;
    this._config = config;
    this._searchProvider = searchProvider;
    this._analyticsService = analyticsService;
    this._storageProvider = storageProvider;

    this._bindRoutes();
  }

  _bindRoutes() {
    // /compendia
    this._server.get("/compendia", this._auth, this.index.bind(this));

    // /compendia/avataria
    this._server.post("/compendia/avataria", this._auth, this.avataria.bind(this));

    // /compendia/nomina
    this._server.post("/compendia/nomina", this._auth, this.nomina.bind(this));

    // /compendia/uploads
    this._server.post("/compendia/upload", this._auth, this.upload.bind(this));
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

  /**
   * Import the file
   */
  upload(req, res, next) {
    var self = this;

    this._storageProvider.storeFile(req, res, function(err) {
      if(err) {
        return res.status(422).send(err);
      }

      // import dynastia
      if (req.file.filename.indexOf('.dyn') >= 0) {
        self._dynastia(req.file);
      }

      return res.status( 200 ).send(req.file.filename);
    });
  }

  /**
    * Parse through a dynastia file
    */
  _dynastia(file) {
    const dynasty = dynastia.loader(file.path);
    console.log(dynasty);
  }
}

module.exports = CompendiaController;