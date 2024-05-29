const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { createPlant, getPlantById, createLog, getLogsByPlantId, getAllLogs, createAILog } = require('./dal/mongoDAL');

const app = express();
const port = 4206;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://mmitchell:Tuff12top@cluster0.fm4mkz2.mongodb.net/Roomba', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/plants', async (req, res) => {
    try {
        const plant = await createPlant(req.body);
        res.status(201).json(plant);
    } catch (error) {
        console.error('Error creating plant:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/logs', async (req, res) => {
    try {
        const log = await createLog(req.body);
        console.log('Log created:', log);
        res.status(201).json(log);
    } catch (error) {
        console.error('Error creating log:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/ai-logs', async (req, res) => {
    try {
        const log = await createAILog(req.body);
        res.status(201).json(log);
    } catch (error) {
        console.error('Error creating AI log:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/plants/:id', async (req, res) => {
    try {
        const plant = await getPlantById(req.params.id);
        res.status(200).json(plant);
    } catch (error) {
        console.error('Error fetching plant:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/logs/:plantId', async (req, res) => {
    try {
        const logs = await getLogsByPlantId(req.params.plantId);
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching logs by plant ID:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/logs', async (req, res) => {
    try {
        const logs = await getAllLogs();
        res.status(200).json(logs);
    } catch (error) {
        console.error('Error fetching all logs:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});