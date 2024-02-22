// Import mongoose
const mongoose = require("mongoose");

// Create schema to define data structures
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // versionKey: false,
    timestamps: true,
  }
);

// Create model
const userModel = mongoose.model("user", userSchema);

// Export module
module.exports = userModel;
