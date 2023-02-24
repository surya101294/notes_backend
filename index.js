require("dotenv").config()

const express = require("express")
const { connection } = require("./db")
const { authenticate } = require("./middlewares/authenticate.middleware")
const { noteRouter } = require("./routes/Note.route")
const { userRouter } = require("./routes/user.route")
const cors= require("cors")
const swaggerJSDoc = require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")
const app = express()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Home page")
})

app.use(cors())

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Learning Swagger',
      version: '1.0.0',
    },
  },
  apis: ['./routes*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", userRouter)
app.use(authenticate)
app.use("/notes", noteRouter)

app.listen(process.env.port, async()=>{
    try{
        await connection
        console.log("Connected to DB");
    }catch(err){
        console.log("not connected",err.message);
    }
    console.log(`server running at ${process.env.port}`);
})