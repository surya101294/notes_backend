const mongoose = require("mongoose");


const noteSchema = mongoose.Schema({
    title: { type: String },
    body: { type: String},
    user: String,    //no required since it will be given automatically by the middleware
})

const NoteModel = mongoose.model("note", noteSchema)

module.exports = { NoteModel }