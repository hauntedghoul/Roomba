const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    plantId: Number,
    name: String,
    logID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log'
    }]
});

const logSchema = new mongoose.Schema({
    plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    height: Number,
    time: {
        type: Date,
        default: Date.now,
    },
    health: {
        type: String,
        enum: ['Healthy', 'Overwatered', 'Underwatered', 'Dead']
    },
    stage: {
        type: String,
        default: ''
    },
    soilMoisture: {
        min: Number,
        max: Number,
        mean: Number
    },
    temperature: {
        min: Number,
        max: Number,
        mean: Number
    },
    humidity: {
        min: Number,
        max: Number,
        mean: Number
    },
    lightExposure: {
        min: Number,
        max: Number,
        mean: Number
    },
    waterML: {
        min: Number,
        max: Number,
        mean: Number
    },
    logType: {
        type: String,
        enum: ['Watering Log', 'Epoch Summary', 'Height Log', 'Stage Log', 'Stage Advancement'],
        required: true
    }
});

const Plant = mongoose.model('Plant', plantSchema);
const Log = mongoose.model('Log', logSchema);

const createPlant = async (plantData) => {
    const plant = new Plant(plantData);
    return await plant.save();
};

const getPlantById = async (plantId) => {
    return await Plant.findById(plantId).populate('logID').exec();
};

const createLog = async (logData) => {
    const log = new Log(logData);
    const savedLog = await log.save();
    await Plant.findByIdAndUpdate(logData.plantId, { $push: { logID: savedLog._id } });
    return savedLog;
};

const getLogsByPlantId = async (plantId) => {
    return await Log.find({ plantId }).exec();
};

const getAllLogs = async () => {
    return await Log.find().populate('plantId').exec();
};

const createAILog = async (logData) => {
    try {
        const log = new Log(logData);
        const savedLog = await log.save();
        await Plant.findByIdAndUpdate(logData.plantId, { $push: { logID: savedLog._id } });
        return savedLog;
    } catch (error) {
        console.error('Error creating AI log:', error);
        throw error;
    }
};

module.exports = {
    createPlant,
    getPlantById,
    createLog,
    getLogsByPlantId,
    getAllLogs,
    createAILog
};
