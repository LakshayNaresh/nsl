
const fs = require("fs");
const { parse } = require("csv-parse");
var _ = require('lodash');

data = []; groupGames = [];
fs.createReadStream("./NSL Data.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (row) {
        data.push(row);
    })
    .on("end", function () {
        start(data);
    })

teams = [];
teamsElo = {};
function SetTeams() {
    teams = data.reduce((acc, row) => {
        acc.push(row[1]);
        return acc;
    }, []);
    teams = _.uniq(teams);
    teams.forEach(team => {
        teamsElo[team] = 1000;
    });
}

stats = {};

function start() {
    SetTeams();
    initCalculateElo();
    getGroupGames();  
    // startfinals();
    // specialCases1();
    // specialCases2();
    // specialCases3();
}

function specialCases1() {
    play("DOV", "OAK", true, true);
    play("FOR", "AUG", true);
    play("DOV", "AUG", true);
}

function specialCases2() {
    play("DOV", "OAK", true, true);
    play("FOR", "AUG", true, true);
    play("DOV", "FOR", true);
}

function specialCases3() {
    play("DOV", "OAK", true);
    play("FOR", "AUG", true, true);
    play("OAK", "FOR", true);
}

function startfinals() {
    play("DOV", "OAK", true);
    play("FOR", "AUG", true);
    play("OAK", "AUG", true);
}


function getGroupGames() {
    fs.createReadStream("./NSL_Group_Round_Games.csv")
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", function (row) {
            groupGames.push(row);
        })
        .on("end", function () {
            startGroupGames();
        })
}

function startGroupGames() {
    groupGames.forEach(teams => {
        play(teams[1], teams[2], true);
    });
}

function play(t1, t2, noHome_adv, force) {
    console.log("*************************");
    console.log(t1, ",", t2, " Before -> ", teamsElo[t1], teamsElo[t2]);
    console.log(t1, ",", t2, " -> ", getProbabilityTeam1(t1, t2, noHome_adv, force) * 100);
    calculateElo(t1, t2, noHome_adv, force);
    console.log(t1, ",", t2, " after -> ", teamsElo[t1], teamsElo[t2]);
    console.log("-------------------------");
}



function getProbabilityTeam1(team1, team2, noHome_adv, forcing) {
    const Home_adv = !noHome_adv ? 45 : 0;
    const prob = 1 / (1 + Math.pow(10, -(teamsElo[team1] + Home_adv - teamsElo[team2]) / 400));
    return prob;
}

function calculateElo(team1, team2, noHome_adv, forcing) {
    const k = 20;
    const propTeam1 = getProbabilityTeam1(team1, team2, noHome_adv);
    let winloose = !!(propTeam1 > .5);
    if (forcing) {
        console.log("forcing: ", winloose);
        winloose = true;
        console.log("forcing: ", winloose);
    }
    if (winloose) {
        teamsElo[team1] = teamsElo[team1] + k * (1 - propTeam1);
        teamsElo[team2] = teamsElo[team2] - k * (1 - propTeam1);
    } else {
        teamsElo[team1] = teamsElo[team1] - k * propTeam1;
        teamsElo[team2] = teamsElo[team2] + k * (1 - (1 - propTeam1));
    }
}

function initCalculateElo() {
    data.forEach(row => {
        const k = 20;
        const team1 = row[1];
        const team2 = row[3];
        const winloose = row[18];
        const propTeam1 = getProbabilityTeam1(team1, team2);
        if (winloose === "W") {
            teamsElo[team1] = teamsElo[team1] + k * (1 - propTeam1);
            teamsElo[team2] = teamsElo[team2] - k * (1 - propTeam1);
        } if (winloose === "L") {
            teamsElo[team1] = teamsElo[team1] - k * propTeam1;
            teamsElo[team2] = teamsElo[team2] + k * (1 - (1 - propTeam1));
        }
    });

    //console.log(teamsElo);
}

