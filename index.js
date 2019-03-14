// === Dependencies ===
require('dotenv').config();
const express = require('express');

// === Controllers ===
const swapiCtrl = require('./controllers/swapiCtrl');

// === Destructure from env object ===
const { SERVER_PORT } = process.env;

// === Initialize express app ===
const app = express();

// === Endpoints ===
app.get('/people', swapiCtrl.getPeople);
app.get('/planets', swapiCtrl.getPlanets);

// === Listen on specific port ===
app.listen(SERVER_PORT, () => console.log(`Listening on port: ${SERVER_PORT}`));

