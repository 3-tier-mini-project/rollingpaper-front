const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const axios = require('axios');
const dest = 'http://rolling-server:8080';

app.use(express.static('public'));

app.get('/allnotes', (req, res) => {
    console.log(dest);
    axios.get(dest)
    .then((sres) =>{
        console.log("node: ", sres);
        res.send(sres);
    });
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.sendFile(__dirname + "/public/index.html");
})


server.listen(13000);

app.listen(3000, () => {
    console.log("running");
});
