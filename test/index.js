'use strict';

var path = require('path');
var generate = require('markdown-it-testgen');
var md = require('markdown-it');
var plantuml = require('../');

/*eslint-env mocha*/

describe('markdown-it-plantuml', function () {
  var defaultParser = md().use(plantuml);

  generate(
    path.join(__dirname, 'fixtures/default.txt'),
    { header: true },
    defaultParser
  );

  var ditaaParser = md().use(
    plantuml,
    {
      openMarker: '@startditaa',
      closeMarker: '@endditaa',
      diagramName: 'ditaa'
    }
  );

  generate(
    path.join(__dirname, 'fixtures/ditaa.txt'),
    { header: true },
    ditaaParser
  );

  var pngParser = md().use(plantuml, { imageFormat: 'png' });

  generate(
    path.join(__dirname, 'fixtures/png.txt'),
    { header: true },
    pngParser
  );

  var parserWithCustomServer = md().use(plantuml, { server: 'http://example.com/plantuml' });

  generate(
    path.join(__dirname, 'fixtures/server.txt'),
    { header: true },
    parserWithCustomServer
  );

  var parserWithCustomRender = md().use(plantuml, {
    render: function (tokens, idx, options, env, slf) {
              var fetch = require('sync-fetch');
              var token = tokens[idx];
              console.log(token.attrs[token.attrIndex('src')][1]);
              var raw = fetch(token.attrs[token.attrIndex('src')][1]);
              return raw.text().replace(/\r\n/g, "\n") + '\n';
            }
  });

  generate(
    path.join(__dirname, 'fixtures/render.txt'),
    { header: true },
    parserWithCustomRender
  );
});
