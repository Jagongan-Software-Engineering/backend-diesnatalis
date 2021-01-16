const express = require('express')
const { registerAdmin, signInAdmin, getAllWebinar,searchWebinar, updatePayedWebinar } = require('../controllers/admin.controller')
const AdmingRoute = express()
const router = express.Router()

router.post('/register',registerAdmin)
router.post('/signin',signInAdmin)
router.get('/webinars',getAllWebinar)
router.put('/webinar/payed',updatePayedWebinar)
router.get('/webinar/search/:query',searchWebinar)

AdmingRoute.use('/admin',router)

module.exports = AdmingRoute