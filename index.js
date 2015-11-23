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
      id: bind($('.delete'), bindButton),
      complete: bind($('.complete'), bindCheckbox),
      value: bind($('.value'))
    })
  });

  function bindButton(node, value, oldValue, index) {
    node.value = value;
    node.addEventListener('click', function() {
      delete data.tasks[this.value];
      data.tasks = data.tasks;
    });
  }

  function bindCheckbox(node, value, oldValue, index) {
    node.checked = value;
    node.addEventListener('change', function() {
      if (this.checked) {
        this.parentElement.classList.add('complete');
      } else {
        this.parentElement.classList.remove('complete');
      }
    });
  }

  // when loaded, our remote data is stored here
  var data = {};

  // a container for our rendered HTML
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
      // assign the data, triggering the set method
      data.tasks = data.tasks.concat({
        id: data.tasks.length,
        complete: false,
        value: field.value
      });
      // reset the form
      this.reset();
      return false;
    });
  }).catch(function(err) {
    console.error(err);
  });
})();