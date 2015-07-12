Projects = new Mongo.Collection("projects");
Calendars = new Mongo.Collection("calendars");

if (Meteor.isClient) {

  // this allows after descontinue the autopublish
  Meteor.subscribe("projects");
  Meteor.subscribe("calendars");



  // to add the private function
  Template.project.helpers({
    isOwner: function () {
      return this.owner === Meteor.userId();
    }
  });

  Template.registerHelper('formatDate', function(date) {
    return moment(date).format('dddd (MMM Do)');
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
    calendars: function() {
      return Calendars.findOne().days;

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
  },

  updateCalendar: function () {
    //remove current calendars
    Calendars.remove({user: this.userId});
    // get the future projects
    var futureProjects = Projects.find( { "deadline" : { "$gte" : new Date()  } },
    {sort: { deadline: 1 } });

    var totalHours=0;

    var currentDayHours = 0;
    var currentDate = { "date" : new Date(), "projects" : [] };
    var document = { user: this.userId, total: totalHours, days : []};


    //Calendars.update({user: this.userId},  {$push: { days: {total: totalHours}}});

    futureProjects.forEach(function(project){

      totalHours = totalHours + project.duration;

      var hoursLeft=project.duration;
      while((hoursLeft+currentDayHours)>8) {
        var hours = 8-currentDayHours;
        currentDate.projects.push(  {"name": project.name, "hours": hours});
        /*if(currentDayHours = 0) {
        Calendars.update({user: this.userId},
        { $push: { days: {"date" : currentDate,
        "projects" : [
        {"name": project.name, "hours": hours}]
        }}});
        } else {
        //if already exists
        Calendars.update({"user": this.userId, "days.date" : currentDate },
        { "$push" : { "days.$.projects" :
        {"name": project.name,"hours": hours}
        }});
        }*/

        // clears the day
        hoursLeft = hoursLeft - hours;
        currentDayHours =0;
        document.days.push(currentDate);
        currentDate = { "date" : new Date(moment(currentDate.date).add(1,'days').toISOString()),
        "projects" : [] };
      }

      /*if(currentDayHours = 0) {
      Calendars.update({user: this.userId},
      { $push: { days: {"date" : currentDate,
      "projects" : [
      {"name": project.name, "hours": hoursLeft}]
      }}});
      currentDayHours = hoursLeft;
      } else {
      //if already exists
      Calendars.update({"user": this.userId, "days.date" : currentDate },
      { "$push" : { "days.$.projects" :
      {"name": project.name,"hours": hoursLeft}
      }});
      }*/
      if (hoursLeft > 0) {
        currentDate.projects.push(  {"name": project.name, "hours": hoursLeft});
        currentDayHours = currentDayHours + hoursLeft;
      }



      //in case of new day
      if(currentDayHours == 8) {
        currentDayHours =0;
        document.days.push(currentDate);
        currentDate = { "date" : new Date(moment(currentDate.date).add(1,'days').toISOString()),
        "projects" : [] };
      }
    });

    // the last
    if (currentDate.projects.length >0) document.days.push(currentDate);
    Calendars.insert(document);


  }
});


// Modify the publish statement
// Only publish tasks that are public or belong to the current user
if (Meteor.isServer) {
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




}
