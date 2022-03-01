#!/usr/bin/env python3

import json

with open('../kkoment.json') as json_file:
    data = json.load(json_file)
    url = data['url']

with open('src/url.ts', 'w') as ts_file:
    ts_file.write("export const kkoment_url = '{}';".format(url))
