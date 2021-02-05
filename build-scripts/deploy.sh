#!/bin/bash
echo
echo "Deploying to testdeployment configuration ..."
echo

if [ -n "$GITHUB_API_KEY" ]; then
     mkdir tmp
     cd tmp
     git clone https://github.com/sitmun/sitmun.github.io.git
     cd sitmun.github.io
     cp -r "$GITHUB_WORKSPACE"/dist/admin-app .
     # In GitHub Actions, set user and email for git repo
     if [ -n "$CI" ]; then
        git config user.name "GitHub Actions Bot"
        git config user.email "<>"
     fi
     git add admin-app/*
     git commit -m "Deployment of the sitmun-admin-app client"
#    # Make sure to make the output quiet, or else the API token will leak!
#    # This works because the API key can replace your password.
      git push -q https://$USERNAME:$GITHUB_API_KEY@github.com/sitmun/sitmun.github.io master &>/dev/null
     cd ../..
     rm -r -f tmp
fi
