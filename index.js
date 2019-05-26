'use strict';

var through = require('through2');
var sourceMap = require('source-map');
var applySourceMap = require('vinyl-sourcemaps-apply');

module.exports = function(options) {
  function process(file, enc, cb) {
    if (file.isStream()) {
      throw new Error('Streaming not supported');
    }

    let result = parse(file.contents.toString());
    file.contents = Buffer.from(result.source, 'utf8');

    if (file.sourceMap) {
      const generator = new sourceMap.SourceMapGenerator({ file: file.sourceMap.file });
      for (let i = 0; i < result.mappings.length; i++) {
        generator.addMapping({
          source: file.sourceMap.file,
          original: { line: result.mappings[i] + 1, column: 0 },
          generated: { line: i + 1, column: 0 }
        });
      }
      applySourceMap(file, generator.toString());
    }

    this.push(file);
    return cb();
  }

  function finished(cb) {
    cb();
  }

  return through.obj(process, finished);
};

function parse(source) {
  const lines = source.split(/\n/);
  let match;

  const lineMappings = [];
  for (let i = 0; i < lines.length; i++) {
    lineMappings.push(i);
  }

  for (let i = 0; i < lines.length; i++) {
    if (match = lines[i].match(/^import .+ from .+/)) {
      lines.splice(i, 1);
      lineMappings.splice(i, 1);

      // If it exists, chew a single blank line after an import statement.
      if (lines[i] === '' || lines[i] === '\r') {
        lines.splice(i, 1);
        lineMappings.splice(i, 1);
      }

      i--;
    } else if (match = lines[i].match(/^export ((?:.|\r)+)/)) {
      lines[i] = match[1];
    }
  }

  return {
    source: lines.join('\n'),
    mappings: lineMappings
  };
}
