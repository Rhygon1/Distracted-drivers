const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const http = require('http')
const server = http.createServer(app)

app.use(express.static('public'))

server.listen(PORT, () => console.log('started listening'))