"use strict";
const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.text());
app.post('/api/store', (req, res) => {
    console.log(req.sessionID);
    const number = req.body;
    res.send("2");
});

app.get('/api/pop', (req, res) => {
    if(number) {
        res.status(200).send(number.toString());
    } else {
        res.status(400).send();
    }
});

app.listen(8080,()=>{console.log('running on port 8080')});
