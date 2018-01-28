#!/bin/bash

sqlite3 kkoment.db ".schema comments" > schema
sqlite3 kkoment.db ".schema salts" >> schema
