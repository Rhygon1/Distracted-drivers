const {reshape, divide} = require('mathjs')
const tf = require("@tensorflow/tfjs");
const tfn = require("@tensorflow/tfjs-node");
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const http = require('http')
const server = http.createServer(app)
const bodyParser = require('body-parser');

app.use(express.static('public'))
app.use(bodyParser.json({limit: "2mb"}));
app.use(bodyParser.urlencoded({limit: "2mb", extended: true, parameterLimit:50000}));

let model

async function loadModel(){
    const handler = tfn.io.fileSystem("./tfjs/model.json");
    model = await tf.loadLayersModel(handler);
}

loadModel()

app.post('/magic', (req, res) => {
    let data = JSON.parse(req.body.data)
    let pixels = []
    Object.keys(data).forEach(k => {
        pixels.push(data[k])
    })
    pixels = divide(pixels, 255)
    pixels = tf.tensor4d([reshape(pixels, [64, 64, 3]),])
    let result = model.predict(pixels).arraySync()[0]
    if(result[0] > result[1]){
        res.send('Attentive')
    } else {
        res.send('Distracted')
    }
})

server.listen(PORT, () => console.log('started listening'))