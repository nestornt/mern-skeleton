//! Configuración de Express para aceptar peticiones HTTP
import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import Template from './../template'
// Todas las rutas y API endpoints necesitan ser importados a Express
// para que sean accesibles desde el lado del cliente
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
//! Modulos para el renderizado del servidor
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import StaticRouter from 'react-router-dom/StaticRouter'
import MainRouter from './../client/MainRouter'

import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles'
import theme from './../client/theme'

//! Comentar esta línea antes de preparar el código para producción
import devBundle from './devBundle'

const CURRENT_WORKING_DIR = process.cwd()
const app = express()

//! Comentar esta línea antes de preparar el código para producción
devBundle.compile(app)

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

//* Rutas de usuario
app.use('/', userRoutes)
//* Rutas de usuario protegidas
app.use('/', authRoutes)

//* Retorna la plantilla HTML base al hacer peticiones GET
app.get('*', (req, res) => {
    //? 1. Genera los stilos CSS usando Material-UI's ServerStyleSheets generando una instancia de este
    const sheets = new ServerStyleSheets()
    // Crea un objeto de Javascript
    const StaticContext = {}
    
    //? 2. Usa renderToString para generar el HTML el cual renderiza los componentes especificos de la ruta solicitada
    // Al reenderizar el arbol de React, el componente raíz MainRouter, es envuelto por el ThemeProvider de 
    // Material-UI para proveer las props de estilo que son demandadas por los componentes hijos de MainRouter
    const html = ReactDOMServer.renderToString(
      sheets.collect(
            <StaticRouter location={req.url} context={StaticContext}>
              <ThemeProvider theme={theme}>
                <MainRouter />
              </ThemeProvider>
            </StaticRouter>
          )
      )
      // Verificamos si hubo una redirección durante el render en el componente enviado en el html
      // Este caso se ejecutaría al intentar acceder a una ruta privada durante un rendreizado del server
      if (StaticContext.url) {
        return res.redirect(303, StaticContext.url)
      }
      const css = sheets.toString()
      //? 3. Retorna la plantilla con HTML y CSS en respuesta
      res.status(200).send(Template({
        html: html,
        css: css
      }))
})

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