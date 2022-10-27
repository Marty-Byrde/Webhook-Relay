const path = require("path")
require('dotenv').config({ path: path.join(__dirname, ".env") })
const colors = require("colors");

const { io } = require("socket.io-client");
const socket = io(process.env.relayServer)

socket.on(process.env.connectionEvent, message => {
    console.log(`${colors.cyan("[Server]:")} ${colors.yellow(message)}`)
    socket.emit(process.env.authentificationEvent, process.env.authentificationKey)
})


const express = require("express")
const bodyParser = require("body-parser");
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5gb'}));


app.post(`${process.env.webHookEndpoint}`, (req, res) => acceptRequests(req, res))
app.get(`${process.env.webHookEndpoint}`, (req, res) => acceptRequests(req, res))
app.put(`${process.env.webHookEndpoint}`, (req, res) => acceptRequests(req, res))
app.delete(`${process.env.webHookEndpoint}`, (req, res) => acceptRequests(req, res))


function acceptRequests(req, res) {
    const request = {
        params: req.query,
        data: req.body
    }
    
    socket.emit(process.env.dataEvent, request);
    res.sendStatus(202)
}


app.listen(process.env.PORT, () => console.log(`Webpage is running on Port: ${process.env.PORT}`.green))