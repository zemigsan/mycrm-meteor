Package.describe({
  name: 'mycrm:mycrm-calendar',
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


  api.use([
    'mycrm:mycrm-lib@0.0.1',
    'mycrm:mycrm-projects@0.0.1',
      'mycrm:mycrm-block-time@0.0.1'
  ]);

  api.addFiles([
    'lib/namespace.js',
        'lib/methods.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/calendar.html',
      'lib/client/templates/calendarday.html',
    'lib/client/templates/templates.js'
  ], ['client']);

  api.addFiles([
    'lib/server/publications.js'
  ], ['server']);

  api.export("Calendars");

});
