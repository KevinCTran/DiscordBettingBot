const { Schema, model, models, mongoose } = require("mongoose");

const leaderboardSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        default: 0
    }
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

module.exports = {
    Leaderboard,
};