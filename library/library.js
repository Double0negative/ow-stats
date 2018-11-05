var season = 10;

var settings   = require("../settings.json");
var request    = require("request");
var ranks      = require("./ranks.js");
const platforms = ["pc", "xbl", "psn"];
var hero_static = {
  "winston": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000009.png",
    color: "rgb(76, 80, 92)"
  },
  "junkrat": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000065.png",
    color: "rgb(211, 147, 8)"
  },
  "symmetra": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000016.png",
    color: "rgb(92, 236, 255)"
  },
  "widowmaker": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000000A.png",
    color: "rgb(111, 111, 174)"
  },
  "torbjorn": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000006.png",
    color: "rgb(255, 98, 0)"
  },
  "genji":  {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000029.png",
    color: "rgb(132, 254, 1)"
  },
  "mccree": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000042.png",
    color: "rgb(141, 57, 57)"
  },
  "doomfist": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000012F.png",
    color: "rgb(224, 78, 52)"
  },
  "ana": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000013B.png",
    color: "rgb(204, 194, 174)"
  },
  "reinhardt": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000007.png",
    color: "rgb(170, 149, 142)"
  },
  "sombra": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000012E.png",
    color: "rgb(117, 27, 156)"
  },
  "mei": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E00000000000DD.png",
    color: "rgb(154, 219, 244)"
  },
  "tracer": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000003.png",
    color: "rgb(248, 145, 27)"
  },
  "hanzo": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000005.png",
    color: "rgb(147, 136, 72)"
  },
  "orisa": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000013E.png",
    color: "rgb(220, 154, 0)"
  },
  "bastion": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000015.png",
    color: "rgb(110, 153, 77)"
  },
  "reaper": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000002.png",
    color: "rgb(39, 39, 37)"
  },
  "zarya": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000068.png",
    color: "rgb(245, 113, 168)"
  },
  "lucio": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000079.png",
    color: "rgb(139, 236, 34)"
  },
  "zenyatta": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000020.png",
    color: "rgb(199, 156, 0)"
  },
  "mercy": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000004.png",
    color: "rgb(255, 225, 108)"
  },
  "pharah": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000008.png",
    color: "rgb(27, 101, 198)"
  },
  "roadhog": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000040.png",
    color: "rgb(193, 148, 119)"
  },
  "dva":{
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000007A.png",
    color: "rgb(255, 127, 209)"
  },
  "soldier76": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E000000000006E.png",
    color: "rgb(88, 112, 182)"
  },
  "moira": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E00000000001A2.png",
    color: "rgb(105, 28, 207)"
  },
  "brigitte": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E0000000000195.png",
    color: "rgb(115, 52, 43)"
  },
  "wrecking_ball": {
    icon: "https://d1u1mce87gyfbn.cloudfront.net/game/heroes/small/0x02E00000000001CA.png",
    color: "rgb(255, 142, 71)"
  }
}

module.exports.hero_static = hero_static;


module.exports.getStatsPlatform = function(id, platform,  call) {
  var url = 'http://' + settings.owapi.host + '/api/v3/u/' + encodeURIComponent(id) + '/blob?platform=' + platform;
  console.log("url", url)
    request(url, function(err, res, body) {
      var result = {};
      if(body) {
        try{
          console.log("Body", body)
          result = JSON.parse(body);
        } catch (e) {
          console.log("err", e)
        }
      }
      //result.error = err;
      call(id, result);
    });
}

module.exports.getStats = function(id, call) {
  console.log("GetSTats")
  var getStats = function(id, plat, callback) {
    console.log("GetSTats", id, plat)
    module.exports.getStatsPlatform(id, plat, function(id, result) {
      if(result.error) {
        console.log("err", result)
        return callback()
      }
      callback(result);
    });
  }

  var plat = 0;
  var callback = function(stats) {
    //console.log("callback", stats)
    plat++;

    if(stats){
      //console.log("Calling ", stats)
      call(stats)
    } else {
      if(plat > platforms.length) {
        call();
        return;
      }
      getStats(id, platforms[plat], callback)
    }
  }
  getStats(id, platforms[plat], callback);
}


module.exports.rawToStats = function(using) {
  var stats = using;
  console.log("stats-------", stats)
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
    damage: using.game_stats.hero_damage_done || 0,
    damage_avg: using.average_stats.hero_damage_done_avg || 0,
    damage_most: using.game_stats.hero_damage_done_most_in_game || 0,
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
    console.log(key)
    var obj = {
      hero: key,
      playtime: pt[key],
    }
    if(stats.heroes.stats.competitive[key]) {
      obj.win = stats.heroes.stats.competitive[key].general_stats.win_percentage
    } else {
      obj.win = 0;
    }
    playtime.push(obj);



    max = Math.max( max , pt[key]);
  }

  playtime.sort(function(a, b) {
    return b.playtime - a.playtime
  })


  for(var i = 0; i < playtime.length; i++) {
    var obj = playtime[i];

    obj.percent = obj.playtime / max;

    console.log(playtime[i])
  }


  stats_.ranking = ranks.getRank(stats_.rank);
  stats_.hero_static = hero_static;

  return {user: stats_, playtime: playtime};
}

/*
module.exports.getStats("Double0-11909", "pc", function(id, result) {
  console.log(module.exports.rawToStats(result.us.stats.competitive));


})*/
