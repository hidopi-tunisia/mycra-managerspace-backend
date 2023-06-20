const mongoose=require('mongoose');


const CRA=mongoose.model('CRA',{
consultant:{type:mongoose.Schema.Types.ObjectId,ref:'Consultant'},
month :{types:String},
date_début:{types:String},
date_fin:{types:String},
year:{types:String},
type:{types:String},
projet:{types:mongoose.Schema.Types.ObjectId,ref:'Projet'},
client:{types:mongoose.Schema.Types.ObjectId,ref:'Client'}
});
module.exports = CRA;