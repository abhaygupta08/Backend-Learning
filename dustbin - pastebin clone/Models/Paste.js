const mongoose = require('mongoose');

const PasteSchema = new mongoose.Schema({
    title : String,
    content : String,
    createdOn : {
        type : Date,
        default : Date.now
    },
    modifiedOn : {
        type : Date,
        default : Date.now
    },
    deleteId : String
})

const Paste = mongoose.model('paste', PasteSchema);

module.exports = Paste;