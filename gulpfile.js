var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	jade = require('gulp-jade'),
	gutil = require('gulp-util'),
	del = require('del');

gulp.task('styles', function () {
	gulp.src('assets/scss/styles.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('public/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('public/css'));
});

gulp.task('jade', function () {
	gulp.src('assets/index.jade')
		.pipe(jade({ pretty: true }).on('error', gutil.log))
		.pipe(gulp.dest('public'));
});

gulp.task('scripts', function () {
	gulp.src(['assets/js/*.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest('public/js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify().on('error', gutil.log))
		.pipe(gulp.dest('public/js'));
});

gulp.task('watch', function () {
	gulp.watch('assets/scss/*.scss', ['styles']);
	gulp.watch('assets/*.jade', ['jade']);
	gulp.watch('assets/js/*.js', ['scripts']);
});

gulp.task('clean', function (cb) {
	del([
			'public/js/*', 
			'public/css/*', 
			'public/*'
		], cb);
});

gulp.task('default', ['styles', 'jade', 'scripts']);