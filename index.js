const cheerio = require("cheerio");
const axios = require("axios");
const prompt = require('prompt-sync')();

async function scrapeLiveMatches() {
    try {
        const url = "https://tips.gg/csgo/matches/live/";
        let config = {
            maxBodyLength: Infinity,
            headers: {
                'User-Agent': 'PostmanRuntime/7.32.2',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': '',
                'Cookie': 'PHPSESSID=fissm8gpct8itpkhot48ntce4q; consent_policy=false; enduser_country=SE; enduser_in_page=https%3A%2F%2Ftips.gg%2Fcsgo%2Fmatches%2Flive%2F; enduser_locale=en; enduser_odds_format=decimal; enduser_timezone=Europe%2FStockholm; tgg_test_cookie=TipsGG%20Test%20Cookie'
            }
        };
        const response = await axios.get(url, config);
        const $ = cheerio.load(response.data);
        var list = [];

        const length = $('#body > div > div > div.b23.fl-left > div.content-block.mt20.matches').children().length;



        const teamNameList = [];
        const scoreList = [];
        const linkList = [];
        for (let i = 2; i <= length; i += 2) { //Start loop at 2 and increment by 2 because there is a useless div before the actual ones we want.
            teamNameList.push($(`#body > div > div > div.b23.fl-left > div.content-block.mt20.matches > div:nth-child(${i}) > div.element.match.running.visible > div.match-content > div > div.teams`).find('.team').text().replaceAll('\n', " ").trim())
            var score = $(`#body > div > div > div.b23.fl-left > div.content-block.mt20.matches > div:nth-child(${i}) > div.element.match.running.visible > div.match-content > div > div.additional`).find('.scores').children().text();
            //Handles buggy score when its 1:1 it shows as 1100, this if statement removes last 2 numbers.
            if(score.length > 2){
                score = score.substring(0, score.length - 2)
            }
            scoreList.push(score.substring(0, 1) + "-" + score.substring(1)) //Add a - between the numbers.
            linkList.push($(`#body > div > div > div.b23.fl-left > div.content-block.mt20.matches > div:nth-child(${i}) > div.element.match.running.visible`).find('a').attr('href'));
        }
        //console.log(teamNameList)
        //console.log(scoreList)
        //console.log(linkList)
    
    
        for (let i = 0; i < teamNameList.length; i++) {
            list.push({
                Teams: teamNameList[i],
                Score: scoreList[i],
                Link: linkList[i],
                Match: i
            });
        }
        //Print all the found live matches.
        console.log(list)
        //Ask the user which match they want to the stream for.
        askUserInput(list);
    }
    catch (e) {
        console.log("Could not retrieve data from the URL.");
    }
}

function askUserInput(list) {
    var matchNumber = prompt('Which watch do you want to view? ')
    //Send the link to this function to scrape specific match data.
    console.log(list[matchNumber].Link)
    //scrapeSpecificMatchStream(list[matchNumber].Link)
}

async function scrapeSpecificMatchStream(url) {
    try {
        let config = {
            maxBodyLength: Infinity,
            headers: {
                'User-Agent': 'PostmanRuntime/7.32.2',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': '',
                'Cookie': 'PHPSESSID=fissm8gpct8itpkhot48ntce4q; consent_policy=false; enduser_country=SE; enduser_in_page=https%3A%2F%2Ftips.gg%2Fcsgo%2Fmatches%2Flive%2F; enduser_locale=en; enduser_odds_format=decimal; enduser_timezone=Europe%2FStockholm; tgg_test_cookie=TipsGG%20Test%20Cookie'
            }
        };
        const response = await axios.get(url, config);
        const $ = cheerio.load(response.data);
    }
    catch (e) {
        console.log("Could not retrieve data from the URL.");
    }
}

scrapeLiveMatches();
