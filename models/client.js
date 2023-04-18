const mongoose=require('mongoose');


const Client=mongoose.model('Client',{
    nomSocial:{
        type:String,
        
    } ,
    responsable:{
        type:String,
    },
    NSiret:{
        type:String,
    },
    adressePostale:{
        type:String,
    } ,
    email:{
        type:String,
        required:"Email is required",
        unique:true
    } ,
    tel1:{
        type:Number,
        
    } ,
    tel2:{
        type:Number,
        
    },
    ville:{
        type:String
    },
    codePostal:{
        type: Number
    },
    dateSignature:{
        type:Date,
    },
    note:{
        type:String,
    },
    competences:{
        type:String,
    },
    document:{
        type: File,
    },
    consultant:[{
        type: mongoose.Schema.Types.ObjectId,ref:'Consultant'
    }],
    projet:[{
        type: mongoose.Schema.Types.ObjectId,ref:'Projet'
    }]

});
module.exports = Client;
