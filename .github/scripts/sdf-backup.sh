#!/bin/bash

mkdir -p backup/staging

#copy deploy and manifest to backup
cp src/manifest.xml backup/staging
cp src/deploy.xml backup/staging

cd backup/staging

# setup Netsuite authentication
suitecloud account:savetoken --account $3 --authid esp-prod-ci --tokenid $1 --tokensecret $2

# parse deploy.xml file and extract files to backup from NetSuite
xmlstarlet sel -T -t -m /deploy/files/path -v . -n ../../src/deploy.xml | while IFS= read -r line ; do
    # take the file cabinate string off the beginning of the path for each line
    replaced_line=$(sed 's/\~\/FileCabinet//g' <<< $line)

    echo $replaced_line

    #pull the files down into the backup directory
    suitecloud file:import --paths $replaced_line
done

# parse deploy.xml file and extract record files to backup from NetSuite
xmlstarlet sel -T -t -m /deploy/objects/path -v . -n ../../src/deploy.xml | while IFS= read -r line ; do
    # take the file cabinate string off the beginning of the path for each line
    first_directory=$(echo $line | cut -d'/' -f 2)
    # combine first and second path
    directory=$first_directory/$(echo $line | cut -d'/' -f 3)
    mkdir -p $directory
    # grab the script id from the file name
    scriptid=$(echo $line | cut -d'/' -f 4 | sed "s/\.xml//g")
    
    #pull the objects down into the backup directory
    suitecloud object:import --destinationfolder "/$directory" --scriptid $scriptid --type ALL
done

#get todays date for the file name
today=`date +%m.%d.%Y.%H_%M_%S`

cd ../../

#zip the staging folder
zip -r backup/ns_release_backup_$today.zip backup/staging

#remove the folder
rm -rf backup/staging

#remove credentials
suitecloud account:manageauth --remove esp-prod-ci


