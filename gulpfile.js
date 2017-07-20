/**
 * Created by wangdunwen on 2016/12/5.
 */
//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less');
    minifyCss = require('gulp-minify-css');
    uglify1 = require('gulp-uglify');
    uglify2 = require('gulp-uglify');
    htmlmin = require('gulp-htmlmin');

/*//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
    gulp.src('src/less/index.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
});

gulp.task('default',['testLess', 'elseTask']); *///定义默认任务 elseTask为其他任务，该示例没有定义elseTask任务

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组)
//gulp.dest(path[, options]) 处理完后文件生成路径

/*混淆CSS文件*/
gulp.task('minifycss',function(){
    return gulp.src('css/*.css')
        .pipe( minifyCss() )
        .pipe( gulp.dest('dist/css') )
});

/*混淆HTML文件*/
gulp.task('htmlmin',function(){
    return gulp.src('index.html')
        .pipe( htmlmin() )
        .pipe( gulp.dest('dist') )
});

/*混淆js文件*/
gulp.task('uglify1',function(){
    return gulp.src('js/*.js')
        .pipe( uglify1() )
        .pipe( gulp.dest('dist/js') )
});

/*混淆js文件*/
gulp.task('uglify2',function(){
    return gulp.src('js/*/*.js')
        .pipe( uglify2() )
        .pipe( gulp.dest('dist/js/') )
});


/*监听文件*/

gulp.task('watchCss', function(){
    return gulp.watch('css/*.css',['minifycss']);
});

gulp.task('watchHtml', function(){
    return gulp.watch('index.html',['htmlmin']);
});

gulp.task('watchJs1', function(){
    return gulp.watch('js/*.js',['uglify1']);
});

gulp.task('watchJs2', function(){
    return gulp.watch('js/*/*.js',['uglify2']);
});

gulp.task('default',['minifycss', 'htmlmin', 'uglify1', 'uglify2','watchCss', 'watchHtml', 'watchJs1', 'watchJs2'],function(){
    console.log('开始混淆...');
});