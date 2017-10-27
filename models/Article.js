//这一页是文章的schema和静态函数创建的地方
let mongoDB = require("../config/db.js");

let Schema = mongoDB.Schema;

let ArticleSchema = new Schema({
  name : {type:String},
  author : {type : String},
  publishtime : {type : Date},
  updatedtime : {type : Date},
  content : {type : String},
  faved : {type : Array},
  collected : {type : Array},
  comments : {type : Array}
});

ArticleSchema.static("insertArticle",function(params,callback){
  this.create({"name":params.name,"author":params.author,"content":params.content,"collected":params.collected,"publishtime":new Date()},callback)
});

ArticleSchema.static("findArticle",function(id,callback){
  this.find({"_id":id},callback);
})

ArticleSchema.static("updateComment",function(pid,cid,callback){
  this.update({"_id":pid},{"$push":{"comments":cid}},callback);
});

ArticleSchema.static("deleteFave",function(params,callback){
  this.update({"_id":params.pid},{"$pull":{"faved":params.uid}},callback);
})

ArticleSchema.static("addFave",function(params,callback){
  this.update({"_id":params.pid},{"$push":{"faved":params.uid}},callback);
})

module.exports = mongoDB.model("Article",ArticleSchema);
