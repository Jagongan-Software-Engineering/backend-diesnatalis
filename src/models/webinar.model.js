const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber:{
        type: String,
        minLength:[10,'Phone number must be at least 10 characters'],
        min:[10,'Phone number must be at least 10 characters'],
    },
    isPayed:Boolean,
    school: {
        type: String,
        required: true,
    },
    registeredBy: {
        type: mongoose.Schema.Types,
        ref:"User"
    }
},{timestamps:true})

const WebinarModel = mongoose.model("Webinar",schema)

module.exports = WebinarModel