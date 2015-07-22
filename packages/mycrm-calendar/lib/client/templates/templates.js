// This code only runs on the client
Template.calendar.helpers({
  calendars: function() {
    return (Calendars.findOne().days || null);
  },

  projects: function () {
        return Projects.find({ checked: { $ne: true }}, {sort: { deadline: -1 } });
      }
});

Template.registerHelper('formatDate', function(date) {
  return moment(date).format('dddd (MMM Do)');
});

Template.calendar.events({

  "click .update-calendar": function () {
    //Meteor.call("setPrivate", this._id, !this.private);
    Meteor.call("updateCalendar");
  }
});
