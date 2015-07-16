// Meteor.method() definitions
Meteor.methods({
  updateCalendar: function () {

    //remove current calendars
    Calendars.remove({user: this.userId});

    var btimes = Blockedtimes.aggregate([
      { $group: {  _id: "$date", total: { $sum: "$timeDiff" }  } },
      { $sort: { _id: 1} }
    ]);
    var arrayBtimes = [];
    var btime = { date: new Date(moment().startOf("day").toISOString()),
    blockedHours: 0 };

    btimes.forEach(function(blockedTime){
      while(!(moment(blockedTime._id).startOf('day').isSame(moment(btime.date).startOf('day')))) {
        arrayBtimes.push(btime.blockedHours);
        btime = { date: new Date(moment(btime.date).add(1,'days').toISOString()),
        blockedHours: 0 };
      }
      btime.blockedHours = blockedTime.total;
      arrayBtimes.push(btime.blockedHours);
      btime = { date: new Date(moment(btime.date).add(1,'days').toISOString()),
      blockedHours: 0 };
    });


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
        currentDate.projects.push(  {"_id":project._id, "name": project.name, "hours": hours});
        /*
        Calendars.update({user: this.userId},
        { $push: { days: {"date" : currentDate,
        "projects" : [
        {"name": project.name, "hours": hours}]
        }}});
        */
        // clears the day
        hoursLeft = hoursLeft - hours;
        document.days.push(currentDate);
        currentDate = { "date" : new Date(moment(currentDate.date).add(1,'days').toISOString()),
        "projects" : [] };
        currentDayHours = updateCurrentDayHours(currentDayHours, currentDate, arrayBtimes );
        //in case of new day
        while(currentDayHours == 8) {
          document.days.push(currentDate);
          currentDate = { "date" : new Date(moment(currentDate.date).add(1,'days').toISOString()),
          "projects" : [] };
          currentDayHours = updateCurrentDayHours(currentDayHours, currentDate, arrayBtimes );
        }


      }

      if (hoursLeft > 0) {
        currentDate.projects.push(  {"_id":project._id,"name": project.name, "hours": hoursLeft});
        currentDayHours = currentDayHours + hoursLeft;
      }



      //in case of new day
      if(currentDayHours == 8) {


        document.days.push(currentDate);
        currentDate = { "date" : new Date(moment(currentDate.date).add(1,'days').toISOString()),
        "projects" : [] };
        currentDayHours = updateCurrentDayHours(currentDayHours, currentDate, arrayBtimes );

      }
    });

    // the last
    if (currentDate.projects.length >0) document.days.push(currentDate);
    Calendars.insert(document);


  },
  logWork: function ( projectId, percCompletion, hours, hoursWorked) {
    Projects.update({_id: projectId},{
      $set:{"percCompletion" : percCompletion,
      "duration" : (hours+hoursWorked)/(percCompletion/100)},
      $push: { logs: {"time" : new Date(), "percCompletion" : parseInt(percCompletion),
      "hours" : hours}},
      //
      $inc:{"hoursWorked" : parseInt(hours)}
    });
  },

  addBlockedTime: function ( date, startTime, endTime) {

    var  timeDiff = moment.utc(moment(endTime,"HH:mm").diff(moment(startTime,"HH:mm")));
    var timeDiff = parseInt(timeDiff.format("HH")) + parseInt(timeDiff.format("mm"))/60;
    Blockedtimes.insert({"user": Meteor.userId(),"date" : new Date(date), "startTime" : startTime,
    "endTime" : endTime, "timeDiff" : timeDiff});
  }

});


//auxiliary function that returns how many hours available in the day takes out blocked times
function updateCurrentDayHours(currentDayHours, currentDate, blockedTimes ) {
  var today = moment().startOf("day");
  var current = moment(currentDate.date);
  var numberOfDays = current.diff(today,'days');
  var teste = blockedTimes[numberOfDays];
  var compare = (blockedTimes[numberOfDays] > 0);
  compare = (teste > 0.0);
  if ((blockedTimes.length > numberOfDays) && (blockedTimes[numberOfDays] > 0))  {
    currentDate.projects.push({"_id":null,"name": "Blocked Time", "hours": blockedTimes[numberOfDays]});
    return blockedTimes[numberOfDays];
  } else {
    return 0;
  }
}
