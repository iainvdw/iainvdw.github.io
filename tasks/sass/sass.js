/**
 * Compiles the main styles.scss file and creates a source-map
 *
 * @author   Iain van der Wiel <iain@e-sites.nl>
 * @version  1.0
 */

const path = require('path');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const del = require('del');
const tasker = require('gulp-tasker');
const conf = require('../base/conf');
const { handleError, handleSuccess } = require('../base/handlers');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const rev = require('gulp-rev');
const sourcemaps = require('gulp-sourcemaps');

const cssPath = `${conf.path.public + conf.path.assets + conf.path.css}`;
const debug = process.env.NODE_ENV !== 'production';

const cleansass = (done) => {
  del([`${cssPath}/*`]);

  done();
};

const compilesass = () => (
    gulp
      .src([
        `${conf.path.source + conf.path.assets + conf.path.css}/styles.scss`,
        `${conf.path.source + conf.path.assets + conf.path.css}/cv.scss`
      ])
      .pipe(handleError('sass', 'SASS compiling failed'))
      .pipe(gulpif(debug, sourcemaps.init()))
      .pipe(
        sass().on('error', (err) => {
          console.log(err.messageFormatted);
        })
      )
      .pipe(
        cleanCSS({
          level: debug ? 0 : 2
        })
      )
      .pipe(
        autoprefixer({
          browsers: ['last 3 versions', 'ios_saf 7']
        })
      )
      // Normal output
      .pipe(gulpif(debug, sourcemaps.write('./')))
      .pipe(gulp.dest(cssPath))

      // Revisioned output
      // .pipe(rev())
      // .pipe(gulp.dest(cssPath))
      // .pipe(rev.manifest())
      // .pipe(gulp.dest(cssPath))

      .pipe(handleSuccess('sass', 'SASS compiling succeeded'))
  );

const sassTask = gulp.series(compilesass);

gulp.task('sass', sassTask);

tasker.addTask('default', sassTask);
tasker.addTask('deploy', sassTask);
tasker.addTask(
  'watch',
  sassTask,
  `${conf.path.source + conf.path.assets + conf.path.css}/**/*.scss`
);
