const mongoose = require('mongoose');


const plantSchema = new mongoose.Schema({
    plantId: Number,
    name: String,
    logID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Log'
    }]
})

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

const Plant = mongoose.model('Plant', plantSchema);
const Log = mongoose.model('Logs', logSchema);


mongoose.connect('mongodb+srv://mmitchell:Tuff12top@cluster0.fm4mkz2.mongodb.net/Roomba')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

exports.DAL = {
    
}