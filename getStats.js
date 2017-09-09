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

sql.connect();

function updateAll() {
  sql.query("SELECT * FROM users", function(err, ress, feilds) {
    console.log("Updating stats for " + ress.length + " users")
    for (var ii = 0; ii < ress.length; ii++) {
      setTimeout(function(res, i) {
      var useri         = res[i]
      var overwatch_id = res[i].overwatch_id;
      var region       = res[i].region;
      var platform     = res[i].platform;

      if(!region) {
        region = regions[0]
      }


      getStats(useri, overwatch_id, platforms[0], function(user, id, result) {
        if(!result) {
          getStats(user, id, platforms[1], function(user, id, result) {
            if(!result) {
              getStats(user, id, platforms[2], function(user, id, result) {
                if(result) {
                  processResults(user, result);
                } else {
                  console.log("Not results for ", id)
                }
              });
            } else {
              processResults(user, result)
            }
          });
        } else {
          processResults(user, result)
        }
      });
    }, 3000 * ii, ress, ii);
    }
  });

}

var statscount = 0;
var statsTotal = 0;
function getStats(user, id, platform,  call) {
  statsTotal ++;
  console.log("GetStatsTotal", statsTotal)
  var url = 'http://' + settings.owapi.host + '/api/v3/u/' + id + '/blob?platform=' + platform;
    request(url, function(err, res, body) {
      statscount++;

      var result;
      console.log("getStats ", id, statscount)
      if(body) {
        try{
          result = JSON.parse(body);
        } catch (e) {

        }
      }
      call(user, id, result);
    });
}

var processCount = 0;
var failedCount = 0;
function processResults(user, result) {
  processCount++;
  console.log("processStats ", user.overwatch_id, processCount)

  var stats;
  if(user.region) {
    stats = result[user.region];
  }
  var i = 0;
  while (!stats && i < regions.length) {
    stats = result[regions[i++]];
  }
  if(!stats || ! stats.stats) {
    failedCount++;
    console.log("No stats for ", user.overwatch_id, failedCount)
    return
  }


  var time = Date.now();
  var date = new Date();
  var year = date.getFullYear();
  var day = date.getDate();
  var month = date.getMonth();
  var hour =  date.getHours();
  var stats_blob = {
    userid: user.id,
    overwatch_id: user.overwatch_id,
    timestamp: time ,
    season: season,
    stats: JSON.stringify(stats)
  }
  var raw = stats;
  stats = stats.stats;


  var query = sql.query("INSERT INTO " + settings.stats.stats_blob + " SET ?", stats_blob, function (err, res, feilds) {
    if(err) {
      throw err
    }
    var using = stats.competitive;
    var blob_id = res.insertId;

    if(!using) {
      return
    }

    for (var key in raw.heroes.playtime.quickplay) {
      var qp = {
        blob_id: blob_id,
        overwatch_id: user.overwatch_id,
        mode: "quickplay",
        hero: key,
        time: raw.heroes.playtime.quickplay[key],
        win: raw.heroes.stats.quickplay[key].general_stats.win_percentage
      }
      var comp = {
        blob_id: blob_id,
        overwatch_id: user.overwatch_id,
        mode: "competitive",
        hero: key,
        time: raw.heroes.playtime.competitive[key],
        win: raw.heroes.stats.competitive[key].general_stats.win_percentage
      }

      sql.query("INSERT INTO playtime set ?", qp, function(err, res, f) {
        if(err)
          throw err
      })
      sql.query("INSERT INTO playtime set ?", comp, function(err, res, f) {
        if(err)
          throw err
      })
    }


    var stats_ = {
      blob_id: blob_id,
      userid: user.id,
      overwatch_id: user.overwatch_id,
      timestamp: time,
      year: year,
      month: month,
      day: day,
      hour: hour,
      season: season,
      level: using.overall_stats.level || 0,
      prestige: using.overall_stats.prestige || 0,
      rank: using.overall_stats.comprank || 0,
      tier: using.overall_stats.tier || 0,
      games: using.overall_stats.games || 0,
      wins: using.overall_stats.wins || 0,
      loss: using.overall_stats.losses || 0,
      draws: using.overall_stats.ties || 0,
      winrate: using.overall_stats.win_rate || 0,
      eliminations: using.game_stats.eliminations || 0,
      eliminations_avg: using.average_stats.eliminations_avg || 0,
      eliminations_most: using.game_stats.eliminations_most_in_game || 0,
      deaths: using.game_stats.deaths || 0,
      deaths_avg: using.average_stats.deaths_avg || 0,
      healing: using.game_stats.healing_done || 0,
      healing_avg: using.average_stats.healing_done_avg || 0,
      healing_most: using.game_stats.healing_done_most_in_game || 0,
      time_played: using.game_stats.time_played || 0,
      multikill_best: using.game_stats.multikill_best || 0,
      multikills: using.game_stats.multikills || 0,
      final_blows: using.game_stats.final_blows || 0,
      final_blows_avg: using.average_stats.final_blows_avg || 0,
      final_blows_most: using.game_stats.final_blows_most_in_game || 0,
      medals: using.game_stats.medals || 0,
      medals_gold: using.game_stats.medals_gold || 0,
      medals_silver: using.game_stats.medals_silver || 0,
      medals_bronze: using.game_stats.medals_bronze || 0,
      cards: using.game_stats.cards || 0,
      damage: using.game_stats.damage_done || 0,
      damage_avg: using.average_stats.damage_done_avg || 0,
      damage_most: using.game_stats.damage_done_most_in_game || 0,
      damage_blocked: using.game_stats.damage_blocked || 0,
      solo_kills: using.game_stats.solo_kills || 0,
      solo_kills_avg: using.average_stats.solo_kills_avg || 0,
      solo_kills_most: using.game_stats.solo_kills_most_in_game || 0,
      objective_kills: using.game_stats.objective_kills || 0,
      objective_kills_avg: using.average_stats.objective_kills_avg || 0,
      objective_kills_most: using.game_stats.objective_kills_most_in_game || 0,
      objective_time: using.game_stats.objective_time || 0,
      objective_time_avg: using.average_stats.objective_time_avg || 0,
      objective_time_most: using.game_stats.objective_time_most_in_game || 0
    }

  var query2 = sql.query("INSERT INTO " + settings.stats.stats_table + " SET ?", stats_, function (err, res, feilds) {
    if(err){
      console.log(err)
    }else {
      total++;
        console.log("Saved ", stats_.overwatch_id + ", " + total);
        console.log("");
    }

  });

  });
}


updateAll();
