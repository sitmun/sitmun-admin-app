#!/bin/bash
echo
echo "Deploying to testdeployment configuration ..."
echo

if [ -n "$GITHUB_API_KEY" ]; then
     mkdir tmp
     cd tmp
     git clone https://github.com/sitmun/sitmun.github.io.git
     cd sitmun.github.io
     cp -r "$TRAVIS_BUILD_DIR"/dist/admin-app .
     git add admin-app/*
     git commit -m "Deployment of the sitmun-admin-app client"
#    # Make sure to make the output quiet, or else the API token will leak!
#    # This works because the API key can replace your password.
      git push -q https://$USERNAME:$GITHUB_API_KEY@github.com/sitmun/sitmun.github.io master &>/dev/null
     cd ../..
     rm -r -f tmp
fi
