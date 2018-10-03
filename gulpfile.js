/**
 * Created by Blidkaga on 2016. 12. 28..
 */

var gulp = require('gulp');
var order = require('gulp-order');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify-es').default;;
var uglifycss = require('gulp-uglifycss');
var stripDebug = require('gulp-strip-debug');
var livereload = require('gulp-livereload');
var rename = require('gulp-rename');
var scss = require("gulp-scss");
var pump = require('pump');

var paths = {
    js: 'app/js/*.js',
    css: 'app/css/style.css',
    scss: 'app/scss/*.scss',
    html: '**/*.html'
};
// 자바스크립트 파일을 하나로 합치고 압축한다.
gulp.task('combine-js', function (cb) {
  pump([
      gulp.src(paths.js)
        .pipe(order([
        "app/js/front.js"
      ],{ base: './' }))
      ,
      uglify(),
      gulp.dest('app/bundle/')
    ],
    cb
  );
});

gulp.task('combine-css', function () {
    return gulp.src(paths.css)
        .pipe(uglifycss())
        .pipe(gulp.dest('app/bundle/'));
});

// 파일 변경 감지 및 브라우저 재시작
gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(paths.js, ['combine-js']);
    gulp.watch(paths.css, ['combine-css']);
    gulp.watch('app/bundle/*.*').on('change', livereload.changed);
});


gulp.task("scss", function () {
    gulp.src(
        paths.scss
    ).pipe(scss(

    )).pipe(gulp.dest("app/css/"));
});
gulp.task('default', ['combine-js','combine-css', 'watch']);