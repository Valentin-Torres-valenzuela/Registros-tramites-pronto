const express = require('express');
const cors = require('cors');
const app = express();

//importar conexion mongoDB
const archivoBD = require('./conection');

// importamos rutas y modelo usuario
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const corsOptions = {
    origin: process.env.APPURL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-access-token', 'Origin', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 600
}

app.use(cors(corsOptions));

// Middleware para manejar preflight OPTIONS
app.options('*', cors(corsOptions));

app.get('/', (req, res) => res.send('Bienvenidos al server!'))
app.get('/api', (req, res) => res.send('API ONLINE'))
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);


//configurar server basico

app.listen(5000, function () {
    console.log("está vivoooo!!!");
})
