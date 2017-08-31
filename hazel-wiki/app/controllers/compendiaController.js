"use strict";

const CompendiaViewModel = require('../models/homeViewModel');
const Document = require('../models/document');

const avataria = require('avataria');
const nomina = require('nomina');
const dynastia = require('dynastia');
const { Renderer } = dynastia;

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

    // /compendia/dynastia/:flie
    this._server.post("/compendia/dynastia/:filename", this._auth, this.dynastia.bind(this));
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
    avataria(options, (err, data) => {
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
    this._storageProvider.storeFile(req, res, (err) => {
      if(err) {
        return res.status(422).send(err);
      }

      // import dynastia
      if (req.file.filename.indexOf('.dyn') >= 0) {
        this._dynastia(req.file.filename);
      }

      return res.status( 200 ).send(req.file.filename);
    });
  }

  /**
    * Generate from a file name
    */
  dynastia(req, res, next) {
    const filename = req.params.filename;

    // import dynastia
    this._dynastia(filename);

    res.send({
      success: true,
    });
  }

  /**
    * Parse a dynastia file
    */
  _dynastia(filename) {
    const filePath = this._storageProvider.getFilePath(filename);
    const dynasty = dynastia.loader(filePath);

    this._walkDynasty(dynasty, filename);
  }

  /**
    * Walk through a dynastia file
    */
  _walkDynasty(dynasty, filename, first = true, predecessor = null) {
    if (Renderer.hasSuccessor(dynasty)) {
      const successor = Renderer.getSuccessor(dynasty);

      this._createDynastyDocument(dynasty, filename, {
        first,
        successor,
        predecessor,
      });

      this._walkDynasty(successor, filename, false, dynasty);
    } else {
      this._createDynastyDocument(dynasty, filename, {
        first,
        successor: false,
        predecessor,
      });
    }
  }

  /**
    * Create a document for this dynasty file
    */
  _createDynastyDocument(dynasty, filename, options = {}) {
    const name = Renderer.name(dynasty);
    const { first, successor, predecessor } = options;
    const { backstory } = dynasty;
    const { early_life, career, personal_life, death } = backstory;
    let markdown = '';

    // add the predecessor unless we're first
    if (!first) {
      const predecessorName = Renderer.name(predecessor);
      const predecessorSlug = this._storageProvider.titleToSlug(predecessorName);

      markdown += `Predecessor: [${predecessorName}](${predecessorSlug})\n\n`;
    }

    // body of the markdown
    markdown += `${early_life}\n\n${career}\n\n${personal_life}\n\n${death}\n\n`;

    // add successor if we have it
    if (successor) {
      const successorName = Renderer.name(successor);
      const successorSlug = this._storageProvider.titleToSlug(successorName);

      markdown += `Successor: [${successorName}](${successorSlug})\n\n`;
    }

    // add the link to the dynasty
    markdown += `------\nThis article was dynamically generated from the Dynastia tool: [${filename}](uploads/${filename})`;

    // create the doc
    const doc = new Document();
    doc.title = name;
    doc.slug = this._storageProvider.titleToSlug(name);
    doc.markdown = markdown;
    doc.tags = ['character'];

    // update or add
    if (this._documents.get(doc.slug)) {
      this._documents.update(doc);
    } else {
      this._documents.add(doc);
    }
  }
}

module.exports = CompendiaController;