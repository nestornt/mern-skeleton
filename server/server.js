//! Configuración del servidor para escuchar peticiones HTTP

//Importa la configuración para escuchar por el numero de puerto definido
import config from './../config/config'
//Importa la configuración de Express
import app from './express'
import mongoose from 'mongoose'

//Configura mongodb para usar ES6 promesas
mongoose.Promise = global.Promise

mongoose.connect(config.mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on('error', () => {
    throw new Error(`Unable to connect to the database: ${mongoUri}`)
})

app.listen(config.port, (err) => {
  if (err) {
    console.log(err)
  }
  console.info('Server started on port %s.', config.port)
})