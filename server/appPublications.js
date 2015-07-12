// Meteor.publish definitions
// Modify the publish statement
// Only publish tasks that are public or belong to the current user
Meteor.publish("calendars", function () {
  return Calendars.find({user: this.userId});
});
Meteor.publish("projects", function () {
  return Projects.find({

    $or: [
      {
        $and: [{
          private: {
            $ne: true
          }
        }, {
          owner: this.userId
        }]
      },
      {
        owner: this.userId
      }
    ]
  });
});
