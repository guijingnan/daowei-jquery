
const gulp = require('gulp');
const less = require('gulp-less');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });
var connect = require('gulp-connect');
var open=require('open');
//打包less
gulp.task('less',function () {
  return gulp.src('public/less/*.less')
    .pipe(less({plugins: [autoprefix]}))
    .pipe(gulp.dest('public/css'))
    .pipe(connect.reload());
});

gulp.task('default', ['less'])
gulp.task('hotReload',['default'], function () {
  connect.server({
    root: 'public',
    port: 5000,   //开启服务器的端口号
    livereload: true   //热更新：实时更新
  });

  gulp.watch('public/less/*.less', ['less']);
  //监听指定文件，一旦发生改变，就会调用执行后面的任务
  //自动打开指定网页
  open('http:localhost:5000');
});


gulp.task('myHotReload', ['default','hotReload'])

