const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const isAuth = require('../isAuth')

router.get('/', isAuth, async (req, res,) => {
    try {
        res.json({message:'Estás en sesion'})
        
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body
        
        if (email !== 'tramitespronto@gmail.com' || password !== '123456') {
            res.status(401).json('Ese usuario no es el usuario maestro');
            return;
        }
        
        const key = process.env.JWT_KEY || ''
        const token = jwt.sign({msg:'tramites pronto'}, key, {
            expiresIn:"24h"
        })
        
        res.json({message:'Sesion iniciada', token})
        
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;