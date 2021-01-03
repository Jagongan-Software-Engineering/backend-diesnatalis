const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        minLength:[10,'Phone number must be at least 10 characters'],
        min:[10,'Phone number must be at least 10 characters'],
    },
    status: {
        type: String,
    },
    isEmailVerified: Boolean,
    password: {
        type:String,
        required: true,
        minlength: [8,'Password length must be at least 8 characters'],
    },
    school:{
        type:String,
    },
    member2:{
        type:String,
    },
    member3:{
        type:String,
    },

    
},{timestamps:true})

const UserModel = mongoose.model('User',schema)

module.exports = UserModel;