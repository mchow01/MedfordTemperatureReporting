// Initialization, the basics
const twilio = require('twilio');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // meaning of extended: https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
const validator = require('validator');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

// Database connection
const { Client } = require('pg');
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

// For processing SMS message that goes to phone number (617) 207-6898
// twilio.webhook() is used to ensure incoming request came from Twilio and not anywhere else
// Source: https://www.twilio.com/docs/usage/tutorials/how-to-secure-your-express-app-by-validating-incoming-twilio-requests
app.post('/sms', (request, response) => {
    const twiml = new MessagingResponse();
    const txtMsgFrom = request.body.From;
    const txtMsgBody = request.body.Body;
    var responseTxtMsg = "Thanks for sending your temperature reading!";

    if (validator.isMobilePhone(txtMsgFrom) && validator.isFloat(txtMsgBody)) {
        const temperature = parseFloat(txtMsgBody);
        // Insert temperature reading into database
        client.connect();
        client.query('INSERT INTO temperature_readings (telephone_number, temperature) VALUES ($1, $2)', [txtMsgFrom, temperature], (err, res) => {
            if (err) {
                console.log(err.stack); // bad form?
            }
        });

        // Determine appropriate text message to send
        if (temperature >= 97.0 && temperature < 100.4) {
            responseTxtMsg += " Based on your temperature, you are good!";
        }
        else if (temperature >= 100.4) {
            responseTxtMsg += " You have a fever and need medical attention.";
        }
        else if (temperature < 97.0) {
            responseTxtMsg += " You may have hypothermia need medical attention.";
        }
    }
    else {
        responseTxtMsg += " Sorry, your temperature entry is invalid because it is not a temperature reading."
    }
    twiml.message(responseTxtMsg);
    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(twiml.toString());
    response.send();
});

http.createServer(app).listen(process.env.PORT || 1337, () => {
    console.log('Server is on...');
});