// Import modules
const express = require('express');
const bodyParser = require('body-parser');

// Database configuration
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.getUrl(dbConfig.username, dbConfig.password))
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting nfow...');
        process.exit();
});

// Create express app
const app = express();

// Body Parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static('public/apidoc'));

// CORS Configuration
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
    // Pass to next layer of middleware
    next();
});

// Requiring API's routes
require('./src/routes/playerstats.route.js')(app);

app.listen(3000, function () {
    console.log("Server listening on port 3000");
});
