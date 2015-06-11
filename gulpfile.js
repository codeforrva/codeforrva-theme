var gulp         = require('gulp'),
    browserSync  = browserSync || require('browser-sync').create(),
    plumber			 = require('gulp-plumber'),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCss    = require('gulp-minify-css'),
    rename       = require('gulp-rename'),
    chmod        = require('gulp-chmod'),
    replace      = require('gulp-replace'),
    processhtml  = require('gulp-processhtml');

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

// deploy files to a WordPress theme directory on the server
gulp.task('deploy', ['sass'], function() {
    var wpThemeDir = process.env.WP_THEME_DIR;
    if (!wpThemeDir) throw "Please set the WP_THEME_DIR environment variable.";
    gulp.src('build/css/styles.css')
        .pipe(rename('style.css'))
        .pipe(replace(/\.\.\/\.\.\/img\//, '/wp-content/themes/codeforrva/img/'))
        .pipe(chmod(664))
        .pipe(gulp.dest(wpThemeDir));
    gulp.src('index.html')
        .pipe(rename('index.php'))
        .pipe(processhtml())
        .pipe(chmod(664))
        .pipe(gulp.dest(wpThemeDir));
    gulp.src(['img/**', '*.php'], { base:'.' })
        .pipe(chmod(664))
        .pipe(gulp.dest(wpThemeDir));
});

gulp.task('default', ['serve']);
