var gulp 		 = require('gulp'),
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat		 = require('gulp-concat'),
	uglify		 = require('gulp-uglifyjs'),
	cssnano		 = require('gulp-cssnano'),
	rename		 = require('gulp-rename'),
	del			 = require('del'),
	imagemin	 = require('gulp-imagemin'),
	pngquant 	 = require('imagemin-pngquant'),
	cache		 = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	notify       = require("gulp-notify"),
	sourcemaps   = require('gulp-sourcemaps');



gulp.task('default', function() {
    gulp.src('app/Resources/assets/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('web/css'));
});


gulp.task('sass', function(){
	return gulp.src('src/scss/**/*.scss')
	
	.pipe( sass().on( 'error', notify.onError(
      {
        message: "<%= error.message %>",
        title  : "Sass Error!"
      })))
	.pipe(sourcemaps.init())
	.pipe(autoprefixer(['last 15 versions', '> 1%'], { cascade: true}))
	.pipe(sourcemaps.write('.'))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
	return gulp.src([
		'src/libs/jquery/dist/jquery.min.js'
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('src/js'));
});

gulp.task('scc-libs', ['sass'], function(){
	return gulp.src('src/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('src/css'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server:{
			baseDir:'src'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('img', function(){
	return gulp.src('src/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'sass', 'scripts', 'scc-libs'], function(){
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', browserSync.reload);
});

gulp.task('build', ['clean', 'img' , 'sass', 'scripts'] , function(){
	var buildCss = gulp.src([
		'src/css/main.css',
		'src/css/libs.min.css'
		])
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJS = gulp.src('src/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHTML = gulp.src('src/*.html') 
		.pipe(gulp.dest('dist'));
});
