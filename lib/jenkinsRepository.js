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
  notbuilt_anime: 'budiling_not_built'
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
    }, function() {
        deferred.reject();
    });

    return deferred.promise;
  },
  _request: function(options, handlers, errCallback) {

    var deferred = Q.defer();

    options = options || {};

    options.url = this.config.baseURI + options.url;

    options.auth = {
      'user': this.config.username,
      'pass': this.config.password
    };

    request(options, function(err, res, body) {

      if (err) {
        logger.error(err);
      }

      var handler = handlers[res.statusCode];
      var handlerType = typeof handler;

      if (handlerType === "function") {
        handler(err, res, body);
      } else if (res.statusCode === 401) {
        errCallback();
        logger.error("Invalid username/password");
      } else if (res.statusCode === 404) {
        errCallback();
        logger.error("Job does not exist");
      } else {
        errCallback();
        logger.error("Error occurred with statusCode: " + res.statusCode + " and error: " + body);
      }
    });

    return deferred.promise;
  }
};



module.exports = JenkinsRepository;