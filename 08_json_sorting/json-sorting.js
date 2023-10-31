const axios = require('axios');

var listOfEndpoints = [
    "https://jsonbase.com/sls-team/json-793",
    "https://jsonbase.com/sls-team/json-955",
    "https://jsonbase.com/sls-team/json-231",
    "https://jsonbase.com/sls-team/json-931",
    "https://jsonbase.com/sls-team/json-93",
    "https://jsonbase.com/sls-team/json-342",
    "https://jsonbase.com/sls-team/json-770",
    "https://jsonbase.com/sls-team/json-491",
    "https://jsonbase.com/sls-team/json-281",
    "https://jsonbase.com/sls-team/json-718",
    "https://jsonbase.com/sls-team/json-310",
    "https://jsonbase.com/sls-team/json-806",
    "https://jsonbase.com/sls-team/json-469",
    "https://jsonbase.com/sls-team/json-258",
    "https://jsonbase.com/sls-team/json-516",
    "https://jsonbase.com/sls-team/json-79",
    "https://jsonbase.com/sls-team/json-706",
    "https://jsonbase.com/sls-team/json-521",
    "https://jsonbase.com/sls-team/json-350",
    "https://jsonbase.com/sls-team/json-64"
  ];


  async function fetchUrl(url) {
    for (let i = 0; i < 3; i++) {
      try {
        const response = await axios.get(url);
        const data = response.data;
        const isDone = data.isDone;
        console.log(`[Success] ${url}: isDone - ${isDone}`);
        return isDone;
      } catch (error) {
        console.error(`[Fail] ${url}: ${error.message}`);
      }
    }
  }
  
  async function main() {
    let trueCount = 0;
    let falseCount = 0;
  
    for (const url of listOfEndpoints) {
      const isDone = await fetchUrl(url);
      if (isDone === true) {
        trueCount++;
      } else if (isDone === false) {
        falseCount++;
      }
    }
  
    console.log(`\nFound True values: ${trueCount},`);
    console.log(`Found False values: ${falseCount}`);
  }
  
  main();