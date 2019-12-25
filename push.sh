#!/bin/bash
npm run build
rsync -vzrtopg --progress --exclude='build/workbox-v4.3.1' ./build/ root@baidu:/home/node-mongo-novel/static/ 
ssh root@baidu "cd /home/novel/ && sh cmd.sh"

