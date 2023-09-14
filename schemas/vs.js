const { Schema, model, models, mongoose } = require("mongoose");

const vsSchema = new Schema({
    betString: {
        type: String,
        required: true
    },
    betSubjectOne: {
        type: String,
        required: true
    },
    betSubjectTwo: {
        type: String,
        required: true
    },
    betCategory: {
        type: String,
        required: true
    },
    oneBetters: {
        type: [String]
    },
    twoBetters: {
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

const Vs = mongoose.model('Vs', vsSchema);

module.exports = {
    Vs,
};