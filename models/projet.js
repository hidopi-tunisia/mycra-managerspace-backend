const mongoose=require('mongoose');


const Projet=mongoose.model('Projet',{
    nomProjet:{
        type:String,
        
    } ,
    categorie:{
        type:String,
    },
    client:{type:
        mongoose.Schema.Types.ObjectId,ref:'Client'},
    code:{
        type:String,
    }
});
module.exports = Projet;