"use strict";
const {generateId,getNumberForId, saveNumber,isUser,initServer} = require('./utils');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();



app.use(bodyParser.json())


app.post('/api/store', (req, res) => {
    console.log(req.body);
    let {number,id} = req.body;
    if(!id) id = generateId();
    saveNumber(id,number);
    res.json({id});
});

app.post('/api/pop', async (req, res) => {
    const {id} = req.body;
    console.log('pop',{id});
    if(!isUser(id)) res.status(400).send();
    const number = await getNumberForId(id);
    if(number!==undefined) {
        res.status(200).json({number,id})
    } else {
        res.status(400).send();
    }
});

app.listen(8080,initServer);
