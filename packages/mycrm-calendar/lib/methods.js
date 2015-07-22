// Meteor.method() definitions
Meteor.methods({
  updateCalendar: function () {

    //remove current calendars
    Calendars.remove({user: this.userId});

    var currentDay = new Date(moment().startOf("day").toISOString());

    var btimes = Blockedtimes.find({date:{$gte: currentDay}},{sort:{ date: 1}});
    /*Blockedtimes.aggregate([
    { $group: {  _id: "$date", total: { $sum: "$timeDiff" }  } },
    { $sort: { _id: 1} }
    ]);*/
    var arrayBtimes = [];
    var btime = { date: new Date(moment().startOf("day").toISOString()),
    blockedHours: 0 };

    btimes.forEach(function(blockedTime){
      while(!(moment(blockedTime.date).startOf('day').isSame(moment(btime.date).startOf('day')))) {
        arrayBtimes.push(btime);
        btime = { date: new Date(moment(btime.date).add(1,'days').toISOString()),
        blockedHours: 0 };
      }
      if((arrayBtimes.length > 0) &&
      (moment(blockedTime.date).startOf('day').isSame(moment(arrayBtimes[arrayBtimes.length-1].date).startOf('day'))))
      {
        arrayBtimes[arrayBtimes.length-1].blockedHours = arrayBtimes[arrayBtimes.length-1].blockedHours +
        blockedTime.timeDiff;
      } else {
        btime = { date: new Date(moment(blockedTime.date).toISOString()),
        blockedHours: blockedTime.timeDiff };
        arrayBtimes.push(btime);

      }

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
  if ((blockedTimes.length > numberOfDays) && (blockedTimes[numberOfDays].blockedHours > 0))  {
    currentDate.projects.push({"_id":null,"name": "Blocked Time",
    "hours": blockedTimes[numberOfDays].blockedHours});
    return blockedTimes[numberOfDays].blockedHours;
  } else {
    return 0;
  }
}
