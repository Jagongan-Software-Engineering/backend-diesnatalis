const mongoose = require('mongoose')

const adminSchema = mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},{timestamps:true})

const AdminModel = mongoose.model('Admin',adminSchema)

module.exports = AdminModel