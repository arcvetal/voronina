const gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    rigger = require('gulp-rigger'),
    csso = require('gulp-csso'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    sourcemaps = require('gulp-sourcemaps'),
    plumber = require('gulp-plumber'),
    rimraf = require('rimraf'),
    browserSync = require('browser-sync').create();
    svgSprite = require('gulp-svg-sprite');
    bulkSass = require('gulp-sass-bulk-import');

const path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: './build',
        js: './build/js',
        css: './build/css',
        img: './build/img',
        fonts: './build/fonts'
    },
    src: { //Пути откуда брать исходники
        html: './src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        js: './src/js/script.js',//В стилях и скриптах нам понадобятся только main файлы
        style: './src/scss/**/*.scss',
        img: './src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: './src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: './src/**/*.html',
        js: './src/js/**/*.js',
        style: './src/style/**/*.scss',
        img: './src/img/**/*.*',
        fonts: './src/fonts/**/*.*'
    },
    clean: './build/**'
};
//
// const config = {
//     server: {
//         baseDir: "./build"
//     },
//     tunnel: true,
//     host: 'localhost',
//     port: 9000,
//     logPrefix: "Frontend_Vetal"
// };


// ---------- HTML

gulp.task('html:build', function () {
    return gulp.src(path.src.html) //Выберем файлы по нужному пути
        .pipe(plumber()) // пламберим
        .pipe(rigger()) //Прогоним через rigger
        .pipe(htmlmin({ collapseWhitespace: true })) // сжимаем
        .pipe(gulp.dest('./src')); //Выплюнем их в папку build
        // .pipe(browserSync.reload({stream: true})); //И перезагрузим наш сервер для обновлений
});
//
//
// // ---------  CSS
//
gulp.task('styles', function () {
    return gulp.src('./src/scss/style.scss')
        .pipe(bulkSass()) //Выберем наш main.scss
        // .pipe(sourcemaps.init()) //То же самое что и с js
        // .pipe(plumber()) // пламберим
        // .pipe(rigger()) //Прогоним через rigger
        .pipe(sass().on('error', sass.logError))
        // .pipe(autoprefixer({
        //     cascade: false
        // }))
        // .pipe(csso({
        //     restructure: false,
        //     sourceMap: true,
        //     debug: true
        // }))
        .pipe(rename('style.min.css'))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());  // =============== потом поменять на билд
        // .pipe(browserSync.stream());


});
//
//
// //------------------------ IMG
//
gulp.task('image:build', function () {
    return gulp.src(path.src.img) //Выберем наши картинки
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img)); //И бросим в build
        // .pipe(reload({stream: true}));
});

gulp.task('svgSprite', function () {
    return gulp.src('./src/img/svg/*.svg') // svg files for sprite
        .pipe(svgSprite({
                mode: {
                    stack: {
                        sprite: "sprite.svg"  //sprite file name
                    }
                },
            }
        ))
        .pipe(gulp.dest('./src/img/svg'));
});
//
// //------------------------ FONTS
//
gulp.task('fonts:build', function() {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});
//
//
//
// //------------------------JS
//
gulp.task('js:build', function () {
    return gulp.src(path.src.js) //Найдем наш main файл
        .pipe(plumber()) // пламберим
        .pipe(rigger()) //Прогоним через rigger
        // .pipe(sourcemaps.init()) //Инициализируем sourcemap
        // .pipe(uglify()) //Сожмем наш js
        // .pipe(sourcemaps.write()) //Пропишем карты
        // .pipe(rename('script.min.js'))
        .pipe(gulp.dest('./src/js'));//Выплюнем готовый файл в build
        //И перезагрузим сервер
});


gulp.task('build', gulp.series('html:build', 'styles', 'image:build', 'fonts:build', 'js:build'));


// gulp.task('browserSync', function() {
//   browserSync.init({
//     server: {
//       baseDir: './src/'
//     },
//   })
// })



// gulp.task('watcher', function () {
//   gulp.watch('./src/scss/**/*.scss', gulp.series('styles'));
// });






//=====================================================================

gulp.task('watcher', function() {

    browserSync.init({
        server: "./src/"
    });

    gulp.watch("./src/scss/**/*.scss", gulp.parallel('styles'));
    gulp.watch("./src/*.html").on('change', browserSync.reload);
    gulp.watch('./src/js/*.js', gulp.parallel('js:build'));
    gulp.watch('./src/img/*', browserSync.reload);
    gulp.watch('./src/img/svg/*', gulp.parallel('svgSprite'));
});

// // Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//     return gulp.src("app/scss/*.scss")
//         .pipe(sass())
//         .pipe(gulp.dest("app/css"))
//         .pipe(browserSync.stream());
// });
//
// gulp.task('default', ['serve']);
//













//
//
// //----------------- WATCHER
//
// gulp.task('watch', function(){
//     watch([path.watch.html], function(event, cb) {
//         gulp.start('html:build');
//     });
//     watch([path.watch.style], function(event, cb) {
//         gulp.start('style:build');
//     });
//     watch([path.watch.js], function(event, cb) {
//         gulp.start('js:build');
//     });
//     watch([path.watch.img], function(event, cb) {
//         gulp.start('image:build');
//     });
//     watch([path.watch.fonts], function(event, cb) {
//         gulp.start('fonts:build');
//     });
// });
// //
//
// //---------- SERVER
// //
// gulp.task('webserver', function () {
//    browserSync(config);
// });
// //
// //
// // //------------------CLEAN
gulp.task('clean', function (cb) {
  return rimraf(path.clean, cb);
});
// //
// //---------------------DEFAULT
//
// gulp.task('default', ['build', 'webserver', 'watch']);
//
//
//
// // Static Server + watching scss/html files
// gulp.task('serve', ['sass'], function() {
//
//     browserSync.init({
//         server: "src"
//     });
//
//     gulp.watch("src/scss/*.scss", ['sass']);
//     gulp.watch("src/*.html").on('change', browserSync.reload);
// });
//
// // Compile sass into CSS & auto-inject into browsers
// gulp.task('sass', function() {
//     return gulp.src("src/scss/*.scss")
//         .pipe(sass())
//         .pipe(gulp.dest("src/css"))
//         .pipe(browserSync.stream());
// });
// //
// gulp.task('default', ['serve']);
