const http = require('http');
const mqtt = require('./mqtt.js');

const hostname = '127.0.0.1';
const port = 3333;

// console.log("Esse é o objeto mensagem: ", mqtt)

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.statusCode = 200;
    res.end('Hello World\n Fala tu');
})

server.listen(port, hostname, () => {
    console.log(`Server ONLINE`);
});