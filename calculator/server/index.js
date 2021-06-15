"use strict";
const {generateId,getNumberForId, saveNumber,isUser} = require('./utils');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.text());


app.post('/api/store', (req, res) => {
    const id = generateId();
    console.log(id);   
    const number = req.body;
    saveNumber(id,number);
    res.send(id);
});

app.post('/api/pop', (req, res) => {
    const id = req.body;
    if(!isUser(id)) res.status(400).send();
    const number = getNumberForId(id);
    if(number) {
        res.status(200).send(number.toString());
    } else {
        res.status(400).send();
    }
});

app.listen(8080,()=>{console.log('running on port 8080')});
