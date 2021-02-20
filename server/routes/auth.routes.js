import express from 'express'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()
//* Una solicitud via POST a la ruta signin o una solicitud GET a signout
//* llamarán a sus correspondientes funciones en el controlador auth.controller
router.route('/auth/signin').post(authCtrl.signin)
router.route('/auth/signout').get(authCtrl.signout)

export default router