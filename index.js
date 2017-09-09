var express =  require( "express");
var settings   = require("./settings.json");
var request    = require("request");
var webshot    = require("webshot");
var sql        = require("./library/sql.js");
var library    = require("./library/library.js");

const server = express()
const regions = ['us', 'any', 'eu', 'kr']
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

server.get("/raw-stats", function(req, res) {
  library.getStats(req.param("id"), function(result) {

    console.log("result", result)

    if(!result) {
      err(res, 404, "Profile not found");
      return;
    }
    var using = selectRegion(result);
    var stats = library.rawToStats(using);

    stats.user.overwatch_id = req.param("id").replace("-", "#");
    res.send(stats)
  });
})

server.get("/live-stats", function (req, res) {
  library.getStats(req.query.id, function(result){
    console.log("result", result)
    if(!result) {
      err(res, 404, "Profile not found")
      return;
    }

    var using = result[req.query.region];

    if(!using)
      using = selectRegion(result);

    if(!using) {
      err(res, 404, "Profile not found")
      return;
    }

    var stats = library.rawToStats(using);
    stats.user.overwatch_id = req.query.id.replace("-", "#");

    res.render("live-stats", stats)
  })
});


server.get("/add-user", function(req, res) {
    sql.insertUser(req.param("discord"), req.param("server"), req.param("id"), req.param("region"), req.param("platform"), function(er) {
      if(er) {
        console.log(er)
        res.send({status: 500, msg: "Failed to add user"});
        res.end();
        return;
      }
      res.send({status: 200});
      res.end()
    });
})


server.get("/get-user", function(req, res) {
  sql.getUser(req.query.discord, req.query.server, function (er, player) {
    if(er) {
      console.log("Error getting user ", er)
      res.send({status: 500, msg: "Failed to get user"})
    }
    console.log(player)
    if(player && player[0]) {
      res.send(player[0]);
    } else {
      err(res, 404, "Profile not found")
    }
  })
})
var graphDef = {

}

function selectRegion(result) {
  var using;
  for(var a = 0; a < regions.length; a++) {
    using = result[regions[a]];
    if(using)
      return using;
  }
  return using;
}

function err(res, status, msg) {
  res.send({error: status, msg: msg});
  res.end();
}

server.get("/graph", function(req, res) {
  sql.getUserStatsByOverwatchId(req.param("id"), function(stats) {
    res.render("graph", {stats: stats});
  })
})

server.get("/rankings", function(req, res) {
  res.render("rankings")
})

server.use(express.static('public'))

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
