const mongoose = require('mongoose');
const { serializeUser } = require('passport');
const ZonasSchema = new mongoose.Schema({
    nombre: {
        type:  String,
        required: true
    },
    imagen: {
        type:  String,
    },
    descripcion: {
        type:  String,
    }

})
    
const zonas = mongoose.model('zonas', ZonasSchema)
module.exports = zonas;