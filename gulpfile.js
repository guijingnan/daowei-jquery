var gulp = require('gulp');
var jshint = require('gulp-jshint');
var pkg = require('./package');
var devImg = 'public/image/*.*';                    //img
var devTplHtml  = 'public/template/*.html';                 //模板文件html

var  distTplHtml = 'dist/template';
var  distImg= 'dist/image';
var imagemin = require('gulp-imagemin');         //图片压缩
var  imageminJpegRecompress  = require('imagemin-jpeg-recompress');

var  imageminOptipng  = require('imagemin-optipng');
//引入package.json文件，并转化为js对象
var jshintConfig = pkg.jshintConfig; //拿到jshintConfig属性
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var open=require('open');
gulp.task('jshint', function () {   //任务名（js语法检查）
  /*任务的具体内容*/
  return gulp.src('public/js/*.js')   //将指定文件加载到内存中（数据流）
    .pipe(jshint(jshintConfig))    //语法检查：通过流的方式检查
    .pipe(jshint.reporter('default'))  //语法检查的报错规则
    .pipe(connect.reload());
})
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('js',['jshint'],function(){
  //['jshint']必须先执行，再执行本身的回调函数
  return gulp.src('public/js/*.js')
  //合并后的文件名，储存在流中
    .pipe(concat('built.js',{newLine:';'}))
    .pipe(gulp.dest('build/js'))  //将内存中的数据流输出到指定路径
    .pipe(uglify())   //将现在数据流中的文件压缩
    .pipe(rename('dist.min.js')) //将数据流中的文件改名
    .pipe(gulp.dest('dist/js'))  //将内存中的数据流输出到指定路径
    .pipe(connect.reload());
});
var less = require('gulp-less');//less编译模块
var cssmin = require('gulp-cssmin');//css压缩模块
var cleanCSS = require('gulp-clean-css');//css压缩模块
//less编译自动添加前缀
var LessAutoprefix = require('less-plugin-autoprefix');
//前缀兼容最新两个版本的浏览器
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });

gulp.task('less',function(){
  return gulp.src('public/less/*less')
    .pipe(less({plugins: [autoprefix]}))
    .pipe(rename({extname:'.css'}))
    .pipe(gulp.dest('build/css'))
    .pipe(connect.reload());
});

gulp.task('css',['less'],function(){
  return gulp.src('build/css/*.css')
    .pipe(concat('dist.min.css'))
    .pipe(cssmin()) //兼容ie8
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});
gulp.task('imgmin',function(){
  var jpgmin = imageminJpegRecompress({
      accurate:true,//高精度模式
      quality:"high",//图像质量:low,medium,high and veryhigh
      method:"smallfry",//网络优化:mpe,ssim,ms-min and smallfry
      min:70,//最低质量
      loops:0,//循环尝试次数，默认为6
      progressive:false,//基线优化
      subsmaple:"default"//子采样:default,disable
    }),
    pngmin = imageminOptipng({
      optimizationLevel:4
    });
  gulp.src(devImg)
    .pipe(imagemin({
      use:[jpgmin,pngmin]
    }))
    .pipe(gulp.dest(distImg))
});
var htmlmin = require('gulp-htmlmin');
gulp.task('html', function() {
  return gulp.src('public/*.html')
    .pipe(htmlmin({collapseWhitespace:true,removeComments:true}))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});
gulp.task('tplmin',function(){
  gulp.src(devTplHtml)
    .pipe(htmlmin())
    .pipe(gulp.dest(distTplHtml));
});
gulp.task('watch',['default'],function(){
  //开启监听
  livereload.listen();
 // 监听的任务
//监听指定文件，一旦发生改变，就会调用执行后面的任务
  gulp.watch('src/js/*.js',['js']);
//监听指定文件，一旦发生改变，就会调用执行后面的任务
  gulp.watch('src/less/*.less',['css']);
  //监听指定文件，一旦发生改变，就会调用执行后面的任务
  gulp.watch('public/*.html',['html']);
  gulp.watch(devTplHtml,['tplmin']);
  gulp.watch(devImg,['imgmin']);
});

gulp.task('hotReload',['default'], function () {
  connect.server({
    root: 'dist', //根目录路径
    port: 8001,   //开启服务器的端口号
    livereload: true   //热更新：实时更新
  });
  //监听的任务
//监听指定文件，一旦发生改变，就会调用执行后面的任务
  gulp.watch('public/js/*.js',['js']);
//监听指定文件，一旦发生改变，就会调用执行后面的任务
  gulp.watch('public/less/*.less',['css']);
  //监听指定文件，一旦发生改变，就会调用执行后面的任务
  gulp.watch('public/*.html',['html']);
  gulp.watch(devTplHtml,['tplmin']);
  gulp.watch('public/image/*.*',['imgmin']);
  //自动打开指定网页
  open('http:localhost:8001');
});
gulp.task('default', ['js','css','html','tplmin','imgmin']); //异步执行
gulp.task('myHotReload', ['default','hotReload']); //应用热更新，异步执行
