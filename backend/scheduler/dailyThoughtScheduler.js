const cron = require("node-cron");
const flaskConfig = require("../config/flaskConfig");
const axios = require("axios");
const societyRepository = require("../features/society/societyRepository");

// 10 - second */10 * * * * *

// 10 min - */10 * * * *

// evry hour  0 * * * *

// every day at 9 am 0 9 * * *

// Schedule a task to run every minute
const task = cron.schedule(" 0 9 * * *", async () => {
  try {
    const response = await axios.get(flaskConfig.GenerateDailyThughtEndpoint);
    const thought = response.data.thought_of_the_day;
    await societyRepository.updateAllSocietyThought(thought);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = task;
