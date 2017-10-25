var express = require('express');
var router = express.Router();

//引入分页路由器
let pages = require(__dirname+"/pages.js");

//引入users用户表分路由器
let users = require(__dirname+"/users.js");

//这里是总路由
//主页
router.get("/",pages.showIndex);
//登陆页
router.get("/login",pages.showLogin);
//注册页
router.get("/regist",pages.showRegist);


//这里是额外路由
router.get(function(req, res, next) {
  res.send("您访问的页面已经不在地球");
});

module.exports = router;
