const express = require('express');
const cors = require('cors');
// ... otros imports

const app = express();

// Configurar CORS de manera más permisiva para desarrollo
app.use(cors({
    origin: '*', // Permite todas las origenes en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Aumentar el límite a 100MB
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));

// ... resto del código 