const express = require('express')
const router = express.Router()
module.exports = router;

const mongoose = require('mongoose');
const eschema = mongoose.Schema;

const eschemaUser = new eschema({
    nombre: String,
    apellidos: String,
    email: String,
    dni: Number,
    idusuario: String
})

const UserModel = mongoose.model('users', eschemaUser);

// agregar usuarios
router.post('/adduser', (req, res) => {
    const newUser = new UserModel({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        dni: req.body.dni,
        id: req.body.id
    })
    newUser.save(function (err) {
        if (!err) {
            res.send('Registro agregado correctamente');
        } else{
            res.send(err);
        }
    })
})

// obtener todos los usuarios
router.get('/obtainuser', (req, res) => {
    UserModel.find({}, function (docs, err) {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    })
})

// obtener data de usuario
router.post('/obtaindatauser', (req, res) => {
    UserModel.find({id:req.body.id}, function (docs, err) {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    })
})