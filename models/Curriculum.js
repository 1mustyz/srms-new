const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CurriculumSchema = new Schema({
    
        class:{
            name: String,
            category: {type: String, default: "none"},
            section: {type: String, default: "none"},
            section: String,
            subject: Array
        }
    
})

const Curriculum = mongoose.model('curriculum', CurriculumSchema);
module.exports = Curriculum;