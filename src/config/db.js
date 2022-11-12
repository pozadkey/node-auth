const mongoose = require("mongoose");
require('dotenv').config();

// Import MongoDB connect Url  
const db = process.env.DB 

// Connect to DB
const InitiateMongoServer = async () => {
  try {
    mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;