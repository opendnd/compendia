var SELECTORS = {
  AVATARIA: '#avataria',
  AVATARIA_OUTPUT: '#avataria-output',
  AVATARIA_GENDER: '#avataria-gender',
  AVATARIA_SPECIES: '#avataria-species',

  NOMINA: '#nomina',
  NOMINA_OUTPUT: '#nomina-output',
  NOMINA_GENDER: '#nomina-gender',
  NOMINA_TYPE: '#nomina-type',
  
  DROPZONE: '.js-dropzone'
};

var ROUTES = {
  AVATARIA: '/compendia/avataria',
  NOMINA: '/compendia/nomina'
};

/**
 * Page View Class for the Document Edit page.
 */
var CompendiaPage = function($scope) {
  this.$scope = $scope;

  this.dropzone = new Dropzone(SELECTORS.DROPZONE);

  this.$avataria = $scope.find(SELECTORS.AVATARIA);
  this.$avatariaOutput = $scope.find(SELECTORS.AVATARIA_OUTPUT);
  this.$avatariaGender = $scope.find(SELECTORS.AVATARIA_GENDER);
  this.$avatariaSpecies = $scope.find(SELECTORS.AVATARIA_SPECIES);

  this.$nomina = $scope.find(SELECTORS.NOMINA);
  this.$nominaOutput = $scope.find(SELECTORS.NOMINA_OUTPUT);
  this.$nominaGender = $scope.find(SELECTORS.NOMINA_GENDER);
  this.$nominaType = $scope.find(SELECTORS.NOMINA_TYPE);

  this.bind();
};
CompendiaPage.constructor = CompendiaPage;
CompendiaPage.prototype = {
  bind: function () {
    this.dropzone.on('success', this.onDropzoneSuccess.bind(this));
    this.$avataria.on('click', this.onAvatariaClick.bind(this));
    this.$nomina.on('click', this.onNominaClick.bind(this));
  },

  /**
   * Handle the event when the user successfully uploads a file via Dropzone
   * @prop file [string]
   * @prop responseText [string]
   */
  onDropzoneSuccess: function (file, responseText) {
    console.log(file, responseText);
  },

  /**
   * Handle the avataria generate click
   */
  onAvatariaClick: function () {
    var self = this;
    var data = {};

    // set gender
    var gender = self.$avatariaGender.val();
    if (gender.length > 0) { data.gender = gender; }

    // set species
    var species = self.$avatariaSpecies.val();
    if (species.length > 0) { data.species = species; }

    $.post(ROUTES.AVATARIA, data).then(function (res) {
      self.$avatariaOutput.attr('src', 'data:image/jpg;base64,' + res.base64);
    });
  },

  /**
   * Handle the nomina generate click
   */
  onNominaClick: function () {
    var self = this;
    var data = {};

    // set gender
    var gender = self.$nominaGender.val();
    if (gender.length > 0) { data.gender = gender; }

    // set type
    var type = self.$nominaType.val();
    if (type.length > 0) { data.type = type; }

    $.post(ROUTES.NOMINA, data).then(function (res) {
      self.$nominaOutput.val(res.output);
    });
  }
};

$(function() {
  var page = new CompendiaPage($('.js-editPage'));
})
