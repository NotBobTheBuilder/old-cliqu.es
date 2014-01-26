#/bin/bash

domain=$1
remote=$2

cd /usr/share/nginx/www/public
if [ -d "${domain}" ]; then
  cd ${domain}
  git pull origin
else
  git clone ${remote} ${domain}
fi
