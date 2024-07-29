import gulp from 'gulp';
import browserSync from 'browser-sync';
import sass from 'gulp-sass';
import * as dartSass from 'sass';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import htmlmin from 'gulp-htmlmin';
import autoprefixer from 'gulp-autoprefixer';

const bs = browserSync.create();
const sassCompiler = sass(dartSass);

async function styles() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sassCompiler({ outputStyle: 'compressed' }).on('error', sassCompiler.logError))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(gulp.dest("dist/css"))
        .pipe(bs.stream());
}

function server() {
    bs.init({
        server: {
            baseDir: "dist"
        }
    });

    gulp.watch("src/*.html").on('change', bs.reload);
}

function watch() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", styles);
    gulp.watch("src/*.html").on('change', gulp.series(html));
}

function html() {
    return gulp.src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest("dist/"));
}

function scripts() {
    return gulp.src("src/js/**/*.js")
        .pipe(gulp.dest("dist/js"));
}

function fonts() {
    return gulp.src("src/fonts/**/*")
        .pipe(gulp.dest("dist/fonts"));
}

function icons() {
    return gulp.src("src/icons/**/*")
        .pipe(gulp.dest("dist/icons"));
}

function mailer() {
    return gulp.src("src/mailer/**/*")
        .pipe(gulp.dest("dist/mailer"));
}

function images() {
    return gulp.src("src/img/**/*")
        .pipe(imagemin())
        .pipe(gulp.dest("dist/img"));
}

const build = gulp.parallel(watch, server, styles, html, scripts, fonts, icons, mailer, images);

export default build;
