const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScoreSchema = new Schema({
    status: { type: String, default: 'Active' },
    studentId: String,
    class: String,
    term: { type: String, default: 1},
    subject: String,
    ca1: Number,
    ca2: Number,
    ca3: Number,
    exam: Number,
    finalSubmitted: { type: Boolean, default: false }
})

const Score = mongoose.model('score', ScoreSchema)

module.exports = Score