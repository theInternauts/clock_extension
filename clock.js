
window.onload = function() {
  App.getRuntime();
}


App = (function() {
  var instance;
  var clocks = [];
  var settings = [
    {
      tz: "Asia/Tokyo"
    },
    {
      tz: "America/Los_Angeles"
    }
  ];

  function init() {
    build();
    render();

    instance = {
      clocks: function() {
        return clocks;
      }
    };
    return instance;
  }

  function build() {
    settings.forEach(function(config) {
      var clock = new Clock(config);
      clock.rootNode().addEventListener('projectionEvent', function(evt) {
        processTimeProjectionOnAllClocks(evt.detail)
      })
      clocks.push(clock);
    })
  }

  function render() {
    processTimeProjectionOnAllClocks();
  }

  function processTimeProjectionOnAllClocks(data) {
    clocks.forEach(function(clock) {
      clock.convertTimeProjection(data);
    })
  }

  return {
    getRuntime: function() {
      if(!instance) {
        instance = init();
      }
      return instance;
    }
  }
}())

function Clock(config) {
  var id;
  var randomInt = Math.floor(Math.random()*10000);
  var date;
  var rootNode;
  var clockNode;
  var ctx;
  var secHandLength = 60;
  var width = 400;
  var height = 170;
  var tzList = moment.tz.names();
  var config = config;
  var timeProjectionInput;

  function init() {
    build();
    start();
  }
  function render() {
    OUTER_DIAL1();
    OUTER_DIAL2();
    CENTER_DIAL();
    MARK_THE_HOURS();
    MARK_THE_SECONDS();

    SHOW_SECONDS();
    SHOW_MINUTES();
    SHOW_HOURS();
  }
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  function build() {
    canvas = document.createElement('canvas');
    canvas.setAttribute("id", `canvas-${randomInt}`)
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);
    ctx = canvas.getContext('2d');

    rootNode = document.getElementsByTagName('body')[0];
    clockNode = document.createElement("div");
    clockNode.setAttribute("class", "clockNode");

    clockNode.append(canvas);
    buildSelect(clockNode, config.tz);
    buildInput(clockNode, config.tz);
    rootNode.append(clockNode);
    date = moment(new Date()).tz(config.tz);

    render();
  }
  function tick() {
    clear();
    date = moment(new Date()).tz(config.tz);
    render();
  }
  function start() {
    id = setInterval(tick, 1000);
  }
  function stop() {
    if(id) {
      clearInterval(id);
      id = null;
    }
  }

  function OUTER_DIAL1() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, secHandLength + 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#92949C';
    ctx.stroke();
  }
  function OUTER_DIAL2() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, secHandLength + 7, 0, Math.PI * 2);
    ctx.strokeStyle = '#929BAC';
    ctx.stroke();
  }
  function CENTER_DIAL() {
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 2, 0, Math.PI * 2);
    ctx.lineWidth = 3;
    ctx.fillStyle = '#353535';
    ctx.strokeStyle = '#0C3D4A';
    ctx.stroke();
  }
  function MARK_THE_HOURS() {
    for (var i = 0; i < 12; i++) {
      var angle = (i - 3) * (Math.PI * 2) / 12;       // THE ANGLE TO MARK.
      ctx.lineWidth = 1;            // HAND WIDTH.
      ctx.beginPath();

      var x1 = (canvas.width / 2) + Math.cos(angle) * (secHandLength);
      var y1 = (canvas.height / 2) + Math.sin(angle) * (secHandLength);
      var x2 = (canvas.width / 2) + Math.cos(angle) * (secHandLength - (secHandLength / 7));
      var y2 = (canvas.height / 2) + Math.sin(angle) * (secHandLength - (secHandLength / 7));

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.strokeStyle = '#466B76';
      ctx.stroke();
    }
  }
  function MARK_THE_SECONDS() {
    for (var i = 0; i < 60; i++) {
      var angle = (i - 3) * (Math.PI * 2) / 60;       // THE ANGLE TO MARK.
      ctx.lineWidth = 1;            // HAND WIDTH.
      ctx.beginPath();

      var x1 = (canvas.width / 2) + Math.cos(angle) * (secHandLength);
      var y1 = (canvas.height / 2) + Math.sin(angle) * (secHandLength);
      var x2 = (canvas.width / 2) + Math.cos(angle) * (secHandLength - (secHandLength / 30));
      var y2 = (canvas.height / 2) + Math.sin(angle) * (secHandLength - (secHandLength / 30));

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.strokeStyle = '#C4D1D5';
      ctx.stroke();
    }
  }

  function SHOW_SECONDS() {
    var sec = date.seconds();
    var angle = ((Math.PI * 2) * (sec / 60)) - ((Math.PI * 2) / 4);
    ctx.lineWidth = 0.5;              // HAND WIDTH.

    ctx.beginPath();
    // START FROM CENTER OF THE CLOCK.
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    // DRAW THE LENGTH.
    ctx.lineTo((canvas.width / 2 + Math.cos(angle) * secHandLength),
      canvas.height / 2 + Math.sin(angle) * secHandLength);

    // DRAW THE TAIL OF THE SECONDS HAND.
    ctx.moveTo(canvas.width / 2, canvas.height / 2);    // START FROM CENTER.
    // DRAW THE LENGTH.
    ctx.lineTo((canvas.width / 2 - Math.cos(angle) * 20),
      canvas.height / 2 - Math.sin(angle) * 20);

    ctx.strokeStyle = '#586A73';        // COLOR OF THE HAND.
    ctx.stroke();
  }

  function SHOW_MINUTES() {
    var min = date.minutes();
    var angle = ((Math.PI * 2) * (min / 60)) - ((Math.PI * 2) / 4);
    ctx.lineWidth = 1.5;              // HAND WIDTH.

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);  // START FROM CENTER.
    // DRAW THE LENGTH.
    ctx.lineTo((canvas.width / 2 + Math.cos(angle) * secHandLength / 1.1),
      canvas.height / 2 + Math.sin(angle) * secHandLength / 1.1);

    ctx.strokeStyle = '#999';  // COLOR OF THE HAND.
    ctx.stroke();
  }

  function SHOW_HOURS() {
    var hour = date.hours();
    var min = date.minutes();
    var angle = ((Math.PI * 2) * ((hour * 5 + (min / 60) * 5) / 60)) - ((Math.PI * 2) / 4);
    ctx.lineWidth = 1.5;              // HAND WIDTH.

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);     // START FROM CENTER.
    // DRAW THE LENGTH.
    ctx.lineTo((canvas.width / 2 + Math.cos(angle) * secHandLength / 1.5),
      canvas.height / 2 + Math.sin(angle) * secHandLength / 1.5);

    ctx.strokeStyle = '#000';   // COLOR OF THE HAND.
    ctx.stroke();
  }

  function buildSelect(rootNode, initValue) {
    var selectLbl = `tz-select-${randomInt}`;
    var lbl = document.createElement("label");
    lbl.setAttribute("for", selectLbl);
    lbl.innerText = "Choose a timezone";

    var select = document.createElement("select");
    select.setAttribute("id", selectLbl);
    tzList.forEach(function(zone) {
      var option = document.createElement("option");
      option.setAttribute("value", zone);
      if(zone == initValue) {
        option.setAttribute("selected", null);
      }
      option.innerText = zone;
      select.append(option);
    });

    rootNode.append(select);

    select.addEventListener("change", function(evt) {
      config.tz = evt.currentTarget.value;
      date.tz(evt.currentTarget.value);
      clear();
      render();
    })
  }

  function buildInput(rootNode, tz) {
    timeProjectionInput = document.createElement('input');
    timeProjectionInput.setAttribute('class', `timeProjectionInput-input`);
    timeProjectionInput.setAttribute('id', `timeProjectionInput-${randomInt}`);

    rootNode.append(timeProjectionInput);

    timeProjectionInput.addEventListener("change", function(evt) {
      dispatchProjectionEvent(evt);
    });
  }

  function dispatchProjectionEvent(evt) {
    evt.target.dispatchEvent(new CustomEvent('projectionEvent', {
      bubbles: true,
      detail: moment(new Date(evt.target.value)).tz(config.tz)
    }));
  }

  function convertTimeProjection(momentTimeObj) {
    if (momentTimeObj && momentTimeObj != null && momentTimeObj != {}) {
      var newDate = momentTimeObj.clone().tz(config.tz);
      timeProjectionInput.value = newDate;
    } else {
      timeProjectionInput.value = date;
    }
  }

  init();
  return {
    id: function() {
      return id || false
    },
    start: function() {
      if(!id) {
        start();
      }
      return id;
    },
    stop: function() {
      stop();
    },
    convertTimeProjection: function(momentTimeObj) {
      convertTimeProjection(momentTimeObj);
    },
    rootNode: function() {
      return rootNode;
    }
  }
}