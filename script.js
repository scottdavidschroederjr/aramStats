//these will be the inputs on the site to pull the info
let apiKey = ""
let userName = "SaveAsUntitled"

//putting the URLs needed for each request together
let accountRequest = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + userName + "?api_key=" + apiKey;
var matchList = []

async function fetchData(requestURL, value = false) {
    const response = fetch(requestURL)
      .then(response => response.json())
      .then(jsonifiedResponse => {

      //extracting puuid from JSON file
        if (value === "puuid") {
            const soloValue = jsonifiedResponse[value]
            return soloValue;
        } 
      //extracting matches from JSON file
        else if (value === "match")
        {
          const fetchedMatches = JSON.stringify(jsonifiedResponse, null, 4)
          return fetchedMatches
        }
      
      });
      return response
  }

let promiseOutput = "";
let puuid = fetchData(accountRequest, "puuid").then(puuid => secondRequest(puuid)).then(matches => thirdRequest(matches));

async function secondRequest(puuid){
  //set variables so we can grab 1000 games
  let matchNumber = 0;
  let x = 0;
  
  while (matchNumber < 1000) {
    // 450 is the queue value for ARAMs
    let matchRequest = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?queue=450&start=" + matchNumber + "&count=100&api_key=" + apiKey;
    //request 100 matches from API
    fetchData(matchRequest, "match")

      //clean up array to just have matches
      .then(batchMatches => batchMatches.split("\""))
      .then(removeSpace => removeSpace.filter(blanksBegone => blanksBegone.length == 14))
      .then(cleanArray => thirdRequest(cleanArray))

    //adjust matches being requested to the next batch of 100
    matchNumber = matchNumber + 100;
  }
  //send list of matches out of secondRequest function to be used to request match info
  return matchList  
}

async function thirdRequest(matches){
  for (let x = 0; x < matches.length; x++) {
    let matchInfoRequest = "https://americas.api.riotgames.com/lol/match/v5/matches/" + matches[x] + "?api_key=" + apiKey
    console.log(matchInfoRequest)
    fetchData(matchInfoRequest, "match")
      .then(info => console.log(info))
  }
}
