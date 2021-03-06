define({ "api": [
  {
    "type": "get",
    "url": "/leaderboard/:platform/:gamemode/:type",
    "title": "Get leaderboard",
    "name": "GetLeaderboard",
    "group": "Stats",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>Define the player platform (pc, ps4, xb1 or all).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gamemode",
            "description": "<p>Define the gamemode to fetch (solo, duo, squad or all).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Type of data you want to compare on.</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>Requested platform for leaderboard.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Requested type for leaderboard.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "leaderboard",
            "description": "<p>Contains leaderboard of specified platform and gamemode, order by type.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "leaderboard.player",
            "description": "<p>Player datas.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player.info",
            "description": "<p>Player account informations.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "info.accountId",
            "description": "<p>Id of the player's account.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "info.username",
            "description": "<p>Username of the player.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "info.platform",
            "description": "<p>Platform of the player stats.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "player.lifetimeStats",
            "description": "<p>Statistics of the player.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "lifetimeStats.type",
            "description": "<p>Data for the specified type.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"platform\":\"all\",\n     \"type\":\"kills\",\n     \"leaderboard\":[{\n         \"info\":{\n             \"accountId\":\"a867dafb596142dd9d644e97518fb596\",\n             \"username\":\"Twitch Dominuss\",\n             \"platform\":\"pc\"}\n         ,\"lifetimeStats\":{\n             \"kills\":12713\n         }\n      }]\n }",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Wrong parameters for the request</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n     'error': {\n         'code': 3,\n         'message': 'Bad Request',\n         'description': 'Invalid parameters. The platform or gamemode or type provided as parameters were not valid for the request.'\n     }\n}\nHTTP/1.1 500 Internal Server Error\n{\n     'error': {\n         'code': 131,\n         'message': 'Internal Server Error',\n         'description': 'An unknow internal error occurred.'\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/playerstats.route.js",
    "groupTitle": "Stats"
  },
  {
    "type": "get",
    "url": "/stats/:platform/:username/:gamemode?",
    "title": "Get players stats",
    "name": "GetPlayerStats",
    "group": "Stats",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platform",
            "description": "<p>Define the player platform (pc, ps4 or xb1).</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Player username.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "gamemode",
            "description": "<p>Define the gamemode to fetch (solo, duo, squad).</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "global",
            "description": "<p>Regroup solo, duo and squad stats.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "global.solo",
            "description": "<p>Contains solo stats of a player.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.wins",
            "description": "<p>Wins amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.top3",
            "description": "<p>Top3 amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.top5",
            "description": "<p>Top5 amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.top6",
            "description": "<p>Top6 amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.top10",
            "description": "<p>Top10 amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.top12",
            "description": "<p>Top12 amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.top25",
            "description": "<p>Top25 amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.kdRate",
            "description": "<p>Kill/death ratio in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.winPercentage",
            "description": "<p>Win percentage in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.matches",
            "description": "<p>Matches amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.kills",
            "description": "<p>Kills amount in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "solo.timePlayed",
            "description": "<p>Time played in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.killsPerMatch",
            "description": "<p>Kills per match in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.killsPerMin",
            "description": "<p>Kills per min in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "solo.score",
            "description": "<p>Total score in solo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "global.duo",
            "description": "<p>Contains duo stats of a player.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.wins",
            "description": "<p>Wins amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.top3",
            "description": "<p>Top3 amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.top5",
            "description": "<p>Top5 amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.top6",
            "description": "<p>Top6 amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.top10",
            "description": "<p>Top10 amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.top12",
            "description": "<p>Top12 amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.top25",
            "description": "<p>Top25 amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.kdRate",
            "description": "<p>Kill/death ratio in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.winPercentage",
            "description": "<p>Win percentage in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.matches",
            "description": "<p>Matches amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.kills",
            "description": "<p>Kills amount in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "duo.timePlayed",
            "description": "<p>Time played in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.killsPerMatch",
            "description": "<p>Kills per match in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.killsPerMin",
            "description": "<p>Kills per min in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "duo.score",
            "description": "<p>Total score in duo mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "global.squad",
            "description": "<p>Contains squad stats of a player.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.wins",
            "description": "<p>Wins amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.top3",
            "description": "<p>Top3 amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.top5",
            "description": "<p>Top5 amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.top6",
            "description": "<p>Top6 amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.top10",
            "description": "<p>Top10 amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.top12",
            "description": "<p>Top12 amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.top25",
            "description": "<p>Top25 amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.kdRate",
            "description": "<p>Kill/death ratio in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.winPercentage",
            "description": "<p>Win percentage in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.matches",
            "description": "<p>Matches amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.kills",
            "description": "<p>Kills amount in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "squad.timePlayed",
            "description": "<p>Time played in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.killsPerMatch",
            "description": "<p>Kills per match in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.killsPerMin",
            "description": "<p>Kills per min in squad mode.</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "squad.score",
            "description": "<p>Total score in squad mode.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"global\": {\n         \"solo\":{\n             \"wins\":2,\n             \"top3\":0,\n             \"top5\":0,\n             \"top6\":0,\n             \"top10\":11,\n             \"top12\":0,\n             \"top25\":24,\n             \"kdRate\":1.1,\n             \"winPercentage\":2.38,\n             \"matches\":84,\n             \"kills\":90,\n             \"timePlayed\":\"1h\",\n             \"killsPerMatch\":1.07,\n             \"killsPerMin\":1.60,\n             \"score\":12028},\n         \"duo\":{\n             \"wins\":14,\n             \"top3\":0,\n             \"top5\":52,\n             \"top6\":0,\n             \"top10\":0,\n             \"top12\":84,\n             \"top25\":0,\n             \"kdRate\":1.52,\n             \"winPercentage\":5.2,\n             \"matches\":269,\n             \"kills\":387,\n             \"timePlayed\":\"3h 7m\",\n             \"killsPerMatch\":1.44,\n             \"killsPerMin\":1.80,\n             \"score\":56190},\n         \"squad\":{\n             \"wins\":20,\n             \"top3\":50,\n             \"top5\":0,\n             \"top6\":77,\n             \"top10\":0,\n             \"top12\":0,\n             \"top25\":0,\n             \"kdRate\":1.96,\n             \"winPercentage\":9.01,\n             \"matches\":222,\n             \"kills\":395,\n             \"timePlayed\":\"4h 5m\",\n             \"killsPerMatch\":1.78,\n             \"killsPerMin\":1.50,\n             \"score\":59508\n         }\n     },\"info\":{\n         \"accountId\":\"b045673f20c741d399fe1ff39fd6894c\",\n         \"username\":\"N_Blust987\",\n         \"platform\":\"pc\"\n     },\"lifetimeStats\":{\n         \"wins\":36,\n         \"kdRate\":1.62,\n         \"winPercentage\":6.26,\n         \"matches\":575,\n         \"kills\":872,\n         \"killsPerMin\":1.77,\n         \"timePlayed\":\"8h 12m\",\n         \"score\":127726,\n         \"killsPerMatch\":1.52\n     }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "PlayerNotFound",
            "description": "<p>Unable to find a player for the specified username.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n     'error': {\n         'code': 3,\n         'message': 'Bad Request',\n         'description': 'Invalid parameters. The platform or gamemode or type provided as parameters were not valid for the request.'\n     }\n}\nHTTP/1.1 500 Internal Server Error\n{\n     'error': {\n         'code': 131,\n         'message': 'Internal Server Error',\n         'description': 'An unknow internal error occurred.'\n     }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/playerstats.route.js",
    "groupTitle": "Stats"
  }
] });
