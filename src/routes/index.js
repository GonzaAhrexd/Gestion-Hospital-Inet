const express = require('express')
const router = express.Router()
const { authenticate } = require('passport');

const verificarAdmin = require('../middlewares/verificarAdmin.js');
const verificarSesion = require('../middlewares/verificarSesion.js')

//Index
router.get('/', verificarSesion, async (req, res) => {
   
    console.log(req.user.name)
 

    res.render('index.html',
        {
            title: 'Inicio', 
        }
    )
})

router.get('/nosotros', (req, res) => {
   
 
    res.render('about.html',
        {
            title: 'Nosotros', 
        }
    )
})


router.get('/doctores', (req, res) => {
   
 
    res.render('doctors.html',
        {
            title: 'Doctores', 
        }
    )
})

router.get('/blog', (req, res) => {
    res.render('blog.html',
        {
            title: 'Blogs', 
        }
    )
})

router.get('/login', (req, res) => {
    res.render('login.html',
        {
            title: 'Blogs', 
        }
    )
})


module.exports = router;