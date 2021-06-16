"use strict";
const {generateId,getNumberForId, saveNumber,isUser,initServer} = require('./utils');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.text());


app.post('/api/store', (req, res) => {
    const id = generateId(); 
    const number = req.body;
    saveNumber(id,number);
    res.send(id);
});

app.post('/api/pop', async (req, res) => {
    const id = req.body;
    if(!isUser(id)) res.status(400).send();
    const number = await getNumberForId(id);
    console.log(number);
    if(number) {
        res.status(200).send(number.toString());
    } else {
        res.status(400).send();
    }
});

app.listen(8080,initServer);
