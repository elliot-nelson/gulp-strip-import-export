'use strict';

const stripImportExport = require('../index');

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const fs = require('fs');

describe('gulp-ifdef', function () {
    it('removes all import lines and export keywords', function (done) {
        gulp.src(['spec/fixtures/example1.in.js'])
            .pipe(stripImportExport())
            .on('data', file => {
              const expected = fs.readFileSync('spec/fixtures/example1.out.js', 'utf8');
              expect(file.contents.toString()).toEqual(expected);
              done();
            })
            .on('error', error => done.fail(error));
    });

    it('removes all import lines and export keywords, retaining CRLF endings', function (done) {
        gulp.src(['spec/fixtures/example2.in.js'])
            .pipe(stripImportExport())
            .on('data', file => {
              const expected = fs.readFileSync('spec/fixtures/example2.out.js', 'utf8');
              // Confirm we're actually testing CRLF
              expect(expected.split(/\n/).length).withContext('CRLF check').toEqual(expected.split(/\r\n/).length);

              expect(file.contents.toString()).toEqual(expected);
              done();
            })
            .on('error', error => done.fail(error));
    });

    it('updates source map if source maps are enabled', function (done) {
        gulp.src(['spec/fixtures/example1.in.js'])
            .pipe(sourcemaps.init())
            .pipe(stripImportExport())
            .pipe(sourcemaps.write())
            .on('data', file => {
                const expected = fs.readFileSync('spec/fixtures/example1.sourcemaps.js', 'utf8');
                expect(file.contents.toString()).toEqual(expected);
                done();
            })
            .on('error', error => done(error));
    });
/*
    it('throws an error if an #if block is missing an #endif', function (done) {
        gulp.src(['spec/fixtures/missingEndif.js'])
            .pipe(ifdef({ DEBUG: false, A: false }, { extname: ['js'] }))
            .on('data', file => {
                const expected = fs.readFileSync('spec/fixtures/simple.insertBlanks.false.js', 'utf8');
                expect(file.contents.toString()).toEqual(expected);
                done();
            })
            .on('error', error => {
                expect(String(error)).toEqual('Error: gulp-ifdef: #if without #endif in line 3');
                done();
            });
    });
    */
});
