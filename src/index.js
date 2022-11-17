const express = require('express')
const app = express()
const path = require('path'); //Módulo de node para reconocer directorios del sistema en el que se encuentra (Windows o Linux)
const methodOverride = require("method-override")
const bodyParser = require("body-parser");
const { Schema, model } = require('mongoose'); //Módulo para usar MongoDB
const flash = require('connect-flash') //Módulo flash 
const passport = require('passport') //Módulo para Autenticar
const morgan = require('morgan') //Módulo para metodos https
const session = require('express-session') //Módulo session
const cookieParser = require('cookie-parser') //Módulo para administrar Cookies
const { body, validationResult } = require('express-validator') //Módulo express-validator
const formidable = require('formidable'); //Módulo para formularios
const fs = require('fs') //Módulo para guardar imagenes
//Configuraciones
let port = process.env.PORT || 3000; //Conectarnos al puerto 3000
app.listen(port) 

console.log("Corriendo en el puerto  " + port)
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set("view engine","ejs") //Permitir el uso de ejs


app.use(methodOverride('_method')); //Función de express
app.use(cookieParser()) //Uso de cookie parser
app.use(bodyParser.urlencoded({ extended: false })) 

require('dotenv').config({ //Dotenv para variables  de entorno
  path: path.resolve(__dirname, './sessionconfig.env')
})

//Sistema de login
app.use(
  session({
    secret: "gonzaahre",
    resave: false,
    saveUninitialized: false,
 
  }))
app.use(flash());

app.use(passport.initialize())
app.use(passport.session())

//Usuario interno tomando datos de mongodb
passport.serializeUser((user, done) => done(null, { id: user.id, name: user.name, email: user.email }))
passport.deserializeUser(async (user, done) => {
  const userDB = await usuarios.findById(user.id)
  return done(null, { id: userDB.id, name: userDB.name, email: userDB.email, admin: userDB.admin })
})

//Archivos estáticos
app.use(require('./routes/'));
app.use(express.static(path.join(__dirname, 'public')));
require("./config/database.js")


const usuarios = require('./models/usuarios.js');

app.post("/login/register", [
    body("nameREG", "Ingrese un nombre válido").trim().notEmpty().escape(),
    body("emailREG", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("passREG", "Ingrese minimo 6 caracteres")
      .trim() //Elimina espacios en blanco
      .isLength({ min: 6 }) //Minimo 6 caracteres
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.pass2REG) { //Validación  de dos contraseñas
          throw new Error('No coincide las contraseñas')
        }
        else {
          return value;
        }
      })
  ],
  
    async function (req, res) {
 
      const errors = validationResult(req)
      console.log(errors)
      if (!errors.isEmpty()) {
        req.flash("mensajes", errors.array())
       
        return res.redirect('/login')
      }
  
      const { nameREG, emailREG, passREG } = req.body;
      try {
        let userExistente = await usuarios.findOne({ email: req.body.emailREG }) //Validación en mongodb si ya existe el usuario
        if (userExistente) {
          throw new Error('Usuario ya existe')
        }
        else {
          let nuevoUsuario = new usuarios({ //Guardar nuevo usuario
            name: nameREG, email: emailREG, pass: passREG, admin: false
          });
          nuevoUsuario.save();
          res.redirect('/')
        }
      }
      catch (Error) {  //Errores
        req.flash("mensajes", [{ msg: Error.message }])
        console.log('error')
        return res.redirect('/login')
      }
    })


    
app.post("/login/auth", [
    body("emailLOG", "Ingrese un email válido").trim().isEmail().normalizeEmail() //Validar email
  ], async function (req, res) {
    const errors = validationResult(req)

    console.log(errors)
    if (!errors.isEmpty()) {
      req.flash("mensajes", errors.array())
      return res.redirect('/login')
    }
  
    const { emailLOG, passLOG } = req.body
  
    try {
      const user = await usuarios.findOne({ email: emailLOG })
      if (!user) throw new Error('Usuario no existente') //Validar existencia de usuario
  
      if (!(await user.comparePass(passLOG))) {
        throw new Error('Contraseña incorrecta') //Validar contraseña
      }
      else {
        req.login(user, function (err) {
          if (err) throw new Error('Error al crear la sesión') //Error del servidor


          return res.redirect('/')
        })
  
      }
    } catch (Error) {
      req.flash("mensajes", [{ msg: Error.message }])
      return res.redirect('/login')
      // res.json({ Error: Error.message })
    }
  })