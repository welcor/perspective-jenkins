var JenkinsRepository = require('./lib/jenkinsRepository');
var JenkinsService = require('./lib/jenkinsService');
var jenkinsResource = require('./lib/jenkinsResource');

module.exports = function(api, config) {

  return {
    setup: function() {
      var repo = new JenkinsRepository(config);
      var service = new JenkinsService(repo);
      new jenkinsResource(api.webSocketServer, api.restServer, service);
    }
  };

};