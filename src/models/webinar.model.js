const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    phoneNumber:{
        type: String,
        minLength:[10,'Phone number must be at least 10 characters'],
        min:[10,'Phone number must be at least 10 characters'],
    },
    status: {
        type: String,
        required: true,
    },
    school: {
        type: String,
        required: true,
    },
},{timestamps:true})

const WebinarModel = mongoose.model("Webinar",schema)

module.exports = WebinarModel