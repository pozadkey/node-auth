const express = require('express');

//Port
const port = process.env.PORT || 5000;

//Import DB config
const InitiateMongoServer = require("./config/db");

const routes = require('./routes');

// Initiate MongoDB 
InitiateMongoServer();

// start express
const app = express();

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// Start server
const startServer = () => {
    app.listen(port, (error)=>{
        if (error) throw error.message;
        console.log(`Server is running on port ${port}.`);
    })
}

startServer();

//Routes
app.use(routes);

