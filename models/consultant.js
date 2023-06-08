const mongoose=require('mongoose');


const Consultant=mongoose.model('Consultant',{
    poste:{
        type:String,
        
    } ,
    experience:{
        type:String,
    },
    competences:{
        type:String,
    },
    nom:{
        type:String,
    },
    prenom:{
        type:String,
    } ,
    email:{
        type:String,
        required:"Email is required",
        unique:true
    } ,
    tel:{
        type:Number,
        
    } ,
    dateDispo:{
        type:Date,
        
    },
    dateEmbauche:{
        type:Date
    },
    codePostal:{
        type: Number
    },
    note:{
        type:String,
    },
    linkedIn:{
        type: String,
    },
    projet:[{
        type: mongoose.Schema.Types.ObjectId,ref:'Projet'
    }]

});
module.exports = Consultant;