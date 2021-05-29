const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');


// Load plugins
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const gulpsass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const browsersync = require('browser-sync').create();


// Clean assets
function clear() {
    return src('./assets/*', {
            read: false
        })
        .pipe(clean());
}


// JS function 
function js() {
    const source = './src/js/*.js';

    return src(source)
        .pipe(changed(source))
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(dest('./assets/js/'))
        .pipe(browsersync.stream());
}


// CSS function 
function css() {
    const source = './src/scss/*.scss';

    return src(source)
        .pipe(changed(source))
        .pipe(gulpsass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(cssnano())
        .pipe(dest('./assets/css/'))
        .pipe(browsersync.stream());
}


// HTML function 
function html() {
    const source = './*.html';

    return src(source)
        .pipe(changed(source))
        .pipe(browsersync.stream());
}


// PHP function 
function php() {
    const source = './*.php';    
    return src(source)
        .pipe(changed(source))
        .pipe(browsersync.stream());
}


// Optimize images
function img() {
    return src('./src/img/*')
        .pipe(imagemin())
        .pipe(dest('./assets/img/'));
}


// Watch files
function watchFiles() {
    watch('./src/scss/*', css);
    watch('./src/js/*', js);
    watch('./src/img/*', img);
    watch('./*', html);
    watch('./*', php);
}


// BrowserSync
function browserSync() {
    browsersync.init({
        proxy: "http://localhost:8888/project-touiteur/"
    });
}

// Tasks to define the execution of the functions simultaneously or in series

exports.watch = parallel(watchFiles, browserSync);
exports.default = series(clear, parallel(js, css, img));
exports.clean = clear;  