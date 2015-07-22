Meteor.publish("blockedtimes", function () {
  return Blockedtimes.find({user: this.userId});
});
