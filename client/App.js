//! Este componente contiene todos los componentes para el frontend de la app.
import React from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import { hot } from 'react-hot-loader'

const App = () => {

    //! Indicamos a useEffect que borre el código injectado por el servidor duarnte el 'server render'
    //! una vez que el componente raíz se haya montado.
    React.useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side')
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles)
        }
    }, [])

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <MainRouter/>
            </ThemeProvider>
        </BrowserRouter>
    )
}
//? Usa higher-order component ( HOC ) para exportar el componente como hot para que habilite hot-reload
export default hot(module)(App)

//* ThemeProvider Da acceso al tema de Material-UI
//* Las variables definidas en "theme" son pasadas cómo props para que sean aplicadas