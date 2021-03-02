import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJWt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
    try {
        let user = await User.findOne({ "email": req.body.email })
    
        if(!user)
            return res.status('401').json({ error: "User not found." })

        if(!user.authenticate(req.body.password))
            return res.status('401').send({ error: "Email and password don't match." })

        //? Si la password se ha validado satisfactoriamente el módulo jwt genera una 
        //? firma jwt usando una clave secreta y el valor del id de usuario
        //? El jwt firmado es devuelto al cliente autorizado con sus detalles de usuario pertinentes
        const token = jwt.sign({ _id: user._id}, config.jwtSecret)
        //? Opcionalmente se puede asignar el token a una cookie el objeto de la respuesta
        //? para que esté disponible en el lado del cliente si las cookies son la forma elegida
        //? de alamacenamiento jwt
        res.cookie('t', token, { expire: new Date() + 9999 })
        
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        })
        
    } catch (err) {
        return res.status('401').json({ error: "Could not sig in"})
    }
}

const signout = (req, res) => {
    //* Borra la cookie con el jwt firmado del cliente en cuestión
    res.clearCookie("t")
    return res.status('200').json({
        message: "signed out"
    })
}

const requireSignin = expressJWt({
    //* Configura req.auth
    secret: config.jwtSecret,
    algorithms: ['HS256'],
    userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
    //? req.auth es definido por express-jwt en requireSignin después de la autenticación de usuario
    //? req.profile es definido por la función userByID en user.controller.js
    const authorized = req.profile && req.auth
            && req.profile._id == req.auth._id
    if (!(authorized)) {
        return res.status('403').json({
            error: "User is not authorized"
        })
    }
    next()
}

export default {signin, signout, requireSignin, hasAuthorization}