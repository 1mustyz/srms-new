const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ScoreSchema = new Schema({
    status: String,
    studentId: String,
    class: String,
    term: String,
    subject: String,
    ca1: Number,
    ca2: Number,
    ca3: Number,
    exam: Number
})

const Score = mongoose.model('score', ScoreSchema)

model.exports = Score