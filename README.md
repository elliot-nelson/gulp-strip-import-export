# gulp-strip-import-export

> A gulp plugin that removes ES6-style import and export statements

## Install

```sh
$ npm install --save-dev gulp-strip-import-export
```

## Usage

In your `gulpfile.js`:

```js
const typescript = require('gulp-typescript');
const stripImportExport = require('gulp-strip-import-export');

const tsproject = typescript.createProject({
    module: 'es6',
    noImplicitAny: true,
    target: 'es2018'
});

gulp.task('build', function () {
  return gulp.src(['src/*.ts'])
    .pipe(tsproject()).js
    .pipe(stripImportExport())
    .pipe(gulp.dest('dist/js'));
});
```

Sourcemaps are supported if you've initialized the sourcemaps module.

```js
const sourcemaps = require('gulp-sourcemaps');

gulp.task('build', function () {
  return gulp.src(['src/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(tsproject()).js
    .pipe(stripImportExport())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});
```

## What does it do?

Given an example source:

```js
import { Foo } from './foo';
import { Bar } from './bar';

export class Baz {
  constructor() { this.foo = new Foo(); }
}
```

This plugin produces a file stripped of import and export statements:

```js
class Baz {
  constructor() { this.foo = new Foo(); }
}
```

## Why?

This plugin is a corner-case plugin designed for one specific use case: you're using Typescript
or Babel to process incoming javascript modules written using ES6-style `import` and `export`
statements, and you _aren't_ going to wrap your code with a module system (be it webpack,
requirejs, rollup, etc.). This allows you to produce your final, browser-ready javascript file
by simply concatenating all of the output files in the appropriate order.

This is not a generally useful plugin, but may be useful specifically for projects where you
want to minimize the total bytes in the source file -- like [js13kgames](https://js13kgames.com/).

