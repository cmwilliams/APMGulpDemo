var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var inject = require('gulp-inject');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('sass', function () {
    return gulp.src('Content/scss/**/*.scss')
        .pipe(sass()) // Converts Sass to CSS with gulp-sass
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', ['browserSync', 'sass'], function () {
    gulp.watch('Content/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', browserSync.reload);
    gulp.watch('app/**/*.js', browserSync.reload);
});

gulp.task('browserSync', function () {
    browserSync({
        server: {
            baseDir: 'dist/'
        }
    });
});

gulp.task('useref', ['cachetemplates'], function () {
    var assets = useref.assets();
    var templateCache = 'app/templates.js';

    return gulp.src('index.html')
        .pipe(inject(gulp.src(templateCache, { read: false }), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe(assets)
        //.pipe(gulpIf('*.js', ngAnnotate()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', minifyCSS()))
        // Uglifies only if it's a Javascript file
        .pipe(gulpIf('*.js', uglify()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task('cachetemplates', function () {
    return gulp.src('app/**/*.html')
        .pipe(templateCache('templates.js', {
            root: 'app/'
        }))
        .pipe(gulp.dest('app'));
});