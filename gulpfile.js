'use strict';

var del = require('del'),
	gulp = require('gulp'),
	ts = require('gulp-typescript'),
	tsconfig = require('./tsconfig'),
	plumber = require('gulp-plumber'),
	spawn = require('child_process').spawn,
	node;

gulp.task('app', function() {
	if (node) node.kill()
	node = spawn('node', ['./src/app.js'], {
		stdio: 'inherit'
	})
	node.on('close', function(code) {
		process.stdout.write('=== App terminated, waiting for changes...\n');
	});
});

gulp.task('dev', function() {
	gulp.run('app');

	gulp.watch(['./src/**/*.js'], function() {
		gulp.run('app')
	});
});

// clean up if an error goes unhandled.
process.on('exit', function() {
	if (node) node.kill()
});


var tsProject = ts.createProject('tsconfig.json', {
	typescript: require('typescript')
});

gulp.task('compile-ts', function() {
	var tsResult = tsProject.src()
		.pipe(ts(tsProject));

	return tsResult.js.pipe(gulp.dest(tsconfig.compilerOptions.outDir || '.'));
});

gulp.task('clean', function(cb) {
	del(['src/**/*.js'], cb);
});

gulp.task('watch', ['build'], function() {
	gulp.watch(tsconfig.files, ['compile-ts']);
});

gulp.task('build', ['compile-ts'])

gulp.task('default', ['build']);
