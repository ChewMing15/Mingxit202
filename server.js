const express = require('express');
const DataStore = require('nedb');
// To use the fetch function in the server, need to install using the command "npm install node-fetch" and require it on top
const fetch = require('node-fetch');

// Env
require('dotenv').config();
//console.log(process.env);

const app = express();
const database = new DataStore('database.db');

database.loadDatabase();
app.use(express.json({limit: '1mb'}));
app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Listening at 3000');
})

app.post('/ctos', (request, response) => {
    
    const data = request.body;
    data.timestamp = Date.now();

    database.insert(data);
    console.log(database);

    response.send("got it");
});

app.get('/stoc', (err, response) => {

    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }

        response.json(data);

    });
    
});

app.get('/weatherapi/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    var lat = latlon[0];
    var long = latlon[1];

    try {
        const api_key = process.env.API_KEY

        const api_url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${api_key}`;
        //const api_url = 'https://api.wheretheiss.at/v1/satellites/25544'

        // To use the fetch function in the server, need to install using the command "npm install node-fetch" and require it on top
        const weather_response = await fetch(api_url);
        const weather_data = await weather_response.json();
        
        const api_url2 = `https://api.openaq.org/v1/latest?coordinates=${lat},${long}`
        console.log(api_url2);
        const aq_response = await fetch(api_url2);
        const aq_data = await aq_response.json();

        const data = {
            weather: weather_data,
            air_quality : aq_data
        }

        response.json(data);
    } catch {
        console.log('Soemthing is wrong');
  
    }
});

