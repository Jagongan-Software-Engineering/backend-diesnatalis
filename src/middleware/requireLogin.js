const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

module.exports = async (req, res,next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(500).send({
            status:false,message:'You must be log in'
        })
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token,process.env.SECRET_KEY,(err,result)=>{
        if(err){
            res.status(500).send({
                status:false,message:err.message
            })  
        }
        const {_id} = result;
        UserModel.findById({_id}).then((user) => {
            if(user == null) {
                res.status(500).send({
                    status:false,message:'User not exists'
                })
            }
            user.password = undefined;
            req.user = user;
            next()
        }).catch(err =>{
            res.status(500).send({
                status:false,message:err
            })  
        })
    })
}