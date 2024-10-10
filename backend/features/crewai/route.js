const express = require('express');
const router = express.Router();
const CrewAIController = require('./crewaiController');

router.post('/create-agent-and-task', CrewAIController.createAgentAndTask);

module.exports = router;
