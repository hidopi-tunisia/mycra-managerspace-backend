const mongoose=require('mongoose');


const Projet=mongoose.model('Projet',{
    nomProjet:{
        type:String,
        
    } ,
    categorie:{
        type:String,
    },
    client:{
        type:String,
    }
});
module.exports = Projet;