#!/bin/bash

set -e

SERVER=" < root@127.0.0.1 > "
APP_DIR=/home/maxifjaved/backend-api

set -x

yarn build
rsync -avzP build/ $SERVER:$APP_DIR
rsync -avzP package.json $SERVER:$APP_DIR
rsync -avzP yarn.lock $SERVER:$APP_DIR
ssh $SERVER "cd $APP_DIR && yarn"
ssh $SERVER "pm2 restart index"
# rm -rf build