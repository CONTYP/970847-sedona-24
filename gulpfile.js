import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del'

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber()) //Обработка ошибок;
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// hyml

const html = () => {
  return gulp.src('source/*.html')
   .pipe(htmlmin({ collapseWhitespace: true }))
   .pipe(gulp.dest('build'));
  }

// images

const optymazimages = () => {
  return gulp.src('source/img/photo/*.jpg')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img/photo'));
}

const copyImages = () => {
 return gulp.src('source/img/**/*.jpg')
  .pipe(gulp.dest('build/img'));
}

// svg

const svg = () =>{
 return gulp.src('source/img/icons/*.svg')
 .pipe(svgo())
 .pipe(gulp.dest('build/img/icons'));
}

const sprite = () =>{
  return gulp.src('source/img/i_svg/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img'));
 }

 // Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}


// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optymazimages,
  gulp.parallel(
    styles,
    html,
    svg,
    sprite
  ),
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    svg,
    sprite
  ),
  gulp.series(
    server,
    watcher
  ));
  /*
export default gulp.series(
 html, styles, copy, copyImages, svg, sprite, server, watcher
);*/
