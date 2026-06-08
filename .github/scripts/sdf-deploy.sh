#!/bin/bash

# setup Netsuite authentication
suitecloud account:savetoken --account $3 --authid esp-prod-ci --tokenid $1 --tokensecret $2

suitecloud project:deploy --accountspecificvalues ERROR

#remove credentials
suitecloud account:manageauth --remove esp-prod-ci

