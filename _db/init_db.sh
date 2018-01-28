#!/bin/bash

set -e -u

if [ -f kkoment.db ]; then
    backup=kkoment-`date +%F-%T`.db
    mv kkoment.db $backup
    echo "DB back up: $backup"
fi

echo "Generate: kkoment.db"
sqlite3 kkoment.db < schema

echo "Need sudo to change the ownerships of _db and _db/kkoment.db"
sudo chown `whoami`:www-data .
sudo chown `whoami`:www-data kkoment.db
