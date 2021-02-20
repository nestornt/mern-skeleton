//! Archivo con la ruta de los API endpoints
import express from '../express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.router()

// Direccion de la ruta
router.route('/api/users')
    .get(userCtrl.list)
    .post(userCtrl.create)

router.param('userId', userCtrl.userByID)

router.route('/api/users/:userId')
    .get(authCtrl.requireSignin, userCtrl.read)
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
    .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

export default router