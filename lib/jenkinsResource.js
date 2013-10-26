var resourceErrorsFactory = require('perspective-core-rest').error.factory;

module.exports = function(webSocketServer, restServer, service) {

  var wsChannel = webSocketServer("jenkins");

  var interval = 5*1000;
  service.pollJobs(interval, function(jobs) {
    wsChannel.send("jobs_changed", jobs);
  });

  restServer.route('get', '/jenkins', function(req, res, next) {

    var respond = function(tasks) {
      res.send(200, tasks);
      next();
    };

    service.jobs().
        then(respond).
        fail(resourceErrorsFactory);

  });
};