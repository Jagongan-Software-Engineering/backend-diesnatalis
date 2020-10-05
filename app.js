const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000 || process.env.PORT
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const UserRoute = require('./src/routes/user.route')

require('dotenv').config()
require('./src/db/db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload())

app.use(cors())

app.use(UserRoute)

app.listen(port, ()=>{
    console.log(`Server listening on port ${port}`);
})
