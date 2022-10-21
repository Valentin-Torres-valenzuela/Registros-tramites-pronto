const express = require('express');
const cors = require('cors');
const app = express();

//importar conexion mongoDB

const archivoBD = require('./conection');

// importamos rutas y modelo usuario
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//* origin para postman
const corsOptions = {
    credentials: true,
    origin: process.env.APPURL
}

app.use(cors(corsOptions))
app.get('/', (req, res) => res.send('Bienvenidos al server!'))
app.get('/api', (req, res) => res.send('API ONLINE'))
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);


//configurar server basico

app.listen(5000, function () {
    console.log("está vivoooo!!!");
})
