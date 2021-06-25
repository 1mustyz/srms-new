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
    ca1: { type: Number, default: 20},
    ca2: { type: Number, default: 20},
    ca3: { type: Number, default: 20},
    ca4: { type: Number, default: 20},
    exam: { type: Number, default: 20},
    grade: String,
    isfinalSubmitted: { type: Boolean, default: false }
})

const Score = mongoose.model('score', ScoreSchema)

module.exports = Score