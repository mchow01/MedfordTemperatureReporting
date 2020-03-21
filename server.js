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
    const msgFrom = request.body.From;
    const msgBody = request.body.Body;
    twiml.message("Thanks for sending your temperature reading!");
    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(twiml.toString());
    console.log(msgFrom + " " + msgBody);
    response.send();
});

http.createServer(app).listen(process.env.PORT || 1337, () => {
    console.log('Server is on...');
});