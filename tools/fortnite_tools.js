function timeConvert(playedTime) {
    let result = "",
        d = parseInt(playedTime / 24 / 60),
        h = parseInt((playedTime / 60) % 24),
        m = parseInt(playedTime % 60);
    if (d > 0) result += d + "d "; //nb days
    if (h > 0) result += h + "h "; //nb hours
    if (m > 0)
        result += m + "m"; //nb minutes
    else result = result + "0m ";

    return result.trim();
}

function ratio(a, b) {
    if (parseInt(b) === 0) return 0;
    else return (parseInt(a) / parseInt(b)).toFixed(2);
}
function rate(a, b) {
    if (parseInt(b) === 0) return 0;
    else return (parseInt(a) / parseInt(b) * 100).toFixed(2);
}

module.exports = {

    // Check if platform is valid
    checkPlatform: (platform) => {
        if(!(platform == 'pc' || platform == 'ps4' || platform == 'xb1'))
            return false;
        else
            return true;
    },

    // Check if gamemode is valid
    checkGameMode: (gamemode) => {
        if(!(gamemode == 'solo' || gamemode == 'duo' || gamemode == 'squad'))
            return false;
        else
            return true;
    },

    // Check if a user has stats on the specified platform
    checkStatsPlatform: (stats, platform) => {

        let result = false;

        stats.every(function(elem) {
            if (elem.name.indexOf("_" + platform + "_") != -1) {
                result = true;
                return false;
            } else {
                return true;
            }
        });

        return result;

    },

    // Convert received datas into our schema model
    // TODO: Fix time played for games modes
    convert(stats, user, platform) {

        return new Promise(resolve => {

            let result = {
                global: {
                    solo: {
                        wins: 0,
                        top3: 0,
                        top5: 0,
                        top6: 0,
                        top10: 0,
                        top12: 0,
                        top25: 0,
                        kdRate: 0,
                        winPercentage: 0,
                        matches: 0,
                        kills: 0,
                        timePlayed: 0,
                        killsPerMatch: 0,
                        killsPerMin: 0,
                        score: 0
                    },
                    duo: {
                        wins: 0,
                        top3: 0,
                        top5: 0,
                        top6: 0,
                        top10: 0,
                        top12: 0,
                        top25: 0,
                        kdRate: 0,
                        winPercentage: 0,
                        matches: 0,
                        kills: 0,
                        timePlayed: 0,
                        killsPerMatch: 0,
                        killsPerMin: 0,
                        score: 0
                    },
                    squad: {
                        wins: 0,
                        top3: 0,
                        top5: 0,
                        top6: 0,
                        top10: 0,
                        top12: 0,
                        top25: 0,
                        kdRate: 0,
                        winPercentage: 0,
                        matches: 0,
                        kills: 0,
                        timePlayed: 0,
                        killsPerMatch: 0,
                        killsPerMin: 0,
                        score: 0
                    }
                },
                info: {
                    accountId: user.id,
                    username: user.displayName,
                    platform: platform
                },
                lifetimeStats: {
                    wins: 0,
                    top3s: 0,
                    top5s: 0,
                    top6s: 0,
                    top10s: 0,
                    top12s: 0,
                    top25s: 0,
                    kdRate: 0,
                    winPercentage: 0,
                    matches: 0,
                    kills: 0,
                    killsPerMin: 0,
                    timePlayed: 0,
                    score: 0
                }
            };

            // Total time played
            let totalTime = 0;

            // Getting and transforming data
            stats.forEach(elem => {

                // Element name is used to matched part of the name
                // To define which result we're fetching
                let key = elem.name;
                // Vars to store result
                let type = "";
                let mode = "";

                // Game result definition
                // Wins
                if (key.indexOf("placetop1_" + platform) !== -1) type = "wins";
                // Top 3
                else if (key.indexOf("placetop3_" + platform) !== -1)
                    type = "top3";
                // Top 5
                else if (key.indexOf("placetop5_" + platform) !== -1)
                    type = "top5";
                // Top 6
                else if (key.indexOf("placetop6_" + platform) !== -1)
                    type = "top6";
                // Top 10
                else if (key.indexOf("placetop10_" + platform) !== -1)
                    type = "top10";
                // Top 12
                else if (key.indexOf("placetop12_" + platform) !== -1)
                    type = "top12";
                // Top 25
                else if (key.indexOf("placetop25_" + platform) !== -1)
                    type = "top25";
                // Matches played
                else if (key.indexOf("matchesplayed_" + platform) !== -1)
                    type = "matches";
                // Amount of kills
                else if (key.indexOf("kills_" + platform) !== -1)
                    type = "kills";
                // Score
                else if (key.indexOf("score_" + platform) !== -1)
                    type = "score";
                // Time played
                else if (key.indexOf("minutesplayed_" + platform) !== -1) {
                    totalTime = totalTime + elem.value;
                    type = "timePlayed";
                }

                // Gamemode definition
                if (key.indexOf("_p2") !== -1)
                    mode = "solo";
                else if (key.indexOf("_p10") !== -1)
                    mode = "duo";
                else
                    mode = "squad";

                // If there is type matched
                // Storing type value into it's correct mode and type result
                if (type)
                    result.global[mode][type] = elem.value;

                /*
                 * Kill/death ratio calculation
                 */
                result.global.solo["kdRate"] = ratio(
                    result.global.solo["kills"],
                    result.global.solo["matches"] - result.global.solo["wins"]
                );
                result.global.duo["kdRate"] = ratio(
                    result.global.duo["kills"],
                    result.global.duo["matches"] - result.global.duo["wins"]
                );
                result.global.squad["kdRate"] = ratio(
                    result.global.squad["kills"],
                    result.global.squad["matches"] - result.global.squad["wins"]
                );

                /*
                 * Win rate calculation
                 */
                result.global.solo["winPercentage"] = rate(
                    result.global.solo["wins"],
                    result.global.solo["matches"]
                );
                result.global.duo["winPercentage"] = rate(
                    result.global.duo["wins"],
                    result.global.duo["matches"]
                );
                result.global.squad["winPercentage"] = rate(
                    result.global.squad["wins"],
                    result.global.squad["matches"]
                );

                /*
                 * Kills per minutes calculation
                 */
                result.global.solo["killsPerMin"] = ratio(
                    result.global.solo["kills"],
                    result.global.solo["timePlayed"]
                );
                result.global.duo["killsPerMin"] = ratio(
                    result.global.duo["kills"],
                    result.global.duo["timePlayed"]
                );
                result.global.squad["killsPerMin"] = ratio(
                    result.global.squad["kills"],
                    result.global.squad["timePlayed"]
                );

                /*
                 * Time played calculation
                 */
                result.global.solo["timePlayed"] = timeConvert(
                    result.global.solo["timePlayed"]
                );
                result.global.duo["timePlayed"] = timeConvert(
                    result.global.duo["timePlayed"]
                );
                result.global.squad["timePlayed"] = timeConvert(
                    result.global.squad["timePlayed"]
                );

                /*
                 * Kills per match calculation
                 */
                result.global.solo["killsPerMatch"] = ratio(
                    result.global.solo["kills"],
                    result.global.solo["matches"]
                );
                result.global.duo["killsPerMatch"] = ratio(
                    result.global.duo["kills"],
                    result.global.duo["matches"]
                );
                result.global.squad["killsPerMatch"] = ratio(
                    result.global.squad["kills"],
                    result.global.squad["matches"]
                );

                /*
                 * Life time stats calculation
                 */
                result.lifetimeStats["wins"] =
                    result.global.solo["wins"] +
                    result.global.duo["wins"] +
                    result.global.squad["wins"];
                result.lifetimeStats["top3s"] =
                    result.global.solo["top3"] +
                    result.global.duo["top3"] +
                    result.global.squad["top3"];
                result.lifetimeStats["top5s"] =
                    result.global.solo["top5"] +
                    result.global.duo["top5"] +
                    result.global.squad["top5"];
                result.lifetimeStats["top6s"] =
                    result.global.solo["top6"] +
                    result.global.duo["top6"] +
                    result.global.squad["top6"];
                result.lifetimeStats["top10s"] =
                    result.global.solo["top10"] +
                    result.global.duo["top10"] +
                    result.global.squad["top10"];
                result.lifetimeStats["top12s"] =
                    result.global.solo["top12"] +
                    result.global.duo["top12"] +
                    result.global.squad["top12"];
                result.lifetimeStats["top25s"] =
                    result.global.solo["top25"] +
                    result.global.duo["top25"] +
                    result.global.squad["top25"];
                result.lifetimeStats["matches"] =
                    result.global.solo["matches"] +
                    result.global.duo["matches"] +
                    result.global.squad["matches"];
                result.lifetimeStats["kills"] =
                    result.global.solo["kills"] +
                    result.global.duo["kills"] +
                    result.global.squad["kills"];
                result.lifetimeStats["timePlayed"] = totalTime;

                /*
                 * Life time kill/death ratio calculation
                 */
                result.lifetimeStats["kdRate"] = ratio(
                    result.lifetimeStats["kills"],
                    result.lifetimeStats["matches"] - result.lifetimeStats["wins"]
                );

                /*
                 * Life time win rate calculation
                 */
                result.lifetimeStats["winPercentage"] = rate(
                    result.lifetimeStats["wins"],
                    result.lifetimeStats["matches"]
                );

                /*
                 * Life time played calculation
                 */
                result.lifetimeStats["timePlayed"] = timeConvert(
                    result.lifetimeStats["timePlayed"]
                );

                /*
                 * Life time kills per minute calculation
                 */
                result.lifetimeStats["killsPerMin"] = ratio(
                    result.lifetimeStats["kills"],
                    totalTime
                );

                /*
                 * Life time kills per match calculation
                 */
                result.lifetimeStats["killsPerMatch"] = ratio(
                    result.lifetimeStats["kills"],
                    result.lifetimeStats["matches"]
                );

                /*
                 * Life time score calculation
                 */
                result.lifetimeStats["score"] =
                    result.global.solo["score"] +
                    result.global.duo["score"] +
                    result.global.squad["score"];

            });

            resolve(result);

        });
    }

}