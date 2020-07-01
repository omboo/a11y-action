FROM frvge/pa11y
COPY dist/index.js /dist/index.js
COPY dist/runner.js /dist/runner.js
ENTRYPOINT ["node", "/dist/index.js"]