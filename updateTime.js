var mysql      = require('mysql');
var settings   = require("./settings.json");
var request    = require("request");
var mysqls = settings.mysql;

var platforms = ["pc", "xbl", "psn"];
var regions   = ["us", "eu", "kr"];

var season = 6;
var total = 0;

var sql = mysql.createConnection({
  host     : mysqls.host,
  user     : mysqls.user,
  password : mysqls.pass,
  database : mysqls.db
});
/*
sql.query("SELECT * FROM playtime_old ", function (err, res, req) {
  var a = 0;
  for (var i = 0; i < res.length; i++) {
    var playtime = res[i];

    sql.query("INSERT INTO winrate (blob_id, overwatch_id, " + playtime.hero + ") VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE " + playtime.hero + "=?", [playtime.blob_id, playtime.overwatch_id, playtime.win, playtime.win], function (err, ress, roww) {
      if(err)
        throw err
        console.log(++a)
    })
  }
})*/

sql.query("SELECT * FROM stats_blob ORDER BY id ASC", function(er, res, rows) {
  var a = 0;
  console.log(res.length);
  for (var i = 0; i < res.length; i++) {
    var row = res[i];
    sql.query("UPDATE playtime SET overwatch_id=? WHERE blob_id=?", [row.overwatch_id, row.id], function(err, rr, rrr) {
      if(err)
        throw err
        console.log(++a);
    })
  }
})
