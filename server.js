// Initialization, the basics
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // meaning of extended: https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0
const validator = require('validator');
const MessagingResponse = require('twilio').twiml.MessagingResponse;

app.post('/sms', (request, response) => {
    const twiml = new MessagingResponse();
    const txtMsgFrom = request.body.From;
    const txtMsgBody = request.body.Body;
    var responseTxtMsg = "Thanks for sending your temperature reading!";

    if (validator.isMobilePhone(txtMsgFrom) && validator.isFloat(txtMsgBody)) {
        const temperature = parseFloat(txtMsgBody);
        // Insert temperature reading into database

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