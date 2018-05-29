module.exports = (app) => {

    const playerStatsController = require('../controllers/playerstats.controller.js');

    /**
     * @api {get} /stats/:platform/:username/:gamemode? Get players stats
     * @apiName GetPlayerStats
     * @apiGroup Stats
     *
     * @apiParam {String} platform Define the player platform (pc, ps4 or xb1).
     * @apiParam {String} username Player username.
     * @apiParam {String} gamemode Define the gamemode to fetch (solo, duo, squad).
     *
     * @apiSuccess {Object} global Regroup solo, duo and squad stats.
     *
     * @apiSuccess {Object} global.solo Contains solo stats of a player.
     * @apiSuccess {Number} solo.wins Wins amount in solo mode.
     * @apiSuccess {Number} solo.top3 Top3 amount in solo mode.
     * @apiSuccess {Number} solo.top5 Top5 amount in solo mode.
     * @apiSuccess {Number} solo.top6 Top6 amount in solo mode.
     * @apiSuccess {Number} solo.top10 Top10 amount in solo mode.
     * @apiSuccess {Number} solo.top12 Top12 amount in solo mode.
     * @apiSuccess {Number} solo.top25 Top25 amount in solo mode.
     * @apiSuccess {Number} solo.kdRate Kill/death ratio in solo mode.
     * @apiSuccess {Number} solo.winPercentage Win percentage in solo mode.
     * @apiSuccess {Number} solo.matches Matches amount in solo mode.
     * @apiSuccess {Number} solo.kills Kills amount in solo mode.
     * @apiSuccess {String} solo.timePlayed Time played in solo mode.
     * @apiSuccess {Number} solo.killsPerMatch Kills per match in solo mode.
     * @apiSuccess {Number} solo.killsPerMin Kills per min in solo mode.
     * @apiSuccess {Number} solo.score Total score in solo mode.
     *
     * @apiSuccess {Object} global.duo Contains duo stats of a player.
     * @apiSuccess {Number} duo.wins Wins amount in duo mode.
     * @apiSuccess {Number} duo.top3 Top3 amount in duo mode.
     * @apiSuccess {Number} duo.top5 Top5 amount in duo mode.
     * @apiSuccess {Number} duo.top6 Top6 amount in duo mode.
     * @apiSuccess {Number} duo.top10 Top10 amount in duo mode.
     * @apiSuccess {Number} duo.top12 Top12 amount in duo mode.
     * @apiSuccess {Number} duo.top25 Top25 amount in duo mode.
     * @apiSuccess {Number} duo.kdRate Kill/death ratio in duo mode.
     * @apiSuccess {Number} duo.winPercentage Win percentage in duo mode.
     * @apiSuccess {Number} duo.matches Matches amount in duo mode.
     * @apiSuccess {Number} duo.kills Kills amount in duo mode.
     * @apiSuccess {String} duo.timePlayed Time played in duo mode.
     * @apiSuccess {Number} duo.killsPerMatch Kills per match in duo mode.
     * @apiSuccess {Number} duo.killsPerMin Kills per min in duo mode.
     * @apiSuccess {Number} duo.score Total score in duo mode.
     *
     * @apiSuccess {Object} global.squad Contains squad stats of a player.
     * @apiSuccess {Number} squad.wins Wins amount in squad mode.
     * @apiSuccess {Number} squad.top3 Top3 amount in squad mode.
     * @apiSuccess {Number} squad.top5 Top5 amount in squad mode.
     * @apiSuccess {Number} squad.top6 Top6 amount in squad mode.
     * @apiSuccess {Number} squad.top10 Top10 amount in squad mode.
     * @apiSuccess {Number} squad.top12 Top12 amount in squad mode.
     * @apiSuccess {Number} squad.top25 Top25 amount in squad mode.
     * @apiSuccess {Number} squad.kdRate Kill/death ratio in squad mode.
     * @apiSuccess {Number} squad.winPercentage Win percentage in squad mode.
     * @apiSuccess {Number} squad.matches Matches amount in squad mode.
     * @apiSuccess {Number} squad.kills Kills amount in squad mode.
     * @apiSuccess {String} squad.timePlayed Time played in squad mode.
     * @apiSuccess {Number} squad.killsPerMatch Kills per match in squad mode.
     * @apiSuccess {Number} squad.killsPerMin Kills per min in squad mode.
     * @apiSuccess {Number} squad.score Total score in squad mode.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "global": {
     *              "solo":{
     *                  "wins":2,
     *                  "top3":0,
     *                  "top5":0,
     *                  "top6":0,
     *                  "top10":11,
     *                  "top12":0,
     *                  "top25":24,
     *                  "kdRate":1.1,
     *                  "winPercentage":2.38,
     *                  "matches":84,
     *                  "kills":90,
     *                  "timePlayed":"1h",
     *                  "killsPerMatch":1.07,
     *                  "killsPerMin":1.60,
     *                  "score":12028},
     *              "duo":{
     *                  "wins":14,
     *                  "top3":0,
     *                  "top5":52,
     *                  "top6":0,
     *                  "top10":0,
     *                  "top12":84,
     *                  "top25":0,
     *                  "kdRate":1.52,
     *                  "winPercentage":5.2,
     *                  "matches":269,
     *                  "kills":387,
     *                  "timePlayed":"3h 7m",
     *                  "killsPerMatch":1.44,
     *                  "killsPerMin":1.80,
     *                  "score":56190},
     *              "squad":{
     *                  "wins":20,
     *                  "top3":50,
     *                  "top5":0,
     *                  "top6":77,
     *                  "top10":0,
     *                  "top12":0,
     *                  "top25":0,
     *                  "kdRate":1.96,
     *                  "winPercentage":9.01,
     *                  "matches":222,
     *                  "kills":395,
     *                  "timePlayed":"4h 5m",
     *                  "killsPerMatch":1.78,
     *                  "killsPerMin":1.50,
     *                  "score":59508
     *              }
     *          },"info":{
     *              "accountId":"b045673f20c741d399fe1ff39fd6894c",
     *              "username":"N_Blust987",
     *              "platform":"pc"
     *          },"lifetimeStats":{
     *              "wins":36,
     *              "kdRate":1.62,
     *              "winPercentage":6.26,
     *              "matches":575,
     *              "kills":872,
     *              "killsPerMin":1.77,
     *              "timePlayed":"8h 12m",
     *              "score":127726,
     *              "killsPerMatch":1.52
     *          }
     *     }
     *
     * @apiError PlayerNotFound Unable to find a player for the specified username.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *          'error': {
     *              'code': 3,
     *              'message': 'Bad Request',
     *              'description': 'Invalid parameters. The platform or gamemode or type provided as parameters were not valid for the request.'
     *          }
     *     }
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *          'error': {
     *              'code': 131,
     *              'message': 'Internal Server Error',
     *              'description': 'An unknow internal error occurred.'
     *          }
     *     }
     */
    app.get('/stats/:platform/:username/:gamemode?', playerStatsController.getPlayerStats);

    /**
     * @api {get} /leaderboard/:platform/:gamemode/:type Get leaderboard
     * @apiName GetLeaderboard
     * @apiGroup Stats
     *
     * @apiParam {String} platform Define the player platform (pc, ps4, xb1 or all).
     * @apiParam {String} gamemode Define the gamemode to fetch (solo, duo, squad or all).
     * @apiParam {String} type Type of data you want to compare on.
     *
     * @apiSuccess {String} platform Requested platform for leaderboard.
     * @apiSuccess {String} type Requested type for leaderboard.
     *
     * @apiSuccess {Object} leaderboard Contains leaderboard of specified platform and gamemode, order by type.
     * @apiSuccess {Object} leaderboard.player Player datas.
     * @apiSuccess {Object} player.info Player account informations.
     * @apiSuccess {String} info.accountId Id of the player's account.
     * @apiSuccess {String} info.username Username of the player.
     * @apiSuccess {String} info.platform Platform of the player stats.
     * @apiSuccess {Object} player.lifetimeStats Statistics of the player.
     * @apiSuccess {Number} lifetimeStats.type Data for the specified type.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *          "platform":"all",
     *          "type":"kills",
     *          "leaderboard":[{
     *              "info":{
     *                  "accountId":"a867dafb596142dd9d644e97518fb596",
     *                  "username":"Twitch Dominuss",
     *                  "platform":"pc"}
     *              ,"lifetimeStats":{
     *                  "kills":12713
     *              }
     *           }]
     *      }
     *
     * @apiError BadRequest Wrong parameters for the request
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *          'error': {
     *              'code': 3,
     *              'message': 'Bad Request',
     *              'description': 'Invalid parameters. The platform or gamemode or type provided as parameters were not valid for the request.'
     *          }
     *     }
     *     HTTP/1.1 500 Internal Server Error
     *     {
     *          'error': {
     *              'code': 131,
     *              'message': 'Internal Server Error',
     *              'description': 'An unknow internal error occurred.'
     *          }
     *     }
     */
    app.get('/leaderboard/:platform/:gamemode/:type', playerStatsController.getLeaderBoard);

}
