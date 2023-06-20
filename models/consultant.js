const mongoose=require('mongoose');


const Consultant=mongoose.model('Consultant',{
    poste:{
        type:String,
        
    } ,
    sexe:{
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
        year:{type:String},
        month:{type:String},
        day:{type:String}
        
    },
    dateEmbauche:{
        year:{type:String},
        month:{type:String},
        day:{type:String}
    },
    codePostal:{
        type: Number
    },
    note:{
        type:String,
    },
    document:{
        type:String,
    },
    linkedIn:{
        type: String,
    },
    projet:{type:
        mongoose.Schema.Types.ObjectId,ref:'Projet'
    },
    avatar:{type:String}

});
module.exports = Consultant;