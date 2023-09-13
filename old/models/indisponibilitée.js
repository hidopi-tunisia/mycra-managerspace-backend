const mongoose=require('mongoose');


const Indisponibilite=mongoose.model('Indisponibilite',{
date_debut:{types:String},
date_fin:{types:String},
type_indisponiblite:{types:String}

});
module.exports = Indisponibilite;