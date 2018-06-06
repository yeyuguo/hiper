port='./node_modules/http-server/bin/http-server'
kill -9 $(ps aux | grep ${port} | awk '{print $2}')