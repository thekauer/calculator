"use strict";
let express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.text())

let users = 0;
let memory = [];
app.post('/api/store', (req, res) => {
    const number = req.body;
    console.log('store',number);
    users++;
    memory[users]=number;
    res.send(users.toString());
});

app.post('/api/pop', (req, res) => {
    const id = req.body;
    console.log('pop for: ',id);
    const number = memory[id];
    if(number) {
        res.status(200).send(number.toString());
        memory[id]=undefined;
    } else {
        res.status(400).send();
    }
});

app.listen(8080,()=>{console.log('running on port 8080')});
