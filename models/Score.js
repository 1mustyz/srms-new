const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScoreSchema = new Schema({
    isActive: { type: Boolean, default: true },
    studentId: String,
    class: String,
    term: { type: String, default: 1},
    category: { type: String },
    subject: String,
    ca1: Number,
    ca2: Number,
    ca3: Number,
    ca4: Number,
    exam: Number,
    isfinalSubmitted: { type: Boolean, default: false }
})

const Score = mongoose.model('score', ScoreSchema)

module.exports = Score