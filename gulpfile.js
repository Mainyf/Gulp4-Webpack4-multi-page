const
    fs = require('fs'),
    path = require('path'),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config'),
    named = require('vinyl-named'),
    gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    ts = require('gulp-typescript'),
    del = require('del'),
    tsProject = ts.createProject('tsconfig.json'),
    srcFolder = './src';

function getOutputFolderName() {
    const outDir = tsProject.options.outDir.split('/');
    return outDir[outDir.length - 1];
}

function getFileOriginalName(filename) {
    return filename.substring(0, filename.lastIndexOf('.'))
}

function getFilePureName(dirname) {
    const dirs = dirname.split(path.sep);
    return dirs[dirs.length - 1];
}

gulp.task('clean', () => {
    return del(getOutputFolderName());
});

gulp.task('script', async () => {
    return gulp.src(`${srcFolder}/**/page-index.ts`)
        .pipe(named((file) => {
            return file.path.substring(file.path.indexOf('src') + 4).replace('.ts', '');
        }))
        .pipe(webpack(webpackConfig))
        .pipe(rename((path) => {
            if(path.dirname !== '.') {
                path.basename = getFilePureName(path.dirname)
            }
        }))
        .pipe(gulp.dest(`./${getOutputFolderName()}`))
        .pipe(uglify())
        .pipe(rename((path) => {
            if(path.dirname !== '.') {
                path.basename = `${getFilePureName(path.dirname)}.min`;
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(`./${getOutputFolderName()}`))
});

gulp.task('default', gulp.series('clean', gulp.series('script', () => {
    gulp.watch(`${srcFolder}/**/*.ts`, gulp.parallel('script'));
})));