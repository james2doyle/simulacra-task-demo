(function viaFetch() {
  var bind = window.simulacra;
  // load the template as HTML DOM elements
  var fragment = document.getElementById('tasks').content;

  // wrapper for grabbing the template fragment elements
  window.$ = function(selector) {
    return fragment.querySelector(selector);
  };

  // we create a virtual map for our data
  var bindings = bind(fragment, {
    header: bind($('.header')),
    tasks: bind($('.task'), {
      complete: bind($('.complete')),
      value: bind($('.value'))
    })
  });

  var data = {};
  var app = document.getElementById('app');

  // do a GET for our JSON data
  fetch('tasks.json')
  .then(function(response) {
    return response.json();
  }).then(function(res) {
    // set up our data to be manipulated later
    data = res.data;
    return data;
  }).then(function(tasks) {
    // render the HTML
    return bind(tasks, bindings);
  }).then(function(html) {
    // throw the HTML in our "app" container
    app.appendChild(html);
    return app;
  }).then(function(container) {
    var field = container.querySelector('#newtask');
    field.focus();
    // grab the form and listen for submits
    container.querySelector('#addTask').addEventListener('submit', function(event) {
      event.preventDefault();
      // because of the setters and getters we need to copy the array
      var arr = data.tasks;
      // here is the new task to add
      arr.push({
        complete: false,
        value: field.value
      });
      // assign the data, triggering the set method
      data.tasks = arr;
      // reset the form
      this.reset();
      return false;
    });
  }).catch(function(err) {
    console.error(err);
  });
})();