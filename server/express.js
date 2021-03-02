//! Configuración de Express para aceptar peticiones HTTP
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
//! Todas las rutas y API endpoints necesitan ser importados a Express
//! para que sean accesibles desde el lado del cliente
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
//! Comentar esta línea antes de preparar el código para producción
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//! Comentar esta línea antes de preparar el código para producción
devBundle.use(app)

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
//* Cuando Express recive una peticion a la ruta /dist, sabrá que archivo estático servir
//* cómo respuesta buscando en la carpeta dist
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')))

//* Retorna la plantilla HTML base al hacer peticiones GET
app.get('/', (req, res) => {
    res.status(200).send(Template())
})
//* Rutas de usuario
app.use('/', userRoutes)
//* Rutas de usuario protegidas
app.use('/', authRoutes)

app.use((err, req, res, next) => {
    //? express-jwt genera un error llamado UnauthorizedError cuando un token
    //? no puede ser validado por algún motivo, hay que controlar el error para 
    //? devolver un status 401 al cliente
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"error": err.name + ": " + err.message})
    } else if (err) {
        //? Esto se ejecuta si otros errores son generados
        res.status(400).json({"error" : err.name + ": " + err.message})
        console.log(err)
    }
})

export default app