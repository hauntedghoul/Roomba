const express = require('express'); // Import express
const bodyParser = require('body-parser'); // Import body-parser
const cors = require('cors'); // Import cors
const { getAllLogs, addLog, getLogsByPlantId } = require('./jsonFile'); // Import your JSON handlers

const app = express(); // Initialize app
const port = 4206; // Define the port

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// Define routes

// Endpoint to log environment data
app.post('/api/logs', (req, res) => {
    try {
        const log = addLog(req.body); // Add the log to the JSON file
        res.status(201).json(log); // Respond with the newly added log
    } catch (error) {
        console.error('Error logging environment data:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to retrieve all logs
app.get('/api/logs', (req, res) => {
    try {
        const logs = getAllLogs(); // Retrieve all logs
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to retrieve logs by plant ID
app.get('/api/logs/:plantId', (req, res) => {
    try {
        const logs = getLogsByPlantId(req.params.plantId); // Get logs for a specific plant
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs by plant ID:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

