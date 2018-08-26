var gulp = require('gulp'),
	gutil = require('gulp-util'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	svgSprite = require('gulp-svg-sprite'),
	svgmin = require('gulp-svgmin'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace'),
	autoprefixer = require('gulp-autoprefixer'),
	notify = require("gulp-notify");


gulp.task('js', function () {
	return gulp.src([
		'app/js/jquery.min.js',
		'app/js/mobileMenu.js',
		'app/js/common.js'
		])
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
	});
});

gulp.task('sass', function () {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'expand'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 5 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function () {
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch(['app/js/common.js', 'app/js/mobileMenu.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('svg', function () {
	return gulp.src('app/img/*.svg')
		.pipe(svgmin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(cheerio({
			run: function ($) {
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parserOptions: {
				xmlMode: true
			}
		}))
		.pipe(replace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				symbol: {
					sprite: "sprite.svg"
				}
			}
		}))
		.pipe(gulp.dest('app/img'));
});

gulp.task('imagemin', function () {
	return gulp.src('app/img/**/*')
		// .pipe(cache(imagemin())) // Cache Images
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['removedist', 'svg', 'imagemin', 'sass', 'js'], function () {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});


gulp.task('removedist', function () {
	return del.sync('dist');
});

gulp.task('default', ['watch']);
