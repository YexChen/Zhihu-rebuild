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
      //这里要多加一条文章为空的错误处理
      return res.json({
        status : 0,
        msg : "用户评论添加完毕"
      })
    })
  })
}

//添加楼中楼回复(body)
exports.commentToComment = function(req,res,next){
  //前端传过来的参数：
  //@params id 评论的_id(层主comment的id)
  //@params user 评论的人（新评论的人）
  //@params content 评论的内容
  let params = {
    id : req.body.id,
    user : req.body.user,
    content : req.body.content
  }
  //先判断参数是否存在，@to-fixed:如果后期有时间就做一下用户是否存在
  if(!params.id||!params.user||!params.content){
    return res.json({
      status : 102,
      msg : "参数错误"
    });
  }
  //然后更新层主comment的conversation，插入一个对象
  Comments.updateComment(params,(err,doc)=>{
    if(err){
      return res.json({
        status : 506,
        msg : "系统更新楼中楼时发生错误",
        err
      });
    }
    if(doc == ""){
      return res.json({
        status : 105,
        msg : "层主id未找到"
      });
    }
    //然后在回掉函数中提示成功json
    return res.json({
      status : 0,
      msg : "楼中楼添加成功"
    })
  })
}

//页面点赞功能(post)
exports.pageFave = function(req,res,next){
//前端传过来的数据：
//@params pid 文章名
//@params uid 用户名（点赞的人）
let params = {
  pid : req.body.pid,
  uid : req.body.uid
}

//先检查参数，@todo后期在做确认用户名是否存在
if(!params.pid||!params.uid){
  return res.json({
    status : 101,
    msg : "参数错误"
  });
}
//进入数据库找文章
Article.findArticle(params.pid,(err,doc)=>{
  if(err){
    return res.json({
      status : 503,
      msg : "数据库文章查找错误"
    });
  }
  if(doc == ""){
    return res.json({
      status : 103,
      msg : "文章没有找到"
    });
  }

  let promise = new Promise(function(resolve,result){
    let find = false;
    for(let i =0;i<doc[0].faved.length;i++){
      if(doc[0].faved[i]==params.uid){
        // 如果有用户名的话删掉用户名
        find = true;
        Article.deleteFave(params,(err,doc)=>{
          if(err){
            return res.json({
              err
            });
          }
          if(doc == ""){
            return res.json({
              status : 104,
              msg : "文章没有找到"
            })
          }
          return res.json({
            status : 0,
            msg : "成功取消赞"
          });
        })
      }
    }
    if(!find)
      resolve(find);
  });

  promise.then(function(find){
    //如果没有的话，添加用户名
    Article.addFave(params,(err,doc)=>{
      if(err){
        return res.json({
          status : 505,
          msg : "数据库查询文章时出错",
          err
        });
      }
      if(doc == ""){
        return res.json({
          status : 107,
          msg : "文章没有找到"
        });
      }
      return res.json({
        status : 0,
        msg : "成功添加赞"
      })
    });
  });

});

}
