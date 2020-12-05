#!/bin/bash
#
# This updates the schema using the DB file.

set -e -u

# https://stackoverflow.com/questions/59895/how-to-get-the-source-directory-of-a-bash-script-from-within-the-script-itself
SCRIPTS_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
DB_DIR="${SCRIPTS_DIR}/../_db"
DB_FILE="${DB_DIR}/kkoment.sqlite3"
SCHEMA_FILE="${DB_DIR}/kkoment.schema"

if [ ! -f "${DB_FILE}" ]; then
    echo "DB file not found: ${DB_FILE}" 1>&2
    exit 1
fi

(set -x;
 sqlite3 "${DB_FILE}" ".schema comments" > "${SCHEMA_FILE}";
 sqlite3 "${DB_FILE}" ".schema salts" >> "${SCHEMA_FILE}")
