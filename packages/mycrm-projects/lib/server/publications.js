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
