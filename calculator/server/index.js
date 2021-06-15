"use strict";
const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.text());

let users = new Map();
const generateId = () => Math.random().toString(36).substr(2, 10);

app.post('/api/store', (req, res) => {
    const id = generateId();
    if(users.has(id)) {
        id = generateId();
    }
    
    const number = req.body;
    users.set(id,number);
    res.send(id);
});

app.post('/api/pop', (req, res) => {
    const id = req.body;
    if(!id) res.status(400).send();

    const number = users.get(id);
    if(number) {
        res.status(200).send(number.toString());
    } else {
        res.status(400).send();
    }
});

app.listen(8080,()=>{console.log('running on port 8080')});
