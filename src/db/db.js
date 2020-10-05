const mongoose = require('mongoose')

mongoose.connect(process.env.MODE === 'DEVELOPMENT'?process.env.MONGODB_DEV:
process.env.MONGODB_PROD,{
    useUnifiedTopology:true,useNewUrlParser:true,useCreateIndex:true,
})
.then(()=>console.log('connected to MongoDB'))
.catch(err => console.log(err))