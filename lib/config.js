var validation = require("perspective-core").validation;

module.exports = function(env) {

    var jenkinsConfig = {
        username: env.JENKINS_USERNAME,
        password: env.JENKINS_PASSWORD,
        url: env.JENKINS_URL    
    };

    var jenkinsConfigValidationRules = {
        username: {
            required: true
        },
        password: {},
        url: {
            required: true
        }
    }

    var jenkinsValidationErrors = validation(jenkinsConfig, jenkinsConfigValidationRules);

    if (jenkinsValidationErrors) {
        console.error("Missing jenkins config");
        console.error(jenkinsValidationErrors);
        process.exit(1);
    }

    return jenkinsConfig;
}