const mongoose = require('mongoose')

const lombaSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    address:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: String,
        required: true,
        minlength:12
    },
    status:{
        type: String,
        required: true,
    },
    school:{
        type: String,
        required: true
    },
    registredBy:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'user'
    }
},{
    timestamps:true
})

const LombaModel = mongoose.model('lomboa',lombaSchema)

module.exports = LombaModel