const express= require('express');
const userRoute=require('./routes/user');
const clientRoute=require('./routes/client');
const consultantRoute=require('./routes/consultant');
const projetRoute=require('./routes/projet');


require('./config/connect');//nedit lel connect fel config

const app=express();
app.use(express.json());

//http://127.0.0.1:3000/user/create
 
app.use('/user', userRoute);
app.use('/client', clientRoute);
app.use('/consultant', consultantRoute);
app.use('/projet', projetRoute);





app.listen(3000,()=>{//arrow function
    console.log('server work');
});