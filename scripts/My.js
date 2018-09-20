$(document).ready(function () {
    $('button').click(function () {
        $('#todo').append("<ul>" + $("input[name=todotext]").val() + " <a href='#' class='close' aria-hidden='true'>&times;</a></ul>");
    });
    $("body").on('click', '#todo a', function () {
        $(this).closest("ul").remove();
    });
});






// Class to represent a todo item
function TodoItem(id, stufftodo) {
    var self = this;
    self.todoid = id;
    self.todotext = stufftodo;
}

// Overall viewmodel for this screen, along with initial state
function AppViewModel() {
    var self = this;

    

    self.addtodoid = ko.observable('');
    self.addtodotext = ko.observable('');

    self.addItem = function() {

       var toAdd = new TodoItem(this.addtodoid, this.addtodotext ) ;

       self.todolist.push(toAdd);
       var toAddJSON = ko.toJSON(toAdd);
      // console.log(JSON.stringify(toAdd));
       $.ajax({
    			type: 'POST',
    			url: "https://nxdhmnoeo6.execute-api.us-east-1.amazonaws.com/v1/todos" ,
    			dataType: 'json',
		    	//data: JSON.stringify("")
		    	data: toAddJSON
		});

       self.addtodoid = ko.observable('');
       self.addtodotext = ko.observable('');
    }

    self.todolist = ko.observableArray([
        new TodoItem("1", "test1" ),
        new TodoItem("2", "test2")
    ]);

    $.getJSON("https://nxdhmnoeo6.execute-api.us-east-1.amazonaws.com/v1/todos/", function(allData) {
        var mappedItems = $.map(allData, function(item) { return new TodoItem(item.todoid, item.todotext) });


        self.todolist(mappedItems);
    });   

    self.removeItem = function(){
		//self.todolist.remove(this);

		var toDelete =  JSON.stringify(this);  

		$.ajax({
    			type: 'DELETE',
    			url: "https://nxdhmnoeo6.execute-api.us-east-1.amazonaws.com/v1/todos/singleitem" ,
    			dataType: 'json',
		    	data: toDelete
		});

		self.todolist.destroy(this)
	}

   //this.test = ko.observable("SimpleBindingTest");
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());