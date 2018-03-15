var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var deploy      = require('gulp-gh-pages');
var concat      = require('gulp-concat');
var plumber     = require('gulp-plumber');
var sourcemaps  = require('gulp-sourcemaps');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");

var jekyll   = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
// const reload = browserSync.reload;
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Push build to gh-pages, using _config-deploy
 */
// gulp.task('deploy',['jekyll-build-deploy'], function () {
//   return gulp.src("./_site/**/*")
//     .pipe(deploy({remoteUrl: 'git@github.com:rendrap/gh-r24.git'}));
// });

// Move the javascript files into our /src/js folder
gulp.task('js', function() {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(plumber())
        .on('error', function (err) {
        console.error('Error!', err.message);})
        .pipe(gulp.dest("assets/js"))
        .pipe(browserSync.reload({stream:true}));
});

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    // return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
    return cp.spawn( jekyll , ['build','--incremental'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-build-deploy', function (done) {
    browserSync.notify(messages.jekyllBuild);
    // return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
    return cp.spawn( jekyll , ['build','--config', '_config-deploy.yml'], {stdio: 'inherit'})
        .on('close', done);
});


/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass','js','jekyll-build'], function() {
    browserSync({
        open: false,
        logPrefix: 'BS4',
        server: {
            baseDir: '_site'
        }
    });
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src('assets/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(sass({
            includePaths: ['scss'],
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('assets/css'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('assets/css'));
});

// Minify CSS
gulp.task('css-clean', function() {
  return gulp.src([
      './assets/css/*.css',
      '!./assets/css/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('assets/scss/*.scss', ['sass','jekyll-rebuild']);
    // gulp.watch('assets/js/*.js', ['jekyll-rebuild']);
    gulp.watch('*.md', ['jekyll-rebuild']);
    gulp.watch('_data/*.yml', ['jekyll-rebuild']);
    // gulp.watch('_content/*.md', ['jekyll-rebuild']);
    gulp.watch(['*.index.html', '_layouts/*.html', '_includes/*.html',
    '_posts/*'], ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);
