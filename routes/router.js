var express = require('express');
var router = express.Router();
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");

//应该是处理req，res的吧，直接搬过来了
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

//还要来点处理cookie的东西
router.use(cookieParser());

//引入分页路由器
let pages = require(__dirname+"/pages.js");

//引入users用户表分路由器
let users = require(__dirname+"/users.js");

//引入aiticle文章表分路由器
let article = require(__dirname+"/article.js");

//这里是总路由
//主页
router.get("/",pages.showIndex);
//登陆页
router.get("/login",pages.showLogin);
//注册页
router.get("/regist",pages.showRegist);
//文章页
router.get("/p/:articlename",pages.showArticle)


//这里是API路由
//登陆API
router.post("/users/login",users.userLogin);
//注册API
router.post("/users/regist",users.userRegist);
//注销API
router.post("/users/logout",users.userLogout);
//检查是否登陆
router.get("/users/checkLogin",users.checkLogin);
//发表文章
router.post("/article/publish",article.publishAriticle);
//发表回复
router.post("/article/comment",article.addComment);


//这里是额外路由
router.get(function(req, res, next) {
  res.send("您访问的页面已经不在地球");
});

module.exports = router;
