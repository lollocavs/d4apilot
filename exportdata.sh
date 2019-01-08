#!/bin/bash

echo "Exporting Data from MongoDB container ..."
docker exec -i d4apilot_d4a_mongodb_1  mongoexport --db mongod4a --collection reports --type=json --out ./reports.json --jsonArray
echo "Copying report file on host machine ..."
docker cp d4apilot_d4a_mongodb_1:/reports.json .
echo "Splitting Reports in seperated files ..."
node splitReports.js
#docker cp ./reports.json d4apilot_d4a_app_1:/
#docker exec -i d4apilot_d4a_app_1 node splitReports.js
#docker cp d4apilot_d4a_app_1:/usr/src/app/reports/ .
echo "Removing obsolete files ..."
rm reports.json
