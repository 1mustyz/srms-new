const mongoose = require('mongoose');
const {Schema, model} = mongoose;

TermSetterSchema = new Schema({
    currentTerm: String
})

TermSetter = model('termSetter',TermSetterSchema);