//这一页是用户的schema和静态函数创建的地方
let mongoDB = require("../config/db.js");

let Schema = mongoDB.Schema;

let UsersSchema = new Schema({
  id : {type : Number},
  username : {type:String},
  nickname : {type:String},
  password : {type:String},
  question : {type:Array},
  answer : {type:Array},
  article : {type:Array},
  Star : {type:Array},
  Fave : {type:Array},
  created_time : {type : Date},
  updated_time : {type : Date},
  token : {type : String}
});

UsersSchema.static("findUserAndPassword", function(username,password,callback){
  this.find({"username":username,"password":password},callback);
});

UsersSchema.static("findUser",function(username,callback){
  this.find({"username":username},callback);
});

UsersSchema.static("createUser",function(params,callback){
  this.create({"username":params.username,"password":params.password},callback)
});


module.exports = mongoDB.model("Users",UsersSchema);
