const express = require('express');
const app = express();
const http = require('http');

const axios = require('axios');

const dest = 'http://rolling-server:8080/';

app.use(express.static('public'));

app.get('/', (req, res) => {
    console.log(dest);
    axios.get(dest)
    .then((sres) =>{
        console.log(sres);
        res.send(sres);
    });
});

app.get('/main', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

const server = http.createServer((req, res) => {
    console.log("success");
    res.statusCode = 200;
    res.sendFile(__dirname + "/public/index.html");
})

app.listen(3000, () => {
    console.log("running");
});
