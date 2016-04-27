var gulp = require('gulp');
var less = require('gulp-less');
var jade = require('gulp-jade');
var watch = require('gulp-watch');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('./app/less/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(autoprefixer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/css/'));
});
gulp.task('watch', function() {
    gulp.watch('./app/**/*.less', ['less']);
    gulp.watch('./app/templates/*.jade' ['jade']);
});
gulp.task('js',function(){
  gulp.src('./app/js/*.js')
  .pipe(uglify())
  .pipe(gulp.dest('./dist/js/'));
});
gulp.task('copyjs', function() {
   gulp.src(['./bower_components/angular/angular.min.js','./bower_components/angular-route/angular-route.min.js','./bower_components/angular-toArrayFilter/toArrayFilter.js'])
   .pipe(gulp.dest('./dist/js/'));
});