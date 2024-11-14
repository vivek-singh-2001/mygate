
// Function to get the Map API key from environment variables
function getMapApiKey() {
    console.log("abc");
    
  const apiKey = process.env.googlemapapikey;
  if (!apiKey) {
    throw new Error("Map API key is not defined in the environment variables");
  }
  return apiKey;
}

module.exports = { getMapApiKey };
