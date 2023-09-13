const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://hidopi:SsTxf6X4b0pCcYSB@mycraclusterdev.hu0dhsd.mongodb.net/mycra_dev?retryWrites=true&w=majority').then(
    ()=>{
        console.log('connected');
    }
).catch(
    (err)=>{
        console.log(err);
    }
)


module.exports=mongoose;