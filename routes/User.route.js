const express = require("express")
const { UserModel } = require("../model/User.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userRouter = express.Router()

/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*       properties:
*           id:
*               type: string
*               description: The auto-generated id of the user
*       name:
*           type: string
*           description: The user name
*       email:
*           type: string
*           description: The user email
*/
/**
* @swagger
* tags:
*   name: Users
*   description: All the API routes related to User
*/
/**
* @swagger
* /users:
*   get:
*       summary: This will get all the user data from the database
*       tags: [Users]
*       responses:
*       200:
*           description: The list of all the users
*           content:
*               application/json:
*                   schema:
*                       type: array
*                       item:
*                       $ref: "#/model/User.model"
*
*/
userRouter.get("/", async (req, res) => {
    const users = await UserModel.find()
    res.send(users)
})

/**
* @swagger
* /users/register:
*   post:
*       summary: To post the details of a new user
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*           schema:
*           $ref: '#/model/User.model'
*       responses:
*           200:
*           description: The user was successfully registered
*           content:
*               application/json:
*               schema:
*                   $ref: '#/model/User'
*            500:
*             description: Some server error
*/

userRouter.post("/register", async (req, res) => {
    const { name, email, pass } = (req.body)
    try {
        bcrypt.hash(pass, 5, async function (err, hash) {   //myPlaintextPassword= pass , saltRounds=no. of times encryption used
            // Store hash in your password DB.
            if (err) res.send({ 'msg': 'Something went wrong', 'err': err.message })
            else {
                const user = new UserModel({ name, email, pass: hash })
                await user.save()
                res.send({ "msg": "New user has been register" })
            }
        });
    } catch (err) {
        console.log({ 'msg': 'Something went wrong', 'err': err.message });
    }
})



userRouter.post("/login", async (req, res) => {
    const { email, pass } = (req.body)
    try {
        const user = await UserModel.find({ email })
        if (user.length > 0) {
            // Load hash from your password DB.
            bcrypt.compare(pass, user[0].pass, function (err, result) {  //hash= user
                // result == true
                if (result) {
                    // let token = jwt.sign({ course: "backend" }, 'masai') // random payload while creating token
                    let token = jwt.sign({ userID: user[0]._id }, 'masai')
                    res.send({ "msg": "Logging in", "token": token })
                }
                else {
                    res.send({ 'msg': 'wrong Credentials' });
                }
            });
        }
    } catch (err) {
        res.send({ 'msg': 'wrong Credentials', 'err': err.message });
    }
})

//front end is pending for below routes

/**
* @swagger
* /users/update/{id}:
* patch:
*   summary: It will update the user details
*   tags: [Users]
*   parameters:
*   - in: path
*       name: id
*       schema:
*           type: string
*           required: true
*           description: The book id
*       requestBody:
*           required: true
*           content:
*               application/json:
*           schema:
*           $ref: '#/model/User.model'
*   responses:
*       200:
*           description: The user Deatils has been updated
*           content:
*           application/json:
*          schema:
*           $ref: '#/model/User.model'
*       404:
*           description: The user was not found
*       500:
*           description: Some error happened
*/

userRouter.patch("/update/:id", async (req, res) => {
    const id = req.params.id
    const payload = req.body
    await UserModel.findByIdAndUpdate({ _id: id }, payload)
    res.send({ "msg": "User details have been updated" })
})

/**
* @swagger
* /users/delete/{id}:
*   delete:
*       summary: Remove the user by id
*       tags: [Users]
*       parameters:
*           - in: path
*           name: id
*           schema:
*               type: string
*               required: true
*               description: The user id
*           responses:
*               200:
*                   description: The user was deleted
*               404:
*                   description: The user was not found
*/
userRouter.delete("/delete/:id",async (req,res)=>{
    const id=req.params.id
    await UserModel.findByIdAndDelete({_id:id})
    res.send({"msg":"User has been deleted"})
    })

module.exports = { userRouter }
