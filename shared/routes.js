// shared server/client routes
Router.route('/logwork/:_id', {
    template: 'logWork',
    data: function(){
        var currentList = this.params._id;
        return Projects.findOne({ _id: currentList });
    }
});

Router.route('/', {
    template: 'home'
});
