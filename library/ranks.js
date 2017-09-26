var ranks =  [
			{
				"name": "Bronze",
				"role": "Bronze",
				"rank": -2,
				"color": "#7A5501",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-1.png"
			},{
				"name": "Silver",
				"role": "Silver",
				"rank": 1500,
				"color": "#B5CAC9",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-2.png"
			},{
				"name": "Gold",
				"role": "Gold",
				"rank": 2000,
				"color": "#FFB300",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-3.png"
			},{
				"name": "Platinum",
				"role": "Platinum",
				"rank": 2500,
				"color": "#C2EEFC",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-4.png"
			},{
				"name": "Diamond",
				"role": "Diamond",
				"rank": 3000,
				"color": "#116696",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-5.png"
			},{
				"name": "Master",
				"role": "Master",
				"rank": 3500,
				"color": "#267C10",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-6.png"
			},{
				"name": "Grand Master",
				"role": "Grandmaster",
				"rank": 4000,
				"color": "#62B14E",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-7.png"
			},{
				"name": "Top 500",
				"role": "Top 500",
				"rank": 4362,
				"color": "#366183",
				"img": "https://blzgdapipro-a.akamaihd.net/game/rank-icons/season-2/rank-7.png"
			}
		]

module.exports.getRank = function(r) {
  for (var i = 0; i < ranks.length; i++) {
    var rank = ranks[i];
    if(rank.rank  > r ) {
      return ranks[i - 1];
    }
  }
	return ranks[ranks.length - 1]
}
