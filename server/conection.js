const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const username = process.env.MONGOUSERNAME
const userpass = process.env.MONGOPASS

mongoose.connect(`mongodb+srv://${username}:${userpass}@tramitespronto.lhncidq.mongodb.net/?retryWrites=true&w=majority`);

const objetobd = mongoose.connection

objetobd.on('connected', () => {console.log('correcta')})
objetobd.on('error', () => {console.log('fallida')})

module.exports = mongoose