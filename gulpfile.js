var gulp         = require('gulp'),
    browserSync  = browserSync || require('browser-sync').create(),
    plumber			 = require('gulp-plumber'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss    = require('gulp-minify-css');

gulp.task('sass', function () {
    gulp.src('src/scss/styles.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minifyCss({ keepSpecialComments: '*' })) // wordpress needs a header comment
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
