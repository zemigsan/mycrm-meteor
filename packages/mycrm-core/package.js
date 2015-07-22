Package.describe({
  name: 'mycrm:mycrm-core',
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
  var packages =[
  'mycrm:mycrm-lib@0.0.1', //  no dependencies
  'mycrm:mycrm-projects@0.0.1',
  'mycrm:mycrm-calendar@0.0.1',
  'mycrm:mycrm-block-time@0.0.1' // lib

];

api.use(packages);

api.imply(packages);

api.addFiles([
   'lib/router/routes.js'
   //'lib/router/filters.js',
   //'lib/router/admin.js',
   //'lib/router/server.js',
   //'lib/config.js',
   //'lib/modules.js',
   //'lib/vote.js'
 ], ['client', 'server']);

 api.addFiles([
   'lib/client/startup.js',
   'lib/client/subscriptions.js',
     'lib/client/templates/home.html',
   'lib/client/templates/applayout.html',
    'lib/client/templates/navigation.html'
 ], ['client']);


});
