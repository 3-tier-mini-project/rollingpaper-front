const express = require('express');
const es6Renderer = require('express-es6-template-engine');
const app = express();
const http = require('http');
const path = require('path');
const axios = require('axios');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const dest = 'http://rolling-server:8080';

app.set('view engine', 'ejs');
app.set('views', 'public');
const router = express.Router()
app.use(router)

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.sendFile(__dirname + "/public/index.html");
})

app.use(express.static('public'));
router.use(bodyParser.urlencoded({ extended: false }))

router.get("/", (req, res) => {
    axios.get(dest)
        .then(response => {
            console.log(response)
            res.render("index", { data: response.data })
        })
})

server.listen(13000);

app.listen(3000, () => {
    console.log("running");
});
