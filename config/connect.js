const mongoose=require('mongoose');// yconnecti bin mongodb w node js

mongoose.connect('mongodb://127.0.0.1:27017/app').then(
    ()=>{
        console.log('connected');
    }
).catch(
    (err)=>{
        console.log(err);
    }
)


module.exports=mongoose;