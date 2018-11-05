var express =  require( "express");
var settings   = require("./settings.json");
var request    = require("request");
var webshot    = require("webshot");
var sql        = require("./library/sql.js");
var library    = require("./library/library.js");
var ranks      = require("./library/ranks.js");

const server = express()
const regions = ['us', 'any', 'eu', 'kr']
server.set("view engine", "pug")

server.get("/", function(req, res) {

})


server.get("/screenshot/:url", function (req, res) {
  var url = req.params.url;
  url = url.replace("+", "?")
  console.log(req.query.width)
  console.log(url)
  var options = {
    screenSize: {
      width: req.query.width || 700,
      height: req.query.height ||  500
    }
  }

  console.log(options);
  webshot(encodeURI("http://localhost:3000/" + url), "img.png", options, function(err) {
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
  console.log("Id", req.query.id)
  library.getStats(req.query.id, function(result){
    console.log("result", result)
    if(result.error) {
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

    res.render(req.query.card ? "live-stats-full" : "live-stats", stats)
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
  var callback = function (er, player) {
    if(er) {
      console.log("Error getting user ", er)
      res.send({status: 500, msg: "Failed to get user"})
    }
    if(player && player[0]) {
      res.send(player[0]);
    } else {
      err(res, 404, "Profile not found")
    }
  }

  if(req.query.owid) {
    sql.getUserByOwid(req.query.owid, callback);
  } else {
    sql.getUser(req.query.discord, req.query.server, callback)
  }
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
  sql.graph(req.query.id, req.query.period, req.query.count, function(stats) {
    res.render("graph", {id: req.query.overwatch_id, stats: stats.reverse(), keys: (req.query.keys || 'rank').split(",")});
  })
})

var heroes = ["winston","junkrat","symmetra","widowmaker","torbjorn","genji","mccree","doomfist","ana","reinhardt","sombra","mei","tracer","hanzo","orisa","bastion","reaper","zarya","lucio","zenyatta","mercy","pharah","roadhog","dva","soldier76", "moira", "wrecking_ball"];

server.get("/rankings", function(req, res) {
  sql.getRankings(req.query.server, function(players) {
	console.log(players)
    var process  = []
    var min = req.query.min || 0;
    var max = req.query.max || 5001;
    for (var i = 0; i < players.length; i++) {
      var player = players[i]

      if(player.rank >= min && player.rank < max ) {
        player.ranking = ranks.getRank(player.rank)
        player.stats = JSON.parse(player.stats)

        player.playtime = [];

        for (var j = 0; j < heroes.length; j++) {
         var hero = {
           hero: heroes[j],
           playtime: player[heroes[j]],
           icon: library.hero_static[heroes[j]].icon
         }
         player.playtime.push(hero)
        }

        player.playtime.sort(function(a, b) {
          return b.playtime - a.playtime;
        })
        process.push(player);
      }
    }

    len = 10;
    if(process.length > 30) {
      len = Math.ceil(process.length / 4);
    }
    console.log(process.length, len)

    res.render("rankings", {players : process, len: len, min: req.query.min, max: req.query.max, header: req.query.header});
  })
})

server.get("/get-users/:server", function(req, res) {
  sql.getUsersByServer(req.params.server, function(users) {
    for (var i = 0; i < users.length; i++) {
      users[i].ranking = ranks.getRank(users[i].rank);
    }
    res.send(users);
  })
})

server.use(express.static('public'))

server.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
