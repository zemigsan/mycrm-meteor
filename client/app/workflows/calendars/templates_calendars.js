// This code only runs on the client
Template.body.helpers({
  calendars: function() {
    return Calendars.findOne().days;
  }
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('dddd (MMM Do)');
});
