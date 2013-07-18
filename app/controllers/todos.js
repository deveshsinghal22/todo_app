var Todos = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
      var self = this;

      var config = {

          sort : {
          
              title : 'asc',
              status: 'asc'
          
          }
      }
      
      var sort = (params.sortBy) ? JSON.parse(params.sortBy) : config.sort;
      var query = (params.query) ? JSON.parse(params.query) : null;
      var pageLimit = geddy.config.pagelimit;
      var currentPage = params.currentPage || 0;
      var skip = currentPage == 1 ? 0 : (currentPage * pageLimit);

      var db = geddy.model.loadedAdapters.Todo.client;
      db.collection('todos');
       
      db.todos.count(function (err, num) {

          params.recordCount = num;
          params.totalPages = Math.round(num / pageLimit);

          if (query) {

              geddy.model.Todo.all(query, {nocase:true}, function (err, todos) {

    
                  self.respond({ params: params, todos: todos, config: config });

     
              });

          }
          
          geddy.model.Todo.all({}, { sort: sort, limit: pageLimit, skip: skip }, function (err, todos) {
             
           //  setTimeout(function () {

                      self.respond({ params: params, todos: todos, config: config });

             //     }, Math.floor(Math.random() * 1000))

              });
  
      });
     
 
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , todo = geddy.model.Todo.create(params);

    if (!todo.isValid()) {
      params.errors = todo.errors;
      self.transfer('add');
    }

    todo.save(function(err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      } else {
        self.redirect({controller: self.name});
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.first(params.id, function(err, todo) {
      if (!todo) {
        var err = new Error();
        err.statusCode = 404;
        self.error(err);
      } else {
        self.respond({params: params, todo: todo.toObj()});
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.first(params.id, function(err, todo) {
      if (!todo) {
        var err = new Error();
        err.statusCode = 400;
        self.error(err);
      } else {
        self.respond({params: params, todo: todo});
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.first(params.id, function(err, todo) {
      todo.updateProperties(params);
      if (!todo.isValid()) {
        params.errors = todo.errors;
        self.transfer('edit');
      }

      todo.save(function(err, data) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        } else {
          self.redirect({controller: self.name});
        }
      });
    });
  };

  this.destroy = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.remove(params.id, function(err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      } else {
        self.redirect({controller: self.name});
      }
    });
 
 };

  this.dummy = function (req, resp, params) {
      var self = this;
        
      if (params.dummyData) {
       
     
          var db = geddy.model.loadedAdapters.Todo.client;
          db.collection('todos');
          db.todos.drop();

          var dummyData = "Glenna|Stacey|Linus|Denton|Dylan|Hanna|Danielle|Haley|Kerry|Amity|Kieran|Miranda|Otto|Lacota|Brenda|Raya|Calvin|Valentine|Vaughan|Cara|Oscar|Price|Madonna|Stephanie|Rigel|Eagan|Paul|Lee|Eliana|Gail|Isadora|Martha|Clayton|Amery|Thor|Jocelyn|Ima|Cairo|Simon|Xavier|Cheyenne|Holly|Marsden|Veda|Yardley|Quail|Nyssa|Briar|Nash|Martina|Edan|Illiana|Hop|Timothy|Emily|Colin|Chelsea|Amelia|Rhea|Jescie|Harding|Daria|Britanney|Len|Eliana|Allegra|Astra|Nomlanga|Chandler|Venus|Mufutau|Hall|Garrison|Francis|Ethan|Fay|Baxter|Alea|Isaac|Randall|Michael|Olivia|Clinton|Avye|Mara|Kaden|Emery|Salvador|Kirby|Bell|Evan|Vera|Galvin|Inga|Katell|Maggie|Jayme|Lester|Garth|Marvin";

          var arrDummyData = dummyData.split('|');
           for (var i = 0; i < arrDummyData.length ; i++) {
                        
              var rnd = Math.round(Math.random() * 100);
              var status = (rnd % 2) == 0 ? 'open' : 'closed';
              var todo = geddy.model.Todo.create({title:arrDummyData[i], status:status});
             
              todo.save(function (err, data) {
                  if (err) {
                      alert(err);
                      params.errors = err;
                  
                  } else {
                     
                  }
              });
          
          }
      }
   
    
     self.respond({ params: params});
  }
 

};

exports.Todos = Todos;
