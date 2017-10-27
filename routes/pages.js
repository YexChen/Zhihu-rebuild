//这一页写页面跳转的函数，全部封好，export,作为callback传到
// router里面去(req,res,next)
let express = require('express');
let Article = require("../models/Article");
let Comments = require("../models/Comment");

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
