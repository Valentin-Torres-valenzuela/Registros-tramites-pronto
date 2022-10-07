const express = require('express');
const cors = require('cors');
const app = express();

//importar conexion mongoDB

const archivoBD = require('./conection');

// importamos rutas y modelo usuario
const userRoute = require('./routes/user');

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use('/api/user', userRoute);


app.get('/', (req, res) => {
    res.end('Bienvenidos al server!');
})

//configurar server basico

app.listen(5000, function () {
    console.log("está vivoooo!!!");
})