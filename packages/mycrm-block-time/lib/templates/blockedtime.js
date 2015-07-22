Template.addBlockedTime.events({

  "submit .add-blocked-time": function (event) {
    // This function is called when the new task form is submitted

    // Prevent default form submit
    event.preventDefault();
    var userId= this.userId;
    var date = event.target.date.value;
    var startTime = event.target.startTime.value;
    var endTime = event.target.endTime.value;


    Meteor.call("addBlockedTime", date, startTime, endTime);
    Meteor.call("updateCalendar");


    // Clear form
    event.target.date.value = "";


    //return false;
  }
});
