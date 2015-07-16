// shared server/client routes
Router.configure({
  layoutTemplate: 'main'
});

Router.route('/logwork/:_id', {
  name: 'logWork',
  template: 'logWork',
  data: function(){
    var currentList = this.params._id;
    return Projects.findOne({ _id: currentList });
  },
  onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.render("login");
        }
    }
});

Router.route('/', {
    name: 'home',
  template: 'home'
});

Router.route('/addblockedtime', {
  name: 'addBlockedTime',
  template: 'addBlockedTime',
  data: function(){
    var currentList = this.params._id;
    return Blockedtimes.findOne();
  }
});
