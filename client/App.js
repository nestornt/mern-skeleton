//! Este componente contiene todos los componentes para el frontend de la app.
import React from 'react'
import MainRouter from './MainRouter'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'
import { hot } from 'react-hot-loader'

const App = () => {
    return (
        //* Habilita frontend routing mediante React Router
        <BrowserRouter>
            //* Da acceso al tema de Material-UI
            //* Las variables definidas en "theme" son pasadas cómo props para que sean aplicadas
            <ThemeProvider theme={theme}>
                //* Componente principal envuelto de las funcionalidades anteriores
                <MainRouter/>
            </ThemeProvider>
        </BrowserRouter>
    )
}
//? Usa higher-order component ( HOC ) para exportar el componente como hot para que habilite hot-reload
export default hot(module)(App)