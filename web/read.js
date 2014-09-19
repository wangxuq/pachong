var async = require('async');
var db = require('../config').db;
var debug = require('debug')('blog:web:read');

//获取文章分类列表
exports.classList = function(callback){
	debug('获取文章分类列表');
	db.query('select * from class_list order by id asc',callback);
}

//检查分类是否存在
exports.isClassExists = function(id,callback){
	debug('检查分类是否存在:%s',id);
	db.query('select * from class_list where id = ? limit 1',[id],function(err,ret){
		if(err){
			return next(err);
		}
		callback(null,Array.isArray(ret) && ret.length >0);
	});
};

//获取指定分类的信息
exports.class = function(id,callback){
	debug('指定获取分类的信息:%s',id);
	db.query('select * from class_list where id=? limit 1',[id],function(err,list){
		if(err){
			return callback(err);
		}
		if(!(list.length > 0)){
			return callback(new Error('该分类不存在'));
		}
		callback(null,list[0]);
	});
};

//获取指定文章的详细信息
exports.article = function(id,callback){
	debug('获取指定文章的详细信息 :%s',id);
	console.log("web read id="+id);
	var sql = 'select * from  article_list as a'+' left join article_detail as b on a.id = b.id'+' where a.id=? limit 1';
	db.query(sql,[id],function(err,list){
		if(err){
			return callback(err);
		}
		if(!(list.length > 0)){
			return callback(new Error('this article is not exists'));
		}
		callback(null,list[0]);
	});
};

//获取指定分类下的文章列表
exports.articleListByClassId = function(classId,offset,limit,callback){
	console.log("classId="+classId+",offset="+offset+",limit="+limit);
	debug('获取指定分类下的文章列表:%s,%s,%s',classId,offset,limit);
	var sql = 'select * from article_list as a'+' left join article_detail as b on (a.id = b.id)'+' where class_id=?'+' order by created_time desc limit ?,?';
	db.query(sql,[classId,offset,limit],callback);
};

//获取指定标签下的文章列表
exports.articleListByTag = function(tag,offset,limit,callback){
	debug('获取指定标签下的文章列表 :%s,%s,%s',tag,offset,limit);
	var sql = 'select * from article_list where id in ('+'select id from article_tag where tag =? )'+'order by created_time desc limit ?,?';
	db.query(sql,[tag,offset,limit],callback);
};

//获取指定标签下的文章数量
exports.articleCountByTag = function(tag,callback){
	debug('获取指定标签下的文章数量：%s',tag);
	db.query('select count(*) as c from  article_tag where tag=?',[tag],function(err,ret){
		if(err){
			return callback(err);
		}
		callback(null,ret[0].c);
	});
};