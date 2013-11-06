var Q = require('q');
var _ = require('underscore');

var JenkinsService = function(jenkinsRepository) {
  this.repository = jenkinsRepository;
};

JenkinsService.prototype = {
  jobs: function() {
    return this.repository.jobs();
  },
  pollJobs: function(interval, jobsChangedCallback) {
    var service = this;
    var last_changed_jobs = [];

    var doneCallback = function(jobs) {
      var jobsAreEqual = _.isEqual(jobs, last_changed_jobs);

      if (!jobsAreEqual) {
        last_changed_jobs = jobs;
        jobsChangedCallback(last_changed_jobs);
      }
    };

    setInterval(function() {
      service.repository.jobs().then(doneCallback).fail(function() {});
    }, interval);
  }
};

module.exports = JenkinsService;