'use strict';

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const debug = require('gulp-debug');
const clean = require('del');
const flatten = require('gulp-flatten');
const rename = require('gulp-rename');
const fs = require('fs');
const browserSync = require('browser-sync').create();

const pug = require('gulp-pug');

const stylus = require('gulp-stylus');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sorting = require('postcss-sorting');
const csso = require('gulp-csso');

const rigger = require('gulp-rigger');
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');
const webpack = require('webpack-stream');

const imagemin = require('gulp-imagemin');
// const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');

const favicon = require('gulp-real-favicon');

const FAVICON_DATA_FILE = 'faviconData.json';
const webpackConfig = require('./webpack.config');

gulp.task('clean', () => {
	return clean('public');
});

gulp.task('copy', () => {
	return gulp.src([
		'src/static/fonts/*.{woff,woff2}',
		'src/static/misc/*.*'
	], { base: 'src/static/' })
		.pipe(gulp.dest('public'));
});

gulp.task('pages', () => {
	return gulp.src('src/pages/*.pug')
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'pages',
					message: err.message
				};
			})
		}))
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest('public'));
});

gulp.task('styles', () => {
	const processors = [
		autoprefixer(),
		sorting({
			'order': [
				'custom-properties',
				'declarations',
				'at-rules',
				'rules'
			],

			'properties-order': 'alphabetical',

			'unspecified-properties-position': 'bottom'
		})
	];

	return gulp.src('src/static/stylus/styles.styl')
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'styles',
					message: err.message
				};
			})
		}))
		.pipe(stylus())
		.pipe(postcss(processors))
		.pipe(sourcemaps.init())
		.pipe(csso({
			restructure: true,
			sourceMap: true,
			comments: false
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/css'));
});

gulp.task('scripts:main', () => {
	return gulp.src('src/static/js/main/index.js')
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'scripts:main',
					message: err.message
				};
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(rigger())
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(uglify({
			output: {
				comments: false
			}
		}))
		.pipe(rename('main.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('public/js'));
});

gulp.task('scripts:app', () => {
	return gulp.src('src/static/js/app/index.js')
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'scripts:app',
					message: err.message
				};
			})
		}))
		.pipe(webpack(webpackConfig))
		.pipe(rename('app.min.js'))
		.pipe(gulp.dest('public/js'));
});

gulp.task('scripts:separate', () => {
	return gulp.src('src/static/js/separate/*.js')
		.pipe(plumber({
			errorHandler: notify.onError((err) => {
				return {
					title: 'scripts:separate',
					message: err.message
				};
			})
		}))
		.pipe(uglify({
			output: {
				comments: false
			}
		}))
		.pipe(gulp.dest('public/js'));
});

gulp.task('scripts', gulp.parallel('scripts:main', 'scripts:app', 'scripts:separate'));

gulp.task('images', () => {
	return gulp.src([
			'src/components/**/images/*.{jpg,jpeg,png,svg,gif}',
			'src/static/images/**/*.{jpg,jpeg,png,svg,gif}',
			'!src/static/images/favicon.{jpg,jpeg,png,svg,gif}'
		])
		.pipe(flatten({ includeParents: 1 }))
		.pipe(newer('public/images'))
		.pipe(imagemin([
			imagemin.optipng({ optimizationLevel: 3 }),
			imagemin.jpegtran({ progressive: true }),
			imagemin.svgo({
				plugins: [
					{ removeViewBox: false },
					{ removeRasterImages: true }
				]
			}),
			imagemin.gifsicle()
		]))
		.pipe(debug({'title': 'image'}))
		.pipe(gulp.dest('public/images/'));
});

gulp.task('sprite', () => {
	return gulp.src('src/static/images/icons/*.svg')
		.pipe(svgstore({ inlineSvg: true }))
		.pipe(rename('sprite.svg'))
		.pipe(gulp.dest('public/images'));
});

gulp.task('favicon', (done) => {
	favicon.generateFavicon({
		masterPicture: 'src/static/images/favicon.png',
		dest: 'public/images/favicon',
		iconsPath: '/',
		design: {
			ios: {
				pictureAspect: 'noChange',
				assets: {
					ios6AndPriorIcons: false,
					ios7AndLaterIcons: false,
					precomposedIcons: false,
					declareOnlyDefaultIcon: true
				}
			},
			desktopBrowser: {},
			windows: {
				pictureAspect: 'noChange',
				backgroundColor: '#da532c',
				onConflict: 'override',
				assets: {
					windows80Ie10Tile: false,
					windows10Ie11EdgeTiles: {
						small: false,
						medium: true,
						big: false,
						rectangle: false
					}
				}
			},
			androidChrome: {
				pictureAspect: 'noChange',
				themeColor: '#ffffff',
				manifest: {
					display: 'standalone',
					orientation: 'notSet',
					onConflict: 'override',
					declared: true
				},
				assets: {
					legacyIcon: false,
					lowResolutionIcons: false
				}
			}
		},
		settings: {
			scalingAlgorithm: 'Mitchell',
			errorOnImageTooSmall: false
		},
		markupFile: FAVICON_DATA_FILE
	}, () => {
		done();
	});
});

gulp.task('browser-sync', () => {
	browserSync.init({
		server: {
			baseDir: 'public'
		}
	});

	browserSync.watch('public/**/*', browserSync.reload);
});

gulp.task('build', gulp.series('clean', 'copy', 'pages', 'styles', 'scripts', 'images', 'sprite', 'favicon'));

gulp.task('watcher', () => {
	gulp.watch(['src/static/fonts', 'src/static/misc'], gulp.parallel('copy'));
	gulp.watch('src/**/*.pug', gulp.series('pages'));
	gulp.watch('src/**/*.{styl,css}', gulp.parallel('styles'));
	gulp.watch(['src/**/*.js', '!src/static/js/app/**/*.js', '!src/static/js/separate/*.js'], gulp.parallel('scripts:main'));
	gulp.watch('src/static/js/app/**/*.js', gulp.parallel('scripts:app'));
	gulp.watch('src/static/js/separate/*.js', gulp.parallel('scripts:separate'));
	gulp.watch('src/**/*.{jpg,jpeg,png,svg,gif}', gulp.parallel('images'));
	gulp.watch('src/static/images/icons/*.svg', gulp.parallel('sprite'));
	gulp.watch('src/static/images/favicon.{jpg,jpeg,png,svg,gif}', gulp.parallel('favicon'));
});

gulp.task('server', gulp.parallel('watcher', 'browser-sync'));

gulp.task('default', gulp.series('build', 'server'));
