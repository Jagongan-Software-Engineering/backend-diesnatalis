const AdminModel = require("../models/admin.model");
const {  RegexValidation,RegexPattern  } = require("regexpattern-collection").default;
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const WebinarModel = require("../models/webinar.model")

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

exports.getAllWebinar = async (req, res) => {
    try {
        const webinar = await WebinarModel.find();
        return res.send({status:false,message:'success',data:webinar})
    } catch (error) {
        return res.status(400).send({status:false,message:error})
    }
}

exports.updatePayedWebinar = async (req, res) => {
    const email = req.body.email;
    try {
        const webinar = await WebinarModel.findOne({'registeredBy.email':email});
        console.log(email);
        if(!webinar){
            return res.status(404).send({status:false,message:'user not exits'})
        }
        await webinar.updateOne({isPayed:true})
        return res.status(200).send({status:true,message:'success'})
    } catch (error) {
        return res.status(400).send({status:false,message:error})
    }
}

exports.searchWebinar = async (req, res) =>{
    const query = req.params.query;
    try {
        const webinar = await WebinarModel.find({'registeredBy.email':query})
        if(webinar.length == 0) {
            return res.status(404).send({status:false,message:'Email Not Found',data:[]})
        }
        return res.status(200).send({status:true,message:'success',data:webinar})
    } catch (error) {
        return res.status(400).send({status:false,message:error})
    }
}