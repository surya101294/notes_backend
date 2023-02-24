const express = require("express")
const { NoteModel } = require("../model/Note.model")

const noteRouter = express.Router()

noteRouter.get("/", async (req, res) => {
    
    const notes = await NoteModel.find({user:req.body.user})   
    res.send(notes)
})

noteRouter.post("/create", async (req, res) => {
    const payload = req.body
    try {
        const new_note = new NoteModel(payload)
        await new_note.save()
        res.send("Note Created")
    } catch (err) {
        res.send("Not created some issues")
    }
})

noteRouter.patch("/update/:id", async (req, res) => {
    const id = req.params.id
    const payload = req.body
    const note = await NoteModel.findOne({ '_id': id })
    console.log(note);
    const userID = req.body.user
    // console.log('user ID from db', note.user);
    // console.log('from req.body', userID);
    try {
        if (note.user !== userID) {
            res.send({ "msg": "You are not authorized to perform this operation" })
        } else {
            await NoteModel.findByIdAndUpdate({ "_id": id }, payload)
            res.send("Updated the note")
        }
    } catch (err) {
        console.log(err)
        res.send({ "msg": "Something went wrong" })
    }
})

noteRouter.delete("/delete/:id", async (req, res) => {
    const noteID = req.params.id
    const note = await NoteModel.findOne({ '_id': noteID }) 
    console.log(note);
    const userID = req.body.user
    // console.log('user ID from db', note.user);
    // console.log('from req.body', req);

    try {
        if (note.user !== userID) {
            res.send({ "msg": "You are not authorized to perform this operation" })
        } else {
            await NoteModel.findByIdAndDelete({ _id: noteID })
            res.send(`Note with id ${id} has been deleted`)
        }
    } catch (err) {
        res.send("some thing went wrong")
    }
})

module.exports = { noteRouter }