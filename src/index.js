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
            name: nameREG, email: emailREG, pass: passREG, admin: false, rol: 'paciente'
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

  app.post("/perfil/edicion/:id", async function (req, res) {

    try {
      await usuarios.findByIdAndUpdate(req.params.id, {  //Editar campos del perfil
        nombreCompleto: req.body.nombreCompleto.trim(),
        telefono: req.body.telefono.trim(),
        direccion: req.body.direccion.trim(),
        postal: req.body.postal.trim(),
        provincia: req.body.provincia.trim(),
        localidad: req.body.localidad.trim(),
        sangre: req.body.sangre.trim(),
        patologias: req.body.patologias.trim(),
        especialidad: req.body.especialidad.trim(),
      })
      res.redirect('/perfil')
    }
    catch (error) {
      console.log(req.body)
      return res.redirect('/')
  
    }
  })

  app.post("/perfil/imagen", function (req, res) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
    //Subir imagenes con el campo de files
      try {
        if (err) {
          throw new Error("Falló")
        }
  
        const file = files.imagen
      
        if (file.originalFilename === "") { //Validación si no se sube archivos
          throw new Error("Agrega una imagen para continuar")
        }
        if (!(file.mimetype === "image/jpeg" || file.mimetype === "image/png")) { //Formatos válidos
          throw new Error("Formato no válido, prueba con .png o .jpg")
        }
  
        if (file.size > 50 * 1024 * 1024) { //Tamaño máximo de 50mb
          throw new Error("Ingrese un archivo de menos de 50mb")
        }
        let separado = file.mimetype.split("/");
        let formato = separado[1];
        let dirFile = path.join(__dirname, `./public/img/perfiles/${req.user.id}.${formato}`) //crear la  ruta para guardar la imagen
  
        fs.copyFile(file.filepath, dirFile, function (err) {
          if (err) throw err;
        }); //Copiar archivo desde la ruta original al servidor
        req.flash("mensajes", [{ msg: "Archivo subido" }]) 
        let nuevo = req.user.id+'.'+formato //Guardar nombre de la imagen para pasarlo a la base de datos
        await usuarios.findByIdAndUpdate(req.user.id, { //Guardar producto en mongodb
          imagen: nuevo,
        });
      }
      catch (error) {
        req.flash("mensajes", [{ msg: error.message }]) //Devolver cualquier error
      }
      finally {
        res.redirect('/perfil') //Redireccionar al panel de admin
      }
    })
  })

  app.post("/asignar/medico/:id", async function (req, res) {

    try {
    
      await usuarios.findByIdAndUpdate(req.params.id, {  //Editar campos del perfil
        enfermeroAsignado: req.body.medico
      })
      res.redirect('/admin')
    }
    catch (error) {
  
      return res.redirect('/')
  
    }
  })

  app.post("/medicos/agregar", async function (req, res) {

    try {
    
      await usuarios.findOneAndUpdate({email: req.body.email}, {  //Editar campos del perfil
        rol: "medico"
      })
      res.redirect('/admin')
    }
    catch (error) {
  
      return res.redirect('/')
  
    }
  })

  app.post("/medicos/eliminar/:id", async function (req, res) {

    try {
    
      await usuarios.findByIdAndUpdate(req.params.id, {  //Editar campos del perfil
        rol: "paciente"
      })
      res.redirect('/admin')
    }
    catch (error) {
  
      return res.redirect('/')
  
    }
  })

  app.post("/admin/agregar", async function (req, res) {

    try {
    
      await usuarios.findOneAndUpdate({email: req.body.email}, {  //Editar campos del perfil
        admin: true
      })
      res.redirect('/admin')
    }
    catch (error) {
  
      return res.redirect('/')
  
    }
  })

  
  app.post("/admin/eliminar/:id", async function (req, res) {

    try {
    
      await usuarios.findByIdAndUpdate(req.params.id, {  //Editar campos del perfil
        admin: false
      })
      res.redirect('/admin')
    }
    catch (error) {
  
      return res.redirect('/')
  
    }
  })

  const zonas = require('./models/zonas.js');

  app.post("/zonas/agregar", function (req, res) {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
    //Subir imagenes con el campo de files
      try {
        if (err) {
          throw new Error("Falló")
        }
        let zonaExistente = await zonas.findOne({ nombre: fields.nombre })
        if (zonaExistente) {
          throw new Error('Producto ya existente')
        }
  
        const file = files.imagen
      
        if (file.originalFilename === "") { //Validación si no se sube archivos
          throw new Error("Agrega una imagen para continuar")
        }
        if (!(file.mimetype === "image/jpeg" || file.mimetype === "image/png")) { //Formatos válidos
          throw new Error("Formato no válido, prueba con .png o .jpg")
        }
  
        if (file.size > 50 * 1024 * 1024) { //Tamaño máximo de 50mb
          throw new Error("Ingrese un archivo de menos de 50mb")
        }
        let dirFile = path.join(__dirname, `./public/img/zonas/${file.originalFilename}`) //crear la  ruta para guardar la imagen
  
        fs.copyFile(file.filepath, dirFile, function (err) {
          if (err) throw err;
        }); //Copiar archivo desde la ruta original al servidor
        req.flash("mensajes", [{ msg: "Archivo subido" }]) 
        let nuevo = files.imagen.originalFilename //Guardar nombre de la imagen para pasarlo a la base de datos
        let nuevaZona = new zonas({ //Guardar producto en mongodb
          nombre: fields.nombre,
          imagen: nuevo,
          descripcion: fields.descripcion
        });
        nuevaZona.save();
      }
      catch (error) {
        req.flash("mensajes", [{ msg: error.message }]) //Devolver cualquier error
      }
      finally {
        res.redirect('/admin') //Redireccionar al panel de admin
      }
    })
  })

  

  const eliminarZonas = async (req, res) => { 
    await zonas.findByIdAndDelete(req.params.id);
    res.redirect("/admin")
  };
  
  app.post('/zonas/eliminar/:id', eliminarZonas)
