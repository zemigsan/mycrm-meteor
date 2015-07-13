// Meteor.method() definitions
Meteor.methods({
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
        currentDayHours =0;
        document.days.push(currentDate);
        currentDate = { "date" : new Date(moment(currentDate.date).add(1,'days').toISOString()),
        "projects" : [] };
      }

      if (hoursLeft > 0) {
        currentDate.projects.push(  {"_id":project._id,"name": project.name, "hours": hoursLeft});
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
  }

});
