const mongoose=require('mongoose');


const Notification=mongoose.model('Notification',{
titre:{types:String},
message:{types:String},

});
module.exports = Notification;