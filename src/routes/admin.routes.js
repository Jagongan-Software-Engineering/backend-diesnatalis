const express = require('express')
const { registerAdmin, signInAdmin } = require('../controllers/admin.controller')
const AdmingRoute = express()
const router = express.Router()

router.post('/register',registerAdmin)
router.post('/signin',signInAdmin)

AdmingRoute.use('/admin',router)

module.exports = AdmingRoute