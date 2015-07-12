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
      return Projects.find({ checked: { $ne: true }}, {sort: { deadline: -1 } });
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
    Meteor.call("updateCalendar");


    // Clear form
    event.target.projectname.value = "";


    //return false;
  },
  "change .hide-completed input": function (event) {
    Session.set("hideCompleted", event.target.checked);
  },
  "click .toggle-private": function () {
    //Meteor.call("setPrivate", this._id, !this.private);
    Meteor.call("updateCalendar");
  }
});

Template.project.events({
  "click .toggle-checked": function () {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this._id, !this.checked);
  },
  "click .delete": function () {
    Meteor.call("deleteProject", this._id);
  }
});
