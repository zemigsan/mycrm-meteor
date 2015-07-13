// This code only runs on the client
Template.home.helpers({
  calendars: function() {
    return Calendars.findOne().days;
  }
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('dddd (MMM Do)');
});

Template.home.events({

  "click .toggle-private": function () {
    //Meteor.call("setPrivate", this._id, !this.private);
    Meteor.call("updateCalendar");
  }
});
