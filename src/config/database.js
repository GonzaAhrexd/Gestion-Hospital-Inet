const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, './dbconfig.env')
})

const mongoose = require ('mongoose')

const user = process.env.user
const pass = process.env.pass
const dbName = process.env.dbName

const uri = `mongodb+srv://${user}:${pass}@cluster0.uijihcv.mongodb.net/${dbName}?retryWrites=true&w=majority`;
 
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('Conectado a mongoDB Cloud')) 
  .catch(e => console.log('error de conexión', e))