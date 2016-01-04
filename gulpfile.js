'use strict';

var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	tsconfig = require('./tsconfig');

gulp.task('compile-ts', function() {
	var tsProject = ts.createProject('tsconfig.json', {
		typescript: require('typescript')
	});

	var tsResult = tsProject.src()
		.pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir || '.'));
});

gulp.task('build', ['compile-ts'])

gulp.task('default', ['build']);
