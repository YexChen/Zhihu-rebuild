//这一页是文章的schema和静态函数创建的地方
let mongoDB = require("../config/db.js");

let Schema = mongoDB.Schema;

let CommentSchema = new Schema({
  content : {type : String},
  commenttime : {type : Date},
  user : {type : String},
  conversation : {type : Array},
  faved : {type: Number}
});

CommentSchema.static("addComment",function(params,callback){
  this.create({"user":params.username,"commenttime":new Date(),"content":params.content,"faved":0},callback);
});

CommentSchema.static("findComment",function(comments,callback){
  this.find({"_id":comments},callback);
});

CommentSchema.static("updateComment",function(params,callback){
  this.update({"_id":params.id},{"$push":{"conversation":{
    content : params.content,
    commenttime : new Date(),
    user : params.user,
    faved:0
  }}},callback);
})

module.exports = mongoDB.model("Comment",CommentSchema);
