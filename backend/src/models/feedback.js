const mongoose = require("mongoose");

const feedbackShcema = new mongoose.Schema({
  feedback: {
    type:String,
  }
});

const Feedback = mongoose.model("feedback", feedbackShcema);

module.exports = Feedback;
