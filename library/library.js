var season = 5;

var settings   = require("../settings.json");
var request    = require("request");
var ranks      = require("./ranks.js");

module.exports.getStats = function(id, platform,  call) {
  var url = 'http://' + settings.owapi.host + '/api/v3/u/' + id + '/blob?platform=' + platform;
  console.log("url", url)
    request(url, function(err, res, body) {
      var result;
      if(body) {
        try{
          result = JSON.parse(body);
        } catch (e) {

        }
      }
      call(id, result);
    });
}



module.exports.rawToStats = function(using) {
  var stats = using;
//  console.log(stats)
  using = stats.stats.competitive;
  var stats_ = {
    stats: stats.stats,
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

  stats_.reallevel = stats_.prestige * 100 + stats_.level;

  var playtime = [];
  var pt = stats.heroes.playtime.competitive;
  var max = 0;
  for(var key in pt) {
    playtime.push({
      hero: key,
      playtime: pt[key],
    });
    max = Math.max( max , pt[key]);
  }

  playtime.sort(function(a, b) {
    return b.playtime - a.playtime
  })


  for(var i = 0; i < playtime.length; i++) {
    var obj = playtime[i];

    obj.percent = obj.playtime / max;
    obj.width = 400 * obj.percent;

    console.log(playtime[i])
  }


  stats_.rank_obj = ranks.getRank(stats_.rank);
  console.log(stats_.rank_obj)

  return {user: stats_, playtime: playtime};
}

/*
module.exports.getStats("Double0-11909", "pc", function(id, result) {
  console.log(module.exports.rawToStats(result.us.stats.competitive));


})*/
