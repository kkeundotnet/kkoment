.PHONY: default
default: dist/kkoment.js

src/url.ts: ../kkoment.json
	python3 init_url_ts.py

src/url.js src/main.js: tsconfig.json src/url.ts src/main.tsx
	npx tsc

dist/kkoment.js: webpack.config.js src/url.js src/main.js
	npx webpack
# webpack does not touch the target file
	touch $@

.PHONY: clean
clean:
	$(RM) src/url.ts src/url.js src/main.js
