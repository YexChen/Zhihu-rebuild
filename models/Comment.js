//这一页是文章的schema和静态函数创建的地方
let mongoDB = require("../config/db.js");

let Schema = mongoDB.Schema;

let CommentSchema = new Schema({
  content : {type : String},
  commenttime : {type : Date},
  user : {type : String},
  child : {type : Array}
});

CommentSchema.static("addComment",function(params,callback){
  this.create({"user":params.username,"commenttime":new Date(),"content":params.content},callback);
});

CommentSchema.static("findComment",function(comments,callback){
  this.find({"_id":comments},callback);
});

module.exports = mongoDB.model("Comment",CommentSchema);
