let express = require("express");
let Users = require("../models/Users");
let pwdenc = require("../config/md5enc");
let bodyParser = require("body-parser");

exports.userLogin = function(req,res,next){
  //处理用户登录请求，需要接收用户名和密码
  let params = {
    username : req.body.username,
    password : pwdenc(req.body.password.toString())
  };
  //先检查用户名和密码是否存在，不存在返回报错json
  if(!params.username||!params.password){
    return res.json({
      status : 101,
      msg : "用户名或者密码不存在，或者参数名不合法！"
    });
  }
  //接下来从数据库里面找对应的用户名和密码(密码记得md5)，如果不存在则返回报错json
  Users.findUserAndPassword(params.username,params.password,(err,doc)=>{
    if(err){
      return res.json({
        status : 501,
        msg : "数据库用户名查询出错"+err
      });
    }
    if(doc==""){
      return res.json({
        status : 103,
        msg : "用户名或者密码不存在",
        detail : ""
      })
    }
    //数据库里面数据匹配，返回成功json，然后写上一个cookie
    if(doc != ""){
      //cookie里面包含用户名username，还有相应的token码
      res.cookie("username",params.username,{maxAge:60*60*24});
      res.cookie("token",pwdenc(params.password,{maxAge:60*60*24}));
      return res.json({
        status : 0,
        msg : "用户名验证成功",
      });
    }
  })
}

//接下来是注册API
exports.userRegist = function(req,res){
  //里面包含用户名username，还有相应的token码
  let params = {
    username : req.body.username,
    password : pwdenc(req.body.password.toString())
  };
  //先检查参数里面有没有用户名，没有用户名返回报错json
  if(!params.username){
    return res.json({
      status : 101,
      msg : "用户名参数错误！请检查参数"
    });
  }
  //如果有的话就去数据库里面查
  Users.findUser(params.username,(err,doc)=>{
    //处理数据库err
    if(err){
      return res.json({
        status : "503",
        msg : "数据库查询用户名错误"+err
      });
    }
    //找到用户的话，返回报错json
    if(doc != ""){
      return res.json({
        status : 105,
        msg : "用户名已经存在"
      })
    }
    //没有找到的话
    //数据库写下值,返回正确json
    Users.createUser(params,(err,doc)=>{
      if(err){
        return res.json({
          status : 506,
          msg : "数据库创建用户失败"+err
        })
      }
      //种下cookie
      res.cookie("username",params.username,{maxAge:60*60*24});
      res.cookie("token",pwdenc(params.password,{maxAge:60*60*24}));

      return res.json({
        status : 0,
        msg : "成功注册!",
      });
    });
  });

}

exports.userLogout = function(req,res){
  //注销函数
  //所谓注销，就是消除掉session
  //检查是否有session，如果没有，返回报错的json
  if(!req.cookies.username||!req.cookies.token){
    return res.json({
      status : 106,
      msg : "用户cookie不存在"
    });
  }
  //如果有，删除，返回成功的json
  res.cookie("username","",{maxAge:-1});
  res.cookie("token","",{maxAge:-1});
  return res.json({
    status : 0,
    msg : "用户登陆信息已经删除"
  });
}

//这里是检查用户是否登陆
exports.checkLogin = function(req,res){
  //检查cookie中username 和token是否存在，不存在返回报错json
  if(!req.cookies.username||!req.cookies.token){
    return res.json({
      status : 104,
      msg : "用户cookie不存在"
    });
  }
  //如果存在的话和数据库里面进行比对
  Users.findUser(req.cookies.username,(err,doc)=>{
    if(err){
      return res.json({
        status : 502,
        msg : "数据库用户查询出错"
      });
    }
    if(doc == ""){
      return res.json({
        status : 101,
        msg : "用户cookie无效"
      })
    }
    console.log(doc[0]);
    if(req.cookies.token!=pwdenc(doc[0].password.toString())){
      return res.json({
        status : 102,
        msg : "用户cookie不匹配"
      })
    }
    //如果正确的话就返回正确json
    return res.json({
      status : 0,
      msg : "用户信息校验成功"
    });
  });
}
