Projects = new Mongo.Collection("projects");

if (Meteor.isClient) {

  // this allows after descontinue the autopublish
  Meteor.subscribe("projects");

  // to add the private function
  Template.project.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });


  // This code only runs on the client
  Template.body.helpers({
    projects: function () {
      if (Session.get("hideCompleted")) {
        // If hide completed is checked, filter tasks
        return Projects.find({
          checked: {
            $ne: true
          }
        }, {
          sort: {
            deadline: -1
          }
        });
      } else {
        // Otherwise, return all of the tasks
        return Projects.find({}, {
          sort: {
            deadline: -1
          }
        });
      }
    },
    hideCompleted: function () {
      return Session.get("hideCompleted");
    },
    incompleteCount: function () {
      return Projects.find({
        checked: {
          $ne: true
        }
      }).count();
    }
  });

  Template.body.events({
    "submit .new-project": function (event) {
      // This function is called when the new task form is submitted

      // Prevent default form submit
      event.preventDefault();
      var projectname = event.target.projectname.value;
      var deadline = event.target.deadline.value;
      var duration = event.target.duration.value;

      Meteor.call("addProject", projectname, deadline, duration);


      // Clear form
      event.target.projectname.value = "";


      //return false;
    },
    "change .hide-completed input": function (event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.project.events({
    "click .toggle-checked": function () {
      // Set the checked property to the opposite of its current value
      Meteor.call("setChecked", this._id, !this.checked);
    },
    "click .delete": function () {
      Meteor.call("deleteProject", this._id);
    },
    "click .toggle-private": function () {
      Meteor.call("setPrivate", this._id, !this.private);
    }
  });

  // At the bottom of the client code
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

//non-client stuff
// At the bottom of simple-todos.js, outside of the client-only block
//So why do we want to define our methods on the client and on the server?
//We do this to enable a feature called latency compensation.
Meteor.methods({
  addProject: function (text, deadline, duration) {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Projects.insert({
      text: text,
      duration: duration,
      deadline: deadline,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
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


// Modify the publish statement
// Only publish tasks that are public or belong to the current user
if (Meteor.isServer) {
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

}
