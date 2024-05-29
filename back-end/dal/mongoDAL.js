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
    }
});

const Plant = mongoose.model('plants', plantSchema);
const Log = mongoose.model('logs', logSchema);

mongoose.connect('mongodb+srv://mmitchell:Tuff12top@cluster0.fm4mkz2.mongodb.net/Roomba')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

<<<<<<< Updated upstream
exports.DAL = {
    createPlant: async (plantData) => {
        const plant = new Plant(plantData);
        return await plant.save();
    },

    getPlantById: async (plantId) => {
        return await Plant.findById(plantId).populate('logID').exec();
    },

    createLog: async (logData) => {
        const log = new Log(logData);
        const savedLog = await log.save();
        await Plant.findByIdAndUpdate(logData.plantId, { $push: { logID: savedLog._id } });
        return savedLog; // Return the saved log for further use if needed
    },

    getLogsByPlantId: async (plantId) => {
        return await Log.find({ plantId }).exec();
    },

    getAllLogs: async () => {
        return await Log.find().populate('plantId').exec();
    }
};
=======
    exports.DAL = {

        createPlant: async (plantData) => {
            const plant = new Plant(plantData);
            return await plant.save();
        },
    
        getPlantById: async (plantId) => {
            return await Plant.findById(plantId).populate('logID').exec();
        },
    
        createLog: async (logData) => {
            const log = new Log(logData);
            const savedLog = await log.save();
            await Plant.findByIdAndUpdate(logData.plantId, {$push: { logID: savedLog._id} });
        },
    
        getLogsByPlantId: async (plantId) => {
            return await Log.find({ plantId }).exec();
        },
    
        getAllLogs: async () => {
            return await Log.find().populate('plantId').exec();
        }
        
    };
>>>>>>> Stashed changes
