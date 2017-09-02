#!/bin/sh

CONTAINER=demo-loopback

docker cp server $CONTAINER:/home/api
docker cp common $CONTAINER:/home/api
docker exec --user api -it $CONTAINER pm2 restart api0
