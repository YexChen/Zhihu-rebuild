# Zhihu-rebuild
知乎网站重构(利用express部署)

#关于github的使用
先commit,再pull，再push

#

#技术栈
数据引擎:NodeJS
数据库:MongoDB zhihu
web服务器框架:express
模板渲染引擎:ejs
后端包管理:npm
前端包管理:bower

#功能
实现用户登录，注册，更改头像，个人简介，个人提问，回答，查看发表的文章，收藏，关注等功能
实现发表提问，回答等功能
后续还有功能，待添加


#Users--用户表的设计
Users
用户表
username 用户名
nickname 用户昵称
password 密码
question 问的问题
answer 回答的问题
 article 写的文章
Star 收藏的文章
Fave 可能喜欢的内容
created_time 创建时间
updated_time 最后登录时间
token : 用户的session里面包括的token
