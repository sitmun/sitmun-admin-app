#!/bin/bash
# This script runs the e2e tests only if it can connect first to the testdeployment API
# Must be called from the root of the project, i.e.: ./build-scripts/conditional-conditional-e2e.sh

# Take the base URL of the backend API from the testdeployment environment
# This is fragile as some changes to environment.testdeployment.ts can break this
# But if it gets the wrong API URL at least it won't break the build. It will just skip the e2e tests.
API_URL_LINE_IN_ENV_FILE=$(grep apiBaseURL src/environments/environment.testdeployment.ts)
# Keep the part in quotes
API_URL=${API_URL_LINE_IN_ENV_FILE#*\'}
API_URL=${API_URL%\',}
echo $API_URL

# Try connecting to the test deployment API. As it may need to "wake up"
# we allow for up to 10 retries with 10 seconds between them
CURL_VALUE="$(curl -Is --retry 10 --retry-delay 10 $API_URL/api/ | head -1)"
if [[ "$CURL_VALUE" == *"204"* ]] ;
then
  # It uses the headless configuration, so it can run in Travis
  npm run e2e -- --protractor-config=e2e/protractor.conf.headless.js --configuration=testdeployment
else
  echo "I am unable to connect to the test deployment API. I won't run the E2E tests."
fi
