let mongoDB = require("mongoose");
let config = require("./dbConfig.js");

mongoDB.connect(config.DB_URL);

mongoDB.connection.once("connected",()=>{
  console.log("Database has connected");
});

mongoDB.connection.once("error",(err)=>{
  console.log("An error has Occured : "+err);
})

mongoDB.connection.once("disconnected",()=>{
  console.log("Mongoose connection disconnected");
})

module.exports = mongoDB;
