const express = require('express')
const router = express.Router()
module.exports = router;

const isAuth = require('../isAuth')

const mongoose = require('mongoose');
const eschema = mongoose.Schema;
const nodemailer = require('nodemailer');

const eschemaUser = new eschema({
    nombre: String,
    numRecibo: String,
    servicios: Array,
    totalPagosEfectuar: Number,
    arancel: Number,
    total: Number,
    fecha: Date,
    idusuario: String,
    id: String
})

const UserModel = mongoose.model('users', eschemaUser);

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// agregar usuarios
router.post('/adduser', isAuth, async (req, res) => {
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
    try {
        await newUser.save();
        res.json(newUser);
    } catch (error) {
        res.status(400).json(error);
    }
})

// obtener todos los usuarios
router.get('/obtainuser', isAuth, async (req, res) => {
    const {page, nombre, fechaD, fechaH} = req.query
    const PAGE_SIZE = 20;
    let allUsers;
    let totalUsers;
    let regexName = '.*'+nombre+'.*';
    const date = new Date();
    const fechaBDdesde = fechaD ? new Date(fechaD) : new Date(date.setYear(2021));
    const fechaBDhasta = fechaH ? new Date(fechaH) : new Date();
    const fecha = {$gte: fechaBDdesde, $lt:fechaBDhasta};

    if (nombre) {
        allUsers = UserModel.find({nombre: {$regex : regexName}, fecha});
        totalUsers = await UserModel.countDocuments({nombre: {$regex : regexName}, fecha})
    } else {
        allUsers = UserModel.find({fecha})
        totalUsers = await UserModel.countDocuments({fecha})
    }
    const users = await allUsers.sort({_id:-1}).limit(PAGE_SIZE).skip(PAGE_SIZE * Number(page || 0));
    
    res.json({
        totalPages: Math.ceil(totalUsers / PAGE_SIZE),
        users,
    });
});

// obtener data de usuario
router.get('/obtaindatauser/:id', isAuth, async (req, res) => {
    try {
        const user = await UserModel.findOne({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error al obtener el usuario' });
    }
});

router.patch('/updateuser/:id', isAuth, async (req, res) => {
    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { $or: [{ _id: req.params.id }, { id: req.params.id }] },
            {
                nombre: req.body.nombre,
                numRecibo: req.body.numRecibo,
                servicios: req.body.servicios,
                totalPagosEfectuar: req.body.totalPagosEfectuar,
                arancel: req.body.arancel,
                total: req.body.total,
                fecha: req.body.fecha
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
});

// Eliminar usuario
router.delete('/deleteuser/:id', isAuth, async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            console.log('Error: ID no proporcionado');
            return res.status(400).json({ error: 'ID no proporcionado' });
        }

        console.log('Intentando eliminar usuario con ID:', id);

        // Intentar eliminar usando ambos tipos de ID
        const deletedUser = await UserModel.findOneAndDelete({ 
            $or: [
                { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, 
                { id: id }
            ] 
        });
        
        if (!deletedUser) {
            console.log('Error: Usuario no encontrado para ID:', id);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('Usuario eliminado correctamente:', deletedUser);
        res.json({ 
            success: true,
            message: 'Usuario eliminado correctamente',
            deletedUser 
        });
    } catch (error) {
        console.error('Error detallado al eliminar usuario:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al eliminar el usuario',
            details: error.message 
        });
    }
});

// Modificar la ruta para enviar email (quitar el isAuth temporalmente para pruebas)
router.post('/send-pdf', async (req, res) => {
    const { pdfBase64, email, userName } = req.body;
    
    try {
        console.log('Intentando enviar email a:', email); // Para debug

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Factura - ${userName}`,
            text: 'Adjunto encontrará su factura.',
            attachments: [
                {
                    filename: `factura-${userName}.pdf`,
                    content: pdfBase64.split('base64,')[1],
                    encoding: 'base64'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        console.log('Email enviado correctamente'); // Para debug
        res.json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error detallado al enviar email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al enviar el email',
            error: error.message 
        });
    }
});