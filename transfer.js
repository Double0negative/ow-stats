var transfer = require("./transfer.json");
var sql    = require("./library/sql.js");

var a = 0;
for(var server in transfer) {
  var users = transfer[server];

  for(var userid in users) {
    var user = users[userid];
    user.region = user.region || "";
    console.log("Adding user ", user);

    sql.insertUser(userid, server, user.id, user.region, "", function(er) {
    })
    a++;
  }

}
console.log("added ", a)
