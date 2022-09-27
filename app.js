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
});

router.post("/", (req, res) => {
    const nickname = req.body.nickname;
    const password = req.body.password;
    const content = req.body.content;
    console.log("this is post of app.js")
    console.log(nickname, password, content);
    if (validateInput(nickname, password, content)) {
        axios.post(dest, {
            nickname: nickname,
            password: password,
            content: content
        }).then((response) => {
            console.log(response);
            res.redirect('/');
            // window.location.reload();
        });
    }
})

function validateInput(nickname, password, content) {
    if (nickname.value !== "" && password.value !== "" && content.value !== "") {
        return true;
    } else {
        if (nickname.value === "") {
            nickname.classList.add("warning");
            nickname.placeholder = "Please input a text.";
        }
        if (password.value === "") {
            password.classList.add("warning");
            password.placeholder = "Please input a text.";
        }
        if (content.value === "") {
            content.classList.add("warning");
            content.placeholder = "Please input a text.";
        }
    }
    setTimeout(() => {
        nickname.classList.remove("warning");
        password.classList.remove("warning");
        content.classList.remove("warning");
        nickname.placeholder = "";
        password.placeholder = "";
        content.placeholder = "";

    }, 1600);
}

// server.listen(3000, () => {
//     console.log("server running");
// });

app.listen(3000, () => {
    console.log("running");
});