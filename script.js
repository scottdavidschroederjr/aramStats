//these will be the inputs on the site to pull the info
let apiKey = ""
let userName = "SaveAsUntitled"

//putting the URLs needed for each request together
let accountRequest = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + userName + "?api_key=" + apiKey;
var matchList = []

//begins series of requests
let puuid = fetchData(accountRequest, "puuid").then(puuid => matchListRequest(puuid)).then(matches => thirdRequest(matches));

//function used to fetch data from Riot API, used by multiple steps
async function fetchData(requestURL, value = false) {
    const response = fetch(requestURL)
      .then(response => response.json())
      .then(jsonifiedResponse => {
        console.log(response)
      //extracting puuid from JSON file (pull #1)
        if (value === "puuid") {
            const soloValue = jsonifiedResponse[value]
            return soloValue;
        } 

      //extracting matches from JSON file (pull #2)
        else if (value === "match")
        {
          const fetchedMatches = JSON.stringify(jsonifiedResponse, null, 4)
          return fetchedMatches
        }
      
      //extracting matchData from JSON file (pull #3)
        else if (value === "matchData") {
          console.log(jsonifiedResponse)
          console.log(jsonifiedResponse['info'])
          //const fetchedMatchData = JSON.parse(jsonifiedResponse)
          //return fetchedMatchData
        }
    
      });
      return response
  }

//function used to get the list of matches
//while matchNumber should be swapped to 1000 if we get API approval, otherwise rate limit will stop it
async function matchListRequest(puuid){
  let matchNumber = 0;
  let x = 0;

  while (matchNumber < 100) {
    let matchRequest = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?queue=450&start=" + matchNumber + "&count=100&api_key=" + apiKey;
    
    //request batch of 100 matches from API
    fetchData(matchRequest, "match")

    //clean up data to make it into an array of matchIDs
    .then(batchMatches => batchMatches.split("\""))
    .then(removeSpace => removeSpace.filter(blanksBegone => blanksBegone.length == 14))

    //send cleaned array to request match info
    .then(cleanArray => thirdRequest(cleanArray))

    //adjust matches being requested to the next batch of 100
    matchNumber = matchNumber + 100;
  }
  //don't know why but removing this return makes everything not work????
  return matchList  
}

//function to get match data for list of matches
async function thirdRequest(matches){
  for (let x = 0; x < matches.length; x++) {
    let matchInfoRequest = "https://americas.api.riotgames.com/lol/match/v5/matches/" + matches[x] + "?api_key=" + apiKey
    fetchData(matchInfoRequest, "matchData")
      .then(info => console.log(info))
  }
}
