const CrewAIService = require('./crewaiService');

// Controller to create agent and task
const createAgentAndTask = async (req, res) => {
    const { agentName, taskPrompt } = req.body;
   
    

    try {
        const agentMessage = await CrewAIService.createAgent(agentName);
        const taskMessage = await CrewAIService.createTask(taskPrompt);
        res.status(200).json({ agentMessage, taskMessage });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createAgentAndTask,
};
