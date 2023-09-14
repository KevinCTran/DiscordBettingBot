const { Schema, model, models, mongoose } = require("mongoose");

const overUnderSchema = new Schema({
    betString: {
        type: String,
        required: true
    },
    betSubject: {
        type: String,
        required: true
    },
    betStat: {
        type: String,
        required: true
    },
    betLine: {
        type: Number,
        required: true
    },
    overBetters: {
        type: [String]
    },
    underBetters: {
        type: [String]
    },
    active: {
        type: Boolean,
        default: true
    },
    winner: {
        type: String 
    }
});

const Overunder = mongoose.model('Overunder', overUnderSchema);

module.exports = {
    Overunder,
};