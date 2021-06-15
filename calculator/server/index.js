"use strict";
let express = require("express");
let fs = require('fs');
let app = express();

app.post('/api/store', (req, res) => {
    console.log(req.query);
});

app.get('/api/pop', (req, res) => {
    console.log('works!');
    res.send("works");
});

app.listen(8080,()=>{console.log('running on port 8080')});
