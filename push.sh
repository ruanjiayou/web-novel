#!/bin/bash
# npm run build
rsync -vzrtopg --progress --exclude='build/workbox-v4.3.1' ./build/ root@baidu:/home/web-novel/build/ 

