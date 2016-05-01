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
    // .pipe(uglify())
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
   gulp.src([
    './bower_components/angular/angular.min.js',
    './bower_components/angular-route/angular-route.min.js',
    './bower_components/angular-toArrayFilter/toArrayFilter.js',
    './bower_components/video.js/dist/video.js',
    './bower_components/leaflet/dist/leaflet.js',
    './bower_components/angular-animate/angular-animate.min.js'])
   .pipe(gulp.dest('./dist/js/'));
});
gulp.task('copycss', function() {
   gulp.src(
    ['./bower_components/video.js/dist/video-js.min.css',
    './bower_components/leaflet/dist/leaflet.css'])
   .pipe(gulp.dest('./dist/css/'));
});
gulp.task('copyvector',function(){
  gulp.src(
    './bower_components/video.js/dist/video-js.swf')
  .pipe(gulp.dest('./dist/fonts/'));
})