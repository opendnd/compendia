var SELECTORS = {
  AVATARIA: '#avataria',
  AVATARIA_OUTPUT: '#avataria-output',
  AVATARIA_GENDER: '#avataria-gender',
  AVATARIA_SPECIES: '#avataria-species',
  DROPZONE: '.js-dropzone'
};

var ROUTES = {
  AVATARIA: '/compendia/avataria'
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

  this.bind();
};
CompendiaPage.constructor = CompendiaPage;
CompendiaPage.prototype = {
  bind: function () {
    this.dropzone.on('success', this.onDropzoneSuccess.bind(this));
    this.$avataria.on('click', this.onAvatariaClick.bind(this));
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
  }
};

$(function() {
  var page = new CompendiaPage($('.js-editPage'));
})
