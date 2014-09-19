var express = require('express');
var path = require('path');
var read = require('./web/read');
var config = require('./config');

var app = express();

//配置express
app.configure(function(){
	app.set('views',__dirname+'/views');
	app.set('view engine','ejs');
	app.use(app.router);
	app.use('/public',express.static(path.join(__dirname,'public')));
});
//网站首页
app.get('/',function(req,res,next){
	//第一个参数是文章分类的ID，第二个参数是返回结果的开始位置，第三个参数是返回结果的数量
	read.articleListByClassId(0,0,20,function(err,list){
		if(err){
			return next(err);
		}
		
		//渲染模板
		res.locals.articleList = list;
		res.render('index');
	});
});
//获取文章页面内容
app.get('/article/:id',function(req,res,next){
	//通过req.param.id来取得URL中：id部分的参数
	read.article(req.params.id,function(err,article){
		if(err){
			return next(err);
		}
		//渲染模板
		res.locals.article = article;
		res.render('article');
	});
});
app.listen(config.port);
console.log('the server has been started');

var spawn = require('child_process').spawn;
var cronJob = require('cron').CronJob;
var job = new cronJob(config.autoUpdate,function(){
	console.log('开始执行定时更新任务');
	var update = spawn(process.execPath,[path.resolve(__dirname,'update/all.js')]);
	update.stdout.pipe(process.stdout);
	update.stderr.pipe(process.stderr);
	update.on('close',function(code){
		console.log('更新任务结束,代码=%d',code);
	});
});
job.start();
process.on('uncaughtException',function(err){
	console.log('uncaughtException:%s',err.stack);
});
