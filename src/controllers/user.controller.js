const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model.js')
const { RegexValidation, RegexPattern } = require("regexpattern-collection").default;
const bcrypt = require('bcryptjs');
const { verifyEmail } = require('../helpers/email.js');


exports.registerUser = async (req,res)=>{
    const {name,email,address,phoneNumber,status,password} = req.body;

    if(!name || !email || !address || !phoneNumber || !status || !password){
        return res.status(400).send({
            status:false,
            message: 'Field must not be empty'
        })
    }
    const isEmailValid = RegexValidation.hasMatch(email,RegexPattern.email);
    const isPhoneNumberValid = RegexValidation.hasMatch(phoneNumber,RegexPattern.phoneNumber)

    if(!isEmailValid){
        return res.status(400).send({
            status:false,
            message: 'Email is not valid'
        })
    }else if(!isPhoneNumberValid){
        return res.status(400).send({
            status:false,
            message: 'Phone number is not valid'
        })
    }else if(password.length < 8){
        return res.status(400).send({status:false, message: 'Password length must be at least 8 characters'})
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
            email,address,status,phoneNumber,name,isEmailVerified:false
            ,password: hashedPassword
        })
        const savedUser = await user.save()
        await verifyEmail(savedUser)
        
        res.send({
            status:true,
            message:'Success, check your email  ',
            user
        })
    } catch (error) {
        if(error.errors['password']){
            return res.status(400).send({
                status:false,
                message:error.errors['password'].message
            })
        }else if(error.errors['phoneNumber']){
            return res.status(400).send({
                status:false,
                message:error.errors['phoneNumber'].message
            })
        }
        res.status(400).send({
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