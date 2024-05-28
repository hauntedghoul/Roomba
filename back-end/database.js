const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { DAL } = require('./dal/mongoDAL');

const app = express();
const port = 4206;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/plants', async (req, res) => {
  try {
    const plant = await DAL.createPlant(req.body);
    res.status(201).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const log = await DAL.createLog(req.body);
    console.log('Log created:', log); // Log the created log
    res.status(201).json(log); // Send the created log as JSON response
  } catch (error) {
    console.error('Error creating log:', error); // Log the error
    res.status(500).json({ error: error.message }); // Send error as JSON response
  }
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await DAL.getAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error getting all logs:', error); // Log the error
    res.status(500).json({ error: error.message }); // Send error as JSON response
  }
});

app.get('/api/plants/:id', async (req, res) => {
  try {
    const plant = await DAL.getPlantById(req.params.id);
    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/logs/:plantId', async (req, res) => {
  try {
    const logs = await DAL.getLogsByPlantId(req.params.plantId);
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

// click watering can, it logs it did something 
// on log page, get all logs