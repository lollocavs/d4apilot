#!/bin/bash

docker exec -i d4apilot_d4a_mongodb_1  mongoexport --db mongod4a --collection reports --type=json --out ./reports.json --jsonArray
docker cp d4apilot_d4a_mongodb_1:/reports.json .
docker cp ./reports.json d4apilot_d4a_app_1:/
docker exec -i d4apilot_d4a_app_1 node splitReports.js
docker cp d4apilot_d4a_app_1:/usr/src/app/reports/ .
rm reports.json