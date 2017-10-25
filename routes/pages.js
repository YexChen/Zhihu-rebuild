//这一页写页面跳转的函数，全部封好，export,作为callback传到
// router里面去(req,res,next)
let express = require('express');

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
