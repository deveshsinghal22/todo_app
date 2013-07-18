
$(document).ready(function () {
    $('#dump').click(function () {
        var txtTodo = $('#txtDump');
       
          
        $.ajax({
            type: "POST",
            url: '/todos/dummy',
            async:false,
            data: { dummyData: txtTodo.val() },
            beforeSend: function () {

               
            },
            success: function () {
                alert('done');
            },
            error: function (data) {

                $('#error').html(JSON.stringify(data));
            }
            
        });



    });
    

    ko.applyBindings(new viewModel());
  
});

var sortViewModel = function (parent) {
    var self = this;
    self.title = ko.observable('');
    self.status = ko.observable('');
    self.columns = [];
    self.sortstr = ko.observable('');
     
    self.titleClick = function () {
      
        self.title(self.title() === 'desc' ? 'asc' : 'desc');
    
        self.removeColumn('title');
        self.columns.unshift({ title: self.title() });
        var sortBy = self.createSortParameter();
        parent.loadData(sortBy, null);
        self.sortstr(JSON.stringify(sortBy));
       
    };

    self.statusClick = function () {

        self.status(self.status() === 'desc' ? 'asc' : 'desc');
        self.removeColumn('status');
        self.columns.unshift({ status: self.status() });
        var sortBy = self.createSortParameter();
        parent.loadData(sortBy, null);
        self.sortstr(JSON.stringify(sortBy));
    };
  
    self.removeColumn = function (column) {
        for (var i = 0; i < self.columns.length; i++) {

            for (var p in self.columns[i]) {

                if (p === column) {

                    self.columns.splice(i, 1);

                }

            }

        }
    }

    self.createSortParameter = function() {
        var ret = {};

        for (var i = 0; i < self.columns.length; i++) {

            for (var p in self.columns[i]) {

                ret[p] = self.columns[i][p];
            }
        }

        return ret;
    }

};

var viewModel = function () {
    var self = this;
    self.config = ko.observable('');
    self.todos = ko.observableArray([]);
    self.sort = new sortViewModel(self);
    self.loading = ko.observable(false);
    
    self.searchByTitle = ko.observable(false);
    self.searchByStatus = ko.observable(false);
    self.query = {};
    self.querystr = ko.observable('')
 
    self.searchByTitleClick = function () {
   
        self.titleSearchValue('');
        self.searchByTitle() === true ? self.searchByTitle(false) : self.searchByTitle(true);
        self.gotoPage(1);
    }

    self.titleSearchValue = ko.observable('');
    self.titleSearchValue.subscribe(function (val) {
        if (val.length > 0) {

            var q = { 'title': { 'like': val } };
            var o = self.query;

            self.query= self.merge(o, q);

            self.loadData(null, self.query);

          self.querystr(JSON.stringify(self.query));
        }
        else {

            self.query = {};
            self.gotoPage(1);

        }

    });


    self.merge = function (object, otherObject) {
        var obj = object || {}
          , otherObj = otherObject || {}
          , key, value;

        for (key in otherObj) {
            value = otherObj[key];

            // Check if a value is an Object, if so recursively add it's key/values
            if (typeof value === 'object' && !(value instanceof Array)) {
                // Update value of object to the one from otherObj
                obj[key] = this.merge(obj[key], value);
            }
                // Value is anything other than an Object, so just add it
            else {
                obj[key] = value;
            }
        }

        return obj;
    };


    self.searchByStatusClick = function () {
    
        self.statusSearchValue('');
        self.searchByStatus() === true ? self.searchByStatus(false) : self.searchByStatus(true);
        self.gotoPage(1);
    }


    self.statusSearchValue = ko.observable('');
    self.statusSearchValue.subscribe(function (val) {
        
        if (val.length > 0) {
            var q = { 'status': { 'like': val } };

            var o = self.query;

            self.query = self.merge(o, q);
            self.loadData(null, self.query);

            self.querystr(JSON.stringify(self.query));
        }
        else {
            self.query = {};
            self.gotoPage(1);

        }


    });


    self.totalPages = ko.observable([]);
    self.currentPage = ko.observable(1);

    self.gotoPage = function (pageNumber) {

        self.currentPage(pageNumber);
        self.loadData();
    };
 
    self.loadData = function (sortBy, query) {

        $.ajax({
            url:'/todos.json',
            data: { sortBy: JSON.stringify(sortBy), query: JSON.stringify(query), currentPage: self.currentPage },
            dataType: 'json',
            beforeSend: function (data) {

               self.loading(true);

            },
            success: function (data) {

                self.todos(data.todos);
                self.totalPages(new Array(data.params.totalPages));
                self.loading(false);
             
            } 

        });
      
        return true;
    }

 
}


 