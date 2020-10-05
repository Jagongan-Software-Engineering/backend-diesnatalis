const UserController = require('../controllers/user.controller')
const express = require('express')
const UserRoute = express()
const router = express.Router()

router.post('/register',UserController.registerUser)
router.post('/signin',UserController.signIn)
router.get('/verifyemail/:id',UserController.verifyEmail)

UserRoute.use('/user',router)

module.exports = UserRoute