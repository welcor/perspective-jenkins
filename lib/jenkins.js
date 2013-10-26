var JenkinsRepository = require('./jenkinsRepository');
var JenkinsService = require('./jenkinsService');
var jenkinsResource = require('./jenkinsResource');

var coreRest = require('perspective-core-rest');
var coreWebSocket = require('perspective-core-web-socket');

module.exports = function(env) {
	var serverConfig = coreRest.produceConfig(env);
	var jenkinsConfig = require('./config')(env);

	var repo = new JenkinsRepository(jenkinsConfig);
	var service = new JenkinsService(repo);
	var restServer = coreRest.createServer(serverConfig);
	var webSocketServer = coreWebSocket(restServer.server, serverConfig);

	new jenkinsResource(webSocketServer.api, restServer.api, service);
}


