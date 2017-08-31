var SELECTORS = {
    FORM: "form",
    DROPZONE: ".js-dropzone"
};

/**
 * Page View Class for the Document Edit page.
 */
var CompendiaPage = function($scope) {
    this.$scope = $scope;

    this.dropzone = new Dropzone(SELECTORS.DROPZONE);

    this.bind();
};
CompendiaPage.constructor = CompendiaPage;
CompendiaPage.prototype = {
    bind: function () {
        this.dropzone.on("success", this.onDropzoneSuccess.bind(this));
    },

    /**
     * Handle the event when the user successfully uploads a file via Dropzone
     * @prop file [string]
     * @prop responseText [string]
     */
    onDropzoneSuccess: function (file, responseText) {
        console.log(file, responseText);
    }
};

$(function() {
    var page = new CompendiaPage($(".js-editPage"));
})
