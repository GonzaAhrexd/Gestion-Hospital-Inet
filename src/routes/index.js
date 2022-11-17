const express = require('express')
const router = express.Router()
const { authenticate } = require('passport');

const verificarAdmin = require('../middlewares/verificarAdmin.js');
const verificarSesion = require('../middlewares/verificarSesion.js')

//Index
router.get('/', async (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }

    res.render('index.html',
        {
            title: 'Inicio',
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
})


const usuarios = require('../models/usuarios.js')
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
 
    res.render('about.html',
        {
            title: 'Nosotros', 
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
})


router.get('/doctores', (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }
 
    res.render('doctors.html',
        {
            title: 'Doctores', 
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
})

router.get('/blog', (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }
    res.render('blog.html',
        {
            title: 'Blogs', 
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
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
            title: 'Blogs', 
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
})

router.get('/contacto', (req, res) => {
    let usuarioLogeado = " "
    let estaLog = false
    if (req.isAuthenticated()) {
        usuarioLogeado = req.user
        estaLog = true
    }
    res.render('contact.html',
        {
            title: 'Blogs', 
            usuario: usuarioLogeado,
            estaLog: estaLog
        }
    )
})


module.exports = router;