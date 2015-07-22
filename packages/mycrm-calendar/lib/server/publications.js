Meteor.publish("calendars", function () {
  return Calendars.find({user: this.userId});
});
