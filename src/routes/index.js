const express = require('express')
const router = express.Router()



//Index
router.get('/', (req, res) => {
   
 
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



module.exports = router;