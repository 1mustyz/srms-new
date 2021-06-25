const mongoose = require('mongoose');
const {Schema, model} = mongoose;

TermSetterSchema = new Schema({
    currentTerm: String,
    session: {
        year: String
    }
})

const TermSetter = model('termSetter',TermSetterSchema);

module.exports = TermSetter;