//these will be the inputs on the site to pull the info
let apiKey = "RGAPI-e5f897ff-2f44-4464-b3a5-0597a4af3979"
let userName = "SaveAsUntitled"

//putting the URLs needed for each request together
let accountRequest = "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + userName + "?api_key=" + apiKey;

async function fetchData(requestURL, value = false) {
      const response = await fetch(requestURL);
      const data = await response.json();
      
       // if only one piece is needed, returning just that
    if (value != false) {
      const soloValue = data[value]
      return soloValue
    }
    else {
      //future area for future pulls
    }
  }

async function getData(requestURL, value = false) {
    let result = await fetchData(requestURL, value);
    return result
  }

puuid = getData(accountRequest, "puuid")

console.log(puuid)


