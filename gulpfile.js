const gulp = require('gulp');
const browserSync = require('browser-sync');

const reload = browserSync.reload;

const src = {
  html: 'html/*.html',
  css: 'assets/css/*.css',
  js: 'assets/js/*.js'
};


// process JS files and return the stream.
// gulp.task('js', () => gulp.src('js/*js')
//   .pipe(browserify())
//   .pipe(uglify())
//   .pipe(gulp.dest('dist/js')));


// watch files for changes and reload
gulp.task('serve', () => {
  console.log(src.html);
  browserSync({
    port: 8000,
    injectChanges: true,
    server: {
      baseDir: './'
    }
  });

  gulp.watch([src.html, src.css, src.js]).on('change', reload);
});
