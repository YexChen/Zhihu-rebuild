let express = require("express");
let Article = require("../models/Article");
let pwdenc = require("../config/md5enc");
let bodyParser = require("body-parser");
let Comments = require("../models/Comment");

//发表文章(post)
exports.publishAriticle = function(req,res,next){
  //前端传过来的数据
  // @params name 标题，文章名，作为索引来用的
  // @params publisher 发表文章的作者
  // @params content 正文
  // @[params] 可选参数 collected 被收录的专栏
  let params = {
    name : req.body.name,
    author : req.body.author,
    content : req.body.content,
    collected : req.body.collected || []
  }
  //需要把文章写进数据库
  Article.insertArticle(params,(err,doc)=>{
    if(err){
      return res.json({
        status : 501,
        msg : "数据库插入错误"
      });
    }
    //完成以后，返回正确json
    return res.json({
      status : 0,
      msg : "文章插入成功"
    })
  })
}

//添加评论功能(post)
exports.addComment = function(req,res,next){
  //前端传过来的参数
  //@params username 用户名，用来联查
  //@params content 内容，评论的内容
  //@params pid 文章id，用来给文章表加一个子评论
  let params = {
    username : req.body.username,
    content : req.body.content,
    pid : req.body.pid
  };
  //先检查参数是否合法
  if(!params.username||!params.content||!params.pid){
    return res.json({
      status : 102,
      msg : "用户参数不合法，请检查名称后再输入"
    });
  }
  //然后在Comment模型中添加一条记录,包括时间
  Comments.addComment(params,(err,doc)=>{
    if(err){
      return res.json({
        status : 502,
        msg : "服务器添加评论错误",
        err : err
      })
    }
    if(doc == ""){
      return res.json({
        status : 108,
        msg : "找不到用户"
      });
    }
    //添加完成后在回调函数中在Article模型中添加一条记录
    Article.updateComment(params.pid,doc._id,(err,doc)=>{
      if(err){
        return res.json({
          status : 505,
          msg : "是数据库添加评论失败,确定用户名存在？",
          err : err
        });
      }
      //然后再在新的回掉函数中提示添加完毕
      return res.json({
        status : 0,
        msg : "用户评论添加完毕"
      })
    })
  })
}

//
