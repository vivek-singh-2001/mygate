const FLASK_API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5000'; // Default to local Flask server

const flaskConfig = {
    createAgentEndpoint: `${FLASK_API_URL}/create-agent`,
    createTaskEndpoint: `${FLASK_API_URL}/assign-task`,
    GenerateDailyThughtEndpoint: `${FLASK_API_URL}/daily-thought`,
    // Add more endpoints as needed
};

module.exports = flaskConfig;