var JenkinsRepository = require('./jenkins-repository');
var JenkinsService = require('./jenkins-service');
var jenkinsResource = require('./jenkins-resource');

var coreRest = require('perspective-core-rest');
var coreWebSocket = require('perspective-core-web-socket');

var produceJenkinsConfig = require('./config')

module.exports = function(env) {
	var repo = new JenkinsRepository(produceJenkinsConfig(env));
	var service = new JenkinsService(repo);

  var serverConfig = coreRest.produceConfig(env);
	var restServer = coreRest.createServer(serverConfig);
	var webSocketServer = coreWebSocket.createServer(restServer.server, serverConfig);

	new jenkinsResource(webSocketServer, restServer, service);
};


