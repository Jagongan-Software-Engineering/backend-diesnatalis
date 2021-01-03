const UserController = require('../controllers/user.controller')
const express = require('express')
const requireLogin = require('../middleware/requireLogin')
const UserRoute = express()
const router = express.Router()

router.post('/register',UserController.registerUser)
router.post('/signin',UserController.signIn)
router.get('/verifyemail/:id',UserController.verifyEmail)
router.get('/info',requireLogin,UserController.getUserInfo)
router.post('/registerlomba',requireLogin,UserController.registerLomba)

UserRoute.use('/user',router)

module.exports = UserRoute