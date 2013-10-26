var request = require('request');
var logger = require('./jenkinsLogger');
var Q = require('q');

var colorToStatus = {
  red: 'failed',
  red_anime: 'building_failed',
  yellow: 'unstable',
  yellow_anime: 'building_unstable',
  blue: 'ok',
  blue_anime: 'building_ok',
  grey: 'disabled',
  grey_anime: 'building_disabled',
  notbuilt: 'not_built',
  notbuilt_anime: 'building_not_built'
};

var JenkinsRepository = function(config) {
  this.config = config;
};

JenkinsRepository.prototype = {
  jobs: function() {
    var deferred = Q.defer();

    this._request({
      url: '/api/json',
      method: 'GET'
    }
    ,
    {
      200: function(err, res, body) {
        var info = JSON.parse(body);

        var jobs = [];

        info.jobs.forEach(function(job) {
          jobs.push({
            name: job.name,
            status: colorToStatus[job.color]
          });
        });

        deferred.resolve(jobs);
      }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
  },
  _request: function(options, handlers, errCallback) {

    options = options || {};

    options.url = this.config.url + options.url;

    options.auth = {
      'user': this.config.username,
      'pass': this.config.password
    };

    request(options, function(err, res, body) {

      if (err) {
        logger.error(err);
      }

      res = res || {};

      var handler = handlers[res.statusCode];
      var handlerType = typeof handler;

      if (handlerType === "function") {
        handler(err, res, body);
      } else if (res.statusCode === 401) {
        var error = new Error("Invalid username/password");
        errCallback(error);
        logger.error(error);
      } else if (res.statusCode === 404) {
        var error = new Error("Job does not exist");
        errCallback(error);
        logger.error(error);
      } else {
        var error = new Error("Error occurred with statusCode: " + res.statusCode + " and error: " + body);
        errCallback(error);
        logger.error(error);
      }
    });

  }
};



module.exports = JenkinsRepository;