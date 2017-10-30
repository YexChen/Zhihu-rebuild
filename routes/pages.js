//这一页写页面跳转的函数，全部封好，export,作为callback传到
// router里面去(req,res,next)
let express = require('express');
let Article = require("../models/Article");
let Comments = require("../models/Comment");
let Users = require("../models/Users");

exports.showIndex = function(req,res){
  //后期会在这里渲染index.js页面，这里直接渲染
  return res.render("index.ejs",{/*这里写参数，可能要加逻辑*/});
}

exports.showLogin = function(req,res){
  //显示登陆页
  return res.render("login.ejs",{});
}

exports.showRegist = function(req,res){
  return res.render("regist.ejs",{});
}

//显示文章(get)
exports.showArticle = function(req,res){
  //显示文章页面
  //这里定义params
  let params = {
    id : req.params["articlename"]
  };
  Article.findArticle(params.id,(err,doc)=>{
    if(err){
      res.json({
        status : 501,
        msg : "数据库查找文章出错",
        err : err
      });
      next();
    }
    //这里还要通过查询Comment表来查找评论，下面这些丢到下一级回调里面
    Comments.findComment(doc[0].comments,(err,doc2)=>{
      //替换数据
      doc[0].comments = doc2;
      //查找到文章以后在callback函数里面记录到这里的renderParams
      if(doc == ""){
        return res.send("文章好像不存在诶");
      }
      //然后res.render("xxx.ejs",params)就可以了
      return res.render("article",doc[0]);
    });

  });
}

//显示问答页面
exports.showAsk = function(req,res,next){
  //前端传过来的参数:askid
  //@params askid 问答页面id
  //用ejs渲染
  //从数据库里面寻找问答页面的id,然后渲染出来
  let params = {
    askid : req.params["askid"]
  };
  Article.findArticle(params.askid,(err,doc)=>{
    if(err){
      return res.json({
        status : 502,
        msg : "数据库查询文章错误"
      });
    }
    if(doc == ""){
      return res.json({
        status : 103,
        msg : "无法找到文章"
      });
    }
    return res.render("ask",doc[0]);
  });
}

exports.showUser = function(req,res,next){
  //前端传过来的数据：
  //@params uid 用户 name 
  let params = {
    uid : req.params["uid"]
  };
  Users.findUser(params.uid,(err,doc)=>{
    if(err)
      return res.json({
        status : 505,
        msg : "数据库查找用户名出错"
      });
    if(doc == "")
      return res.json({
        status : 109,
        msg : "用户无法找到"
      });
    return res.render("user",doc[0]);
  });
};
