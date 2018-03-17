const gulp = require('gulp');
const browserSync = require('browser-sync');
const responsive = require('gulp-responsive');
const webp = require('gulp-webp');

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

// generate responsive jpg files
gulp.task('images', () => {
  gulp.src('assets/img/*.jpg')
    .pipe(responsive({
      // Resize all JPG images to three different sizes: 300, 400, and 600 pixels
      '*.jpg': [{
        width: 300,
        rename: { suffix: '-s' }
      }, {
        width: 300 * 2,
        rename: { suffix: '-s@2x' }
      }, {
        width: 400,
        rename: { suffix: '-m' }
      }, {
        width: 400 * 2,
        rename: { suffix: '-m@2x' }
      }, {
        width: 600,
        rename: { suffix: '-l' }
      }, {
        // Compress, strip metadata, and rename original image
        rename: { suffix: '-xl' }
      }]
    }, {
      // Global configuration for all images
      errorOnEnlargement: false,
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 80,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
      max: true
    }))
    .pipe(gulp.dest('public/img'));
});

// generate webp from responsive jpg files
gulp.task('webp', () => {
  gulp.src('public/img/*.jpg')
    .pipe(webp())
    .pipe(gulp.dest('public/img'));
});
