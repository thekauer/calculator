"use strict";
const express = require("express");
const fs = require('fs');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();


app.use(bodyParser.text());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

app.post('/api/store', (req, res) => {
    const number = req.body;
    res.send(users.toString());
});

app.get('/api/pop', (req, res) => {
    if(number) {
        res.status(200).send(number.toString());
    } else {
        res.status(400).send();
    }
});

app.listen(8080,()=>{console.log('running on port 8080')});
