const express = require("express");
const router = express.Router();
const Feedback = require("../models/feedback")
const mongoose = require("mongoose")
require('dotenv').config();

const app = express();
async function connectToMongo() {
  await mongoose.connect(`${process.env.MONGODB_URL}`);
}

router.post('/post', async (req, res) => {
  console.log(req.body)
  try {
    await connectToMongo()
    const feedback = new Feedback({
      feedback: req.body.feedback
    })
    feedback.save()
    return res.status(200).json({ message: "Feedback send successfully" })

  } catch (error) {
    console.log(error)
    return res.status(500).json({error:true, message: "Internal error , please try again" })
  }

})

module.exports = router;