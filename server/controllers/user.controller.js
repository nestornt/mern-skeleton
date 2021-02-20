//! Archivo con todos los middlwares para validar o mostrar datos
import User from '../models/user.model'
// Este modulo se usa cuando se actualiza un usuario existente con nuevos valores
import extend from 'lodash/extend'
// Este modulo se usa para gestionar los errores dentro del catch
import errorHandler from '../helpers/dbErrorHandler'

const create = async (req, res) => {
    //? req.body hace referencia a los parametros pasados por POST del lado del cliente
    //? Si la promesa dentro de la función generara cualquier error se ejecutará el "catch"
    const user = new User(req.body)
    try {
        //? Espera a que moongose haya validado los datos para guardarlos
        //? save() retorna una promesa, la funcion esperará a que se resuelva
        await user.save()
        return res.status(200).json({
            message: "Succesfully signed up!"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
//? Esta función muestra todos los usuarios de la bd con el nombre, email, fecha creación y fecha actualización
//? Y retorna la lista de usuarios en formato json mediante un array de objetos json
const list = async (req, res) => { 
    try {
        //? Llama al metodo find que mongoose.schema incorpora
        let users = await User.find().select('name email uptated created')
        res.json(users)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}
const userByID = async (req, res, next, id) => { 
    try {
        //? Llama al método findbyid que moongose.schema incorpora por defecto
        let user = await User.findById(id)
        if (!user)
            return res.status('400').json({
                error: "User not found"
            })
        req.profile = user
        // next llama a la siguiente función / middlware cuando esta haya terminado (Convención de NodeJS) 
        // Es cómo una respuesta que Express usa después de que cierta parte del código termine.
        // Este middleware se puede usar para asegurar que la parte del código ha sido terminada 
        // y propagar el control al siguiente controlador que se deba ejecutar (read, update o remove)
        next()
    } catch (err) {
        return res.status('400').json({
            error: "Could not retrieve user"
        })
    }
}

const read = (req, res) => {
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}

const update = async (req, res) => { 
    try {
        // Recupera el usuario
        let user = req.profile
        // Se usa el modulo loadash para guardar en una variable los datos que serán actulizados
        user = extend(user, req.body)
        // Se le añade la fecha a los datos antes de ser guardados en la bd
        user.updated = Date.now()
        await user.save()
        // No se envian los datos críticos cómo respuesta al usuario
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const remove = async (req, res) => {
    try {
        let user = req.profile
        // Borra el usurio en la bd
        let deletedUser = await user.remove()
        deletedUser.hashed_password = undefined
        deletedUser.salt = undefined
        // Si se ha borrado el dato con exito se le devuelve al usuario
        res.json(deletedUser)

    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

export default { create, userByID, read, list, remove, update }