const axios = require('axios');
const flaskConfig = require('../../config/flaskConfig');

// Function to create an agent
const createAgent = async (agentName) => {
    const response = await axios.post(flaskConfig.createAgentEndpoint, {
        agentName: agentName,
    });
    return response.data.message; // Return the success message
};

// Function to create a task
const createTask = async (taskPrompt) => {
    const response = await axios.post(flaskConfig.createTaskEndpoint, {
        taskPrompt: taskPrompt,
    });
    console.log(response.data.result);
    
    return response.data.result; // Return the success message
};

module.exports = {
    createAgent,
    createTask,
};
