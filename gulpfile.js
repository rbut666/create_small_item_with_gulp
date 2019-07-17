var gulp = require('gulp')
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
const path = require('path')

var babel = require('gulp-babel')
var uglify = require('gulp-uglify')
var less = require('gulp-less')
var minimg = require('gulp-imagemin')
var cache = require('gulp-cache')
var pngquant = require('imagemin-pngquant')

gulp.task('less', function(){
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(gulp.dest(path.resolve(__dirname, 'dist/css')))
})

gulp.task('js', function() {
    return gulp.src('./js/*.js')
            .pipe(babel({
                presets: ["@babel/preset-env"]
            }))
            .pipe(uglify())
            .pipe(gulp.dest(path.resolve(__dirname, 'dist/js')))
})

gulp.task('image', function() {
    return gulp.src('./images/*')
        .pipe(cache(minimg({
            use: [pngquant()]
        })))
        .pipe(gulp.dest(path.resolve(__dirname, 'dist/img')))
})

// use gulp create folder
gulp.task('direct', function() {
    return gulp.src('*.*', {read: false})
            .pipe(gulp.dest('./js'))
            .pipe(gulp.dest('./less'))
            .pipe(gulp.dest('./images'))
})

// use gulp run the shell command
const shell = require('gulp-shell')
// watch file
gulp.task('run_shell', function() {
    return gulp.src('*.html', {read: false})
            .pipe(shell([
                'echo this msg is write by gulp run_shell'
            ]))
})
// not watch file   just use the shell command
gulp.task('run_shell_signal', shell.task('echo this msg is from run_shell_signal'))

gulp.task('serve', function() {
    browserSync.init({
        server: "./"
    })
    gulp.watch("./less/*.less", gulp.series('less')).on('change', reload)
    gulp.watch('./*.html').on("change", reload)
    gulp.watch('./js/*.js', gulp.series('js')).on('change', reload)
    gulp.watch('./images/*', gulp.series('image')).on('change', reload)
})


gulp.task('default', gulp.series('serve', 'js', 'less', 'image'));