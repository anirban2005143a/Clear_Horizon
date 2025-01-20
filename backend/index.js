const express = require('express');
const cors = require("cors")
const cookieParser = require("cookie-parser")
const app= express()

app.use(cors())


app.use(express.json({limit:"16kb"}))// accept data in json and form
app.use(express.urlencoded({extended:true, limit:"16kb"}))// accept url  
app.use(express.static("public"))// used to save some images, favicon if needed in public folder
app.use(cookieParser())

const feedback = require("./src/routes/feedback.js")

app.use("/api/v1/feedback",feedback)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})