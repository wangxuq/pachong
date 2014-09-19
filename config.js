var mysql = require('mysql');
exports.db = mysql.createConnection({
	host : '127.0.0.1',
	port : '3306',
	database : 'pachong',
	user : 'root',
	password : 'beijing'
});

//爬虫配置
exports.sinaBlog = {
	url : 'http://blog.sina.com.cn/u/1776757314'
};

exports.port = 3000;

exports.autoUpdate = "* * /30 * * *";
