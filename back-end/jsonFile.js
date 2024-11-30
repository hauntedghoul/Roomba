const fs = require('fs');
const path = require('path');

// Define the path for the JSON file
const filePath = path.join(__dirname, '/json/plant.json');

// Helper function to read the JSON file
const readJsonFile = () => {
    try {
        if (!fs.existsSync(filePath)) {
            // If the file doesn't exist, initialize it with an empty logs array
            fs.writeFileSync(filePath, JSON.stringify({ logs: [] }, null, 2));
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return { logs: [] };
    }
};

// Helper function to write to the JSON file
const writeJsonFile = (data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing to JSON file:', error);
    }
};

// Function to get all environment logs
const getAllLogs = () => {
    const data = readJsonFile();
    return data.logs;
};

// Function to add a new log
const addLog = (log) => {
    const data = readJsonFile();
    data.logs.push(log);
    writeJsonFile(data);
    return log;
};

// Function to get logs by plant ID
const getLogsByPlantId = (plantId) => {
    const data = readJsonFile();
    return data.logs.filter((log) => log.plantId === plantId);
};

module.exports = {
    getAllLogs,
    addLog,
    getLogsByPlantId,
};
