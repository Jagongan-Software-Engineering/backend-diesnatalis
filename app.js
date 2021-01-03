const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const UserRoute = require('./src/routes/user.route')
const AdmingRoute = require('./src/routes/admin.routes')
const requireLogin = require('./src/middleware/requireLogin')

require('dotenv').config()
require('./src/db/db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload())

app.use(cors())

app.use(UserRoute)
app.use(AdmingRoute)
app.get('/test',requireLogin,(req,res) =>{
    res.send({
        message:'berhasil',
        user : req.user
    })
})

app.use('/',(req,res) =>{
    res.send('welcome to diesnatalis API')
})

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})
