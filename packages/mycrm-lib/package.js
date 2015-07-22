Package.describe({
  name: 'mycrm:mycrm-lib',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');


  var packages = [
    'standard-app-packages',
    'service-configuration',
    'meteor-platform',
    'accounts-ui',
    'accounts-base',
    'accounts-password',
    'less',
    'reactive-var',
    'http',
    'email',
    'spiderable',
    'aldeed:simple-schema@1.3.3',
    'aldeed:collection2@2.3.3',
    'sacha:autoform@5.1.2',
    'aldeed:template-extension@3.4.3',
    'iron:router@1.0.5',
    'momentjs:moment@2.10.3',
    //'meteorhacks:aggregate@1.2.1',
    'nemo64:bootstrap@3.3.5_1',
    'sanjo:jasmine@0.14.0',
    'velocity:html-reporter@0.6.2'
    //'dburles:collection-helpers@1.0.3',
    //'matb33:collection-hooks@0.7.11',
    //'chuangbo:marked@0.3.5',
    //'meteorhacks:fast-render@2.3.2',
    //'meteorhacks:subs-manager@1.3.0',
    //'percolatestudio:synced-cron@1.1.0',
    //'useraccounts:unstyled@1.8.1',
    //'manuelschoebel:ms-seo@0.4.1',
    //'aramk:tinycolor@1.1.0_1',
    //'sacha:spin@0.2.4',
    //'aslagle:reactive-table@0.7.3',
    //'utilities:avatar@0.7.8',
    //'fortawesome:fontawesome@4.3.0',
    //'ccan:cssreset@1.0.0',
    //'djedi:sanitize-html@1.6.1',
    //'dburles:collection-helpers@1.0.3',
    //'jparker:gravatar@0.3.1',
    //'sanjo:meteor-files-helpers@1.1.0_4',
    //'cmather:handlebars-server@0.2.0'
  ];

  api.use(packages);

  api.imply(packages);

  api.export([
    'mycrm'
  ]);

});
