const express = require('express')
const router = express.Router()
module.exports = router;

const mongoose = require('mongoose');
const eschema = mongoose.Schema;

const eschemaUser = new eschema({
    nombre: String,
    numRecibo: String,
    servicios: Array,
    totalPagosEfectuar: Number,
    arancel: Number,
    total: Number,
    fecha: Date,
    idusuario: String
})

const UserModel = mongoose.model('users', eschemaUser);

// agregar usuarios
router.post('/adduser', (req, res) => {
    const newUser = new UserModel({
        nombre: req.body.nombre,
        numRecibo: req.body.numRecibo,
        servicios: req.body.servicios,
        totalPagosEfectuar: req.body.totalPagosEfectuar,
        arancel: req.body.arancel,
        total: req.body.total,
        fecha: req.body.fecha,
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
router.get('/obtainuser', async (req, res) => {
    const PAGE_SIZE = 15;
    const page = parseInt(req.query.page || '0');
    const allUsers = await UserModel.find({});
    const total = await UserModel.countDocuments({});
    const users = await UserModel.find({}).limit(PAGE_SIZE).skip(PAGE_SIZE * page);
    res.json({
        totalPages: Math.ceil(total / PAGE_SIZE),
        users,
        allUsers,
    });
    // UserModel.find({}, function (docs, err) {
    //     if (!err) {
    //         res.send(docs);
    //     } else {
    //         res.send(err);
    //     }
    // })
});

// obtener data de usuario
router.get('/obtaindatauser/:id', (req, res) => {
    UserModel.findById(req.params.id, function (docs, err) {
        if (!err) {
            res.json(docs);
        } else {
            console.log(err)
            res.send(err);
        }
    })
})

router.patch('/updateuser/:id', (req, res) => {
    UserModel.findByIdAndUpdate(req.params.id, {
        nombre: req.body.nombre,
        numRecibo: req.body.numRecibo,
        servicios: req.body.servicios,
        totalPagosEfectuar: req.body.totalPagosEfectuar,
        arancel: req.body.arancel,
        total: req.body.total,
        fecha: req.body.fecha
    }, (err) => {
        if (!err) {
            res.send('Usuario actualizado correctamente');
        } else {
            res.send(err);
        }
    })
})