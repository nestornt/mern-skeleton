import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import Menu from './core/Menu'

const MainRouter = () => {
    return (
        <div>
            {/* Añadimos el menu antes que el resto de rutas para que se muestre en la parte superior */}
            <Menu/>
            {/* El componente Switch sólo renderiza el primer hijo que coincida con la ruta demandada
            para evitar el rendrizado de otras rutas que puedan coincidir */}
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route path="/users" component={Users}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/signin" component={Signin}/>
                {/* La ruta privada se define antes ya que edit deriva de user para
                 que no se confunda con esta y se buscada antes dentro del Switch */}
                <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
                <Route path="/user/:userId" component={Profile}/>
            </Switch>
        </div>
    )
}

export default MainRouter