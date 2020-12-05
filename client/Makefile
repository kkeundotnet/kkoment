.PHONY: default
default: kkoment.js

kkoment.js: kkoment.ts url.ts
	tsc

url.ts: ../kkoment.json
	./init_url_ts.py

.PHONY: clean
clean:
	$(RM) url.ts kkoment.js
