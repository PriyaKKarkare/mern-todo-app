const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minLength: [4, "Title must be 4 charachters or more must"],
    trim: true
  },
}, { timestamps: true });

module.exports = mongoose.model("Todo", TodoSchema);