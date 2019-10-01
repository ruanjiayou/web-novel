#!/bin/bash
npm run build
rsync -vzrtopg --progress ./build/ root@baidu:/home/novel/build/
ssh root@baidu "cd /home/novel/ && sh cmd.sh"

