const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScoreSchema = new Schema({
    isActive: { type: Boolean, default: true },
    studentId: String,
    username: String,
    firstName: String,
    lastName: String,
    class: String,
    term: { type: String, default: 1},
    category: String,
    subject: String,
    ca1: { type: Number, default: 0},
    ca2: { type: Number, default: 0},
    ca3: { type: Number, default: 0},
    ca4: { type: Number, default: 0},
    exam: { type: Number, default: 0},
    grade: String,
    total: { type: Number, default: 0},
    isfinalSubmitted: { type: Boolean, default: false }
})

const Score = mongoose.model('score', ScoreSchema)

module.exports = Score