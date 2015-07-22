// Meteor.method() definitions
Meteor.methods({
  addBlockedTime: function ( date, startTime, endTime) {

    var  timeDiff = moment.utc(moment(endTime,"HH:mm").diff(moment(startTime,"HH:mm")));
    var timeDiff = parseInt(timeDiff.format("HH")) + parseInt(timeDiff.format("mm"))/60;
    Blockedtimes.insert({"user": Meteor.userId(),"date" : new Date(date), "startTime" : startTime,
    "endTime" : endTime, "timeDiff" : timeDiff});
  }

});
