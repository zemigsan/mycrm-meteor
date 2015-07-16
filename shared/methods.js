//schema validations and the like
//non-client stuff
// At the bottom of simple-todos.js, outside of the client-only block
//So why do we want to define our methods on the client and on the server?
//We do this to enable a feature called latency compensation.
Meteor.methods({
  addProject: function (name, deadline, duration) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Projects.insert({
      name: name,
      duration: parseInt(duration),
      deadline: new Date(deadline),
      createdAt:new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      percCompletion: 0,
      hoursWorked: 0,
      initialDuration: parseInt(duration) //to save the original estimatation
    });
  },
  deleteProject: function (projectId) {
    Projects.remove(projectId);
  },
  setChecked: function (projectId, setChecked) {
    Projects.update(projectId, {
      $set: {
        checked: setChecked
      }
    });
  },

  setPrivate: function (projectId, setToPrivate) {
    var project = Projects.findOne(projectId);

    // Make sure only the task owner can make a task private
    if (project.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Projects.update(projectId, {
      $set: {
        private: setToPrivate
      }
    });
  }
});
