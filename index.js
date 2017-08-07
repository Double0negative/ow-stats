var express =  require( "express");
var settings   = require("./settings.json");
var request    = require("request");
var webshot    = require("webshot");
var sql        = require("./library/sql.js");
var library    = require("./library/library.js");

const server = express()
server.set("view engine", "pug")

server.get("/", function(req, res) {

})


server.get("/screenshot/:url", function (req, res) {
  var url = req.params.url;
  url = url.replace("+", "?")
  console.log(url)
  var options = {
    screenSize: {
      width: 700,
      height: 500
    }
  }
  webshot("http://localhost:3000/" + url, "img.png", options, function(err) {
    if(err)
      throw err
    res.sendFile("img.png", {root: __dirname});
  })
});

server.get('/stats', function (req, res) {
  sql.getUserStatsByOverwatchId(req.param("id"), function(users){
    sql.getPlaytimeByBlob(users.blob_id, "competitive", function(playtime) {
      res.render("stats", {user: users, playtime: playtime})
      console.log(users)
    });
  });
});

server.get("/live-stats", function (req, res) {
  library.getStats(req.param("id"), req.param("plat"), function(id, result) {
    console.log("result", result)

    var stats = library.rawToStats(result.us);
    res.render("live-stats", stats)
  });
})


var graphDef = {

}


server.get("/graph", function(req, res) {
  sql.getUserStatsByOverwatchId(req.param("id"), function(stats) {
    res.render("graph", {stats: stats});
  })
})


server.use(express.static('public'))

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
