const express = require('express')
const app = express()
const path = require('path'); //Módulo de node para reconocer directorios del sistema en el que se encuentra (Windows o Linux)

//Configuraciones
let port = process.env.PORT || 3000; //Conectarnos al puerto 3000
app.listen(port) 

console.log("Corriendo en el puerto  " + port)
app.set('views', path.join(__dirname, 'views'))
app.engine('html', require('ejs').renderFile)
app.set("view engine","ejs") //Permitir el uso de ejs

app.use(require('./routes/'));

//Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
