//! Configuración de Express para aceptar peticiones HTTP

import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
//! Todas las rutas y API endpoints necesitan ser importados a Express
//! para que sean accesibles desde el lado del cliente
import userRoutes from './routes/user.routes'

const app = express()

//* Retorna el middleware que solo analiza json y solo mira al tipo de encabezado de url correcto
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
//* Analiza y/o define las cookies de las peticiones entrantes
app.use(cookieParser())
//* Comprime el body de las respuestas que pasen a traves del middleware
app.use(compress())
//* Colección de funciones middlware para ayudar a express con la seguridad de las apps configurando
//* varios tipos de http headers
app.use(helmet())
//* Middleware que habilita el cross-origin resource sharing (CORS)
app.use(cors())

//* Retorna la plantilla HTML base al hacer peticiones GET
app.get('/', (req, res) => {
    res.status(200).send(Template())
})

//app.use('/', userRoutes)

export default app