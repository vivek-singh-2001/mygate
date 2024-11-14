const express = require("express");
const router = express.Router();
const { getMapApiKey } = require("./mapApiKey");

// Route to get the Map API key
router.get("/", (req, res) => {
  try {
    const apiKey = getMapApiKey();
    res.json({ apiKey });
  } catch (error) {
    console.error("Error fetching Map API Key:", error.message);
    res.status(500).json({ error: "Failed to retrieve Map API key" });
  }
});

module.exports = router;
