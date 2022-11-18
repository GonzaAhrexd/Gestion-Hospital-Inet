const express = require('express')
const router = express.Router()
const { authenticate } = require('passport');

const verificarAdmin = require('../middlewares/verificarAdmin.js');
const verificarSesion = require('../middlewares/verificarSesion.js')
const usuarios = require('../models/usuarios.js')
const zonas = require('../models/zonas.js')

//Index
router.get('/', async (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }

    usuarios.find({}, function (err, pacientes) {
    
        res.render('index.html',
            {
                title: 'Inicio', 
                usuario: usuarioLogeado,
                estaLog: estaLog,
                pacientes: pacientes
            }
        )
        })
})



router.get('/perfil', verificarSesion, async (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = await usuarios.findOne({ email: req.user.email })
        estaLog = true
    }

    res.render('perfil.html',
        {
            title: 'Inicio',
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
})


router.get('/nosotros', (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }
 
    usuarios.find({}, function (err, pacientes) {
        zonas.find({}, function (err, zonas) {
        res.render('about.html',
            {
                title: 'Nosotros', 
                usuario: usuarioLogeado,
                estaLog: estaLog,
                pacientes: pacientes,
                zonas: zonas
            }
        )
    })
})
})


router.get('/doctores', (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }
    usuarios.find({}, function (err, pacientes) {
    res.render('doctors.html',
        {
            title: 'Doctores', 
            usuario: usuarioLogeado,
            estaLog: estaLog,
            pacientes: pacientes
        }
    )
})
})
router.get('/login', (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }
    res.render('login.html',
        {
            title: 'Perfil de usuario', 
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
})




router.get('/admin',  verificarAdmin, async (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }
    usuarios.find({}, function (err, pacientes) {
    zonas.find({}, function (err, zonas) {
    res.render('admin.html',
        {
            title: 'Administradores', 
            usuario: usuarioLogeado,
            estaLog: estaLog,
            pacientes: pacientes,
            zonas: zonas
        }
    )
    })
})
})



router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})


module.exports = router;