const mongoose=require('mongoose');


const Projet=mongoose.model('Projet',{
    nomProjet:{
        type:String,
    },
    codeProjet:{
        type:String,
    },
    categorie:{
        type:String,
    },
    date_creation: {
        type: Date,
        default: Date.now
      },
    client:[{
        type: mongoose.Schema.Types.ObjectId,ref:'Client'
    }]
});
module.exports = Projet;