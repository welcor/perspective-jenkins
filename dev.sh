# Variables set up by this script:
# SERVER_PORT            Port exposed by this component.
# JENKINS_USERNAME       Username for jenkins instance
# JENKINS_URL            URL to jenkins frontpage
# SERVER_ALLOWED_ORIGIN  Allowed adress for contacting this server.

 SERVER_PORT=8888 JENKINS_USERNAME="hei" JENKINS_URL="http://localhost:9999" SERVER_ALLOWED_ORIGIN="http://localhost:8000" nodemon index.js
