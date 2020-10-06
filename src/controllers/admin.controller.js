const AdminModel = require("../models/admin.model");
const {  RegexValidation,RegexPattern  } = require("regexpattern-collection").default;
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.registerAdmin = async (req, res) => {
    const {fullName, email,password} = req.body;

    if(!fullName || !email || !password)return res.status(400).send({status:false,message:'Filed must not be empty'})

    const isEmailValid = RegexValidation.hasMatch(email,RegexPattern.email)

    if(!isEmailValid)return res.status(400).send({status:false,message:'Email is not valid'})

    try {
        const isAdminExist = await AdminModel.findOne({email})
        if(isAdminExist)return res.status(400).send({status:false,message:'Email is already used'})

        const hashedPassword = await bcrypt.hash(password,12)
        
        const newAdmin = await new AdminModel({fullName, email,password:hashedPassword}).save()

        res.send({status:true,message:'success',admin:newAdmin})
    } catch (error) {
        return res.status(400).send({
            status:false,message:error
        })
    }
}

exports.signInAdmin = async (req, res) => {
    const {email,password} = req.body;

    if(!email || !password)return res.status(400).send({status:false,message:'Email or Password must not be empty'})

    try {
        const admin = await AdminModel.findOne({email: email},)
        const hashedPassword = await bcrypt.compare(password,admin.password)
    
        if(!hashedPassword)return res.status(400).send({status:false,message:'Email and Password does not match'})
    
        const id = admin.id;
        const token = await jwt.sign({id},process.env.SECRET_KEY)
        admin.password = undefined;
        res.send({status:true,message:'success',token,admin})
    } catch (error) {
        return res.status(400).send({status:false,message:error})
    }
}