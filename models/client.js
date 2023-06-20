const mongoose=require('mongoose');
const Client=mongoose.model('Client',{
    nomSocial:{
        type:String,
        
    } ,
    sexe:{
        type:String,
    },
    responsable:{
        type:String,
    },
    nSiret:{
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
        year:{type:String},
        month:{type:String},
        day:{type:String}
    },
    note:{
        type:String,
    },
    competences:[{
        name:{type:String},
        id:{type:Number}
    }],
    projet:{
        type: mongoose.Schema.Types.ObjectId,ref:'Projet'
    },
    document:{
        type: String,
    },
   
    
});
module.exports = Client;

