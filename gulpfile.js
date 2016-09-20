var gulp = require('gulp');
    gp_concat = require('gulp-concat'),
    gp_rename = require('gulp-rename'),
    gp_uglify = require('gulp-uglify');

gulp.task('concat-minify', function() {
  return gulp.src(['ext_libs/*.js, ./lib/fulfil.js', './lib/model.js', './lib/client.js'])
    .pipe(gp_concat('fulfil_client.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(gp_rename('fulfil_client.min.js'))
    .pipe(gp_uglify())
    .pipe(gulp.dest('dist'));
});
