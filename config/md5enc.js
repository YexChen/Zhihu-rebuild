let crypto = require("crypto");

function pwdenc(password){
  let md5 = crypto.createHash("md5");
  let enc1 = md5.update(password);
  let enc2 = md5.update(password).digest("base64");
  return (enc2 + "CS");
}

module.exports = pwdenc;
