const nodemailer = require('nodemailer')
const verifyEmailTemplate = require('./template/verifyEmailTemplate')

exports.verifyEmail = (data) => {
    const transporter = nodemailer.createTransport({
        service:'gmail',    
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        },
    })
    const mailOptions = {
        from:'DiesNatalis <febrymuhammad80@gmail.com>',
        to: `${data.name} <${data.email}>`,
        subject: 'Email Verification',
        html: `${verifyEmailTemplate(data)}`
    }
    transporter.sendMail(mailOptions,(err,response) =>{
        if(err) {
            console.log(err);
        }else{
            console.log('email sent to : '+response);
        }
    })
}