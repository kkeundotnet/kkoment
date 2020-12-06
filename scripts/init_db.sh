#!/bin/bash
#
# This updates the schema using the DB file.

set -e -u

# https://stackoverflow.com/questions/59895/how-to-get-the-source-directory-of-a-bash-script-from-within-the-script-itself
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DB_DIR="${SCRIPTS_DIR}/../_db"
DB_FILE="${DB_DIR}/kkoment.sqlite3"
SCHEMA_FILE="${DB_DIR}/kkoment.schema"
WHOAMI=`whoami`

if [ -f "${DB_FILE}" ]; then
    BACKUP_FILE="${DB_DIR}/kkoment-`date +%F-%T`.sqlite3"
    (set -x; mv "${DB_FILE}" "${BACKUP_FILE}")
fi

if [ ! -f "${SCHEMA_FILE}" ]; then
    echo "Schema file not found: ${SCHEMA_FILE}" 1>&2
    exit 1
fi

(set -x; sqlite3 "${DB_FILE}" < "${SCHEMA_FILE}")

echo "Need sudo to change the ownerships of _db and _db/kkoment.sqlite3"

if [ `stat -c %G "${DB_DIR}"` != "www-data" ]; then
    (set -x; sudo chown "${WHOAMI}":www-data "${DB_DIR}")
fi
(set -x; chmod g+w "${DB_DIR}")

(set -x; sudo chown "${WHOAMI}":www-data "${DB_FILE}")
(set -x; chmod g+w "${DB_FILE}")
