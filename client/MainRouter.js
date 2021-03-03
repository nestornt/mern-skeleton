import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home'

const MainRouter = () => {
    return (
        <div>
            {/* El componente Switch sólo renderiza el primer hijo que coincida con la ruta demandada
            para evitar el rendrizado de otras rutas que puedan coincidir */}
            <Switch>
                <Route exact path="/" component={Home}/>
            </Switch>
        </div>
    )
}

export default MainRouter