var mysql      = require('mysql');
var settings   = require("./../settings.json");
var ranks      = require("./ranks.js");
var mysqls = settings.mysql;

var sql = mysql.createConnection({
  host     : mysqls.host,
  user     : mysqls.user,
  password : mysqls.pass,
  database : mysqls.db
});

sql.connect();

var query = {}

query.getUsers = function(callback) {
  sql.query("SELECT * FROM users", function (err, res, row) {
    callback(queryToObject(res, row));
  });
}



query.getUserStatsByOverwatchId = function(id, callback) {
  sql.query("SELECT * FROM stats " +
  "INNER JOIN stats_blob ON stats.blob_id = stats_blob.id WHERE stats.overwatch_id = ? ORDER BY stats.id desc", [id], function(err, res, row) {
    if(err)
      throw err

    var ret = queryToObject(res, row)[0];
    ret.stats = JSON.parse(ret.stats).stats
    ret.reallevel = ret.level + ret.prestige * 100
    ret.rank_obj = ranks.getRank(ret.rank);
    ret.kdr = Math.round((ret.eliminations / (ret.deaths || 1)) * 100) / 100 ;
    callback(ret);
  });
}

query.getPlaytimeByBlob = function(blob, mode, callback) {
  sql.query("SELECT * FROM playtime WHERE blob_id=? AND mode=? ORDER BY cast(time as double) DESC", [blob, mode], function(err, res, row) {
    var arr = queryToObject(res, row)
    var max = -1;
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      if(max == -1) {
        max = obj.time;
      }
      obj.percent = obj.time / max;
      obj.width = 400 * obj.percent;
      console.log("gi")
    }
    callback(arr)
  })
}

 function queryToObject(res, row) {
  var arr = [];
  for (var i = 0; i < res.length; i++) {
    var obj = {};
    for (var j = 0; j < row.length; j++) {
      obj[row[j].name] = res[i][row[j].name];
    }
    arr.push(obj);
  }
  return arr;
}

module.exports = query;
