const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model.js')
const { RegexValidation, RegexPattern } = require("regexpattern-collection").default;
const bcrypt = require('bcryptjs');
const { verifyEmail } = require('../helpers/email.js');
const WebinarModel = require('../models/webinar.model.js')

exports.registerUser = async (req,res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.status(400).send({
            status:false,
            message: 'Field must not be empty'
        })
    }
    const isEmailValid = RegexValidation.hasMatch(email,RegexPattern.email);
    const isPasswordValid = RegexValidation.hasMatch(password,RegexPattern.passwordModerate);

    if(!isEmailValid){
        return res.status(400).send({
            status:false,
            message: 'Email is not valid'
        })
    }if(!isPasswordValid){
        return res.status(400).send({status:false, message: 'Should have 1 lowercase letter, 1 uppercase letter, 1 number and be at least 8 characters long'})
    }

    try {
        const isUserExists = await UserModel.findOne({email:email});
        if(isUserExists){
            return res.status(400).send({
                status:false,
                message: 'Email already used'
            })
        }
        const hashedPassword = await bcrypt.hash(password,12)

        const user = new UserModel({
            email,address:'',status:'',phoneNumber:'',name,isEmailVerified:false
            ,password: hashedPassword,member2:'',member3:'',
        })
        const savedUser = await user.save()
        await verifyEmail(savedUser)
        
        res.send({
            status:true,
            message:'Success, check your email  ',
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            status:false,
            message:error
        })
    }
}

exports.signIn = async(req, res) => {
    const {email,password} = req.body;

    const isEmailValid = RegexValidation.hasMatch(email,RegexPattern.email);
    if(!isEmailValid){
        return res.status(400).send({
            status:false,
            message: 'Email is not valid'
        })
    }

    if(!email || !password){
        return res.status(400).send({
            status:false,
            message: 'Field must not be empty'
        })
    }

    try {
        const user = await UserModel.findOne({email:email});
        if(!user)return res.status(400).send({status:false,message:'User not exists' });

        const hashedPassword = await bcrypt.compare(password,user.password)
        
        if(!hashedPassword){
            return res.status(422).send({status:false,message:'Email or Password incorrect'})
        }
        if(!user.isEmailVerified){
            return res.status(400).send({status:false,message:'Email is not verified'})
        }
        const {_id} = user;
        const token = await jwt.sign({_id},process.env.SECRET_KEY)
        res.send({
            status:true,
            message:'Success',
            token,
            user
        })
    } catch (error) {
        res.status(400).send({status:false, message:error})
    }
}

exports.verifyEmail = async (req, res) => {
    const {id} = req.params;

    try {
        const user = await UserModel.findById(id)
        await user.updateOne({isEmailVerified: true})
        
        res.send('Email Verification Success')
    } catch (error) {
        res.send(error)
    }
}

exports.getUserInfo = async (req, res) => {
    return res.status(200).send({
        status:true,
        message: 'get user success',
        user:req.user
    })
}

exports.registerLomba = async (req,res) => {
    const {name,address,phoneNumber,status,school} = req.body;
    if(!name || !address || !phoneNumber || !status || !school){
        return res.status(400).send({status:false,message:'field must not be empty'})
    }
    const isPhoneNumberValid = RegexValidation.hasMatch(phoneNumber,RegexPattern.phoneNumber)
    if(!isPhoneNumberValid){
        return res.status(400).send({status:false,message:'phone number is not valid'})
    }
    try {
        await UserModel.findByIdAndUpdate({_id:req.user._id},{
            name,address,phoneNumber,status,school
        })
        return res.status(200).send({
            status:true,message:'register success',
        })
    } catch (error) {
        return res.status(400).send({status:false,message:error})
    }
}

exports.registerWebinar = async (req, res) => {
    const {name,phoneNumber,school} = req.body;
    if(!name || !phoneNumber || !school){
        return res.status(400).send({status:false,message:'field must not be empty'})
    }
    const isPhoneNumberValid = RegexValidation.hasMatch(phoneNumber,RegexPattern.phoneNumber)

    if(!isPhoneNumberValid){
        return res.status(400).send({status:false,message:'phone number not valid'})
    }
    const isExist = await WebinarModel.findOne({'registeredBy.email':req.user.email})
    if(isExist){
        return res.status(400).send({status:false,message:'Email already registered'})
    }
    try {
        const user = {
            ...req.user,
            password:undefined,
            member2:undefined,
            member3:undefined,
            __v:undefined,
        }
        const webinar = new WebinarModel({
            name,phoneNumber,school,isPayed:false,
            registeredBy:user
        });
        await webinar.save();
        res.send(webinar)
    } catch (error) {
        return res.status(400).send({status:false,message:error})
    }
}