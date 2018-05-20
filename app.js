// Import modules
const express = require('express');
const bodyParser = require('body-parser');

// Database configuration
const dbConfig = require('./config/database.config.js');
const authConfig = require('./config/auth.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// Create express app
const app = express();
require('./src/routes/playerstats.route.js')(app);

// Body Parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Fortnite API connection configurations
const FortniteAuth = require('./tools/fortnite_auth.js');
let fortniteConnection = new FortniteAuth([
    authConfig.email,
    authConfig.password,
    authConfig.client_launcher_token,
    authConfig.fortnite_client_token
]);

fortniteConnection.login().then(() => {
    console.log('connecté à fortnite api');
});

app.listen(3000, function () {
    console.log("Server listening on port 3000");
});
