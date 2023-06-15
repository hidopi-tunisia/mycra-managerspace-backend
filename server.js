const express= require('express');
const userRoute=require('./routes/user');
const clientRoute=require('./routes/client');
const cors=require('cors')
const projetRoute=require('./routes/projet');
const consultantRoute=require('./routes/consultant');

/*const craRoute=require('./routes/cra');
const indisponibiliteRoute=require('./routes/indisponibilite');
const notificationRoute=require('./routes/notification');*/



require('./config/connect');//nedit lel connect fel config

const app=express();
app.use(express.json());
app.use(cors('*'))
app.use('/user', userRoute);

app.use('/client', clientRoute);
app.use('/projet', projetRoute);
app.use('/consultant', consultantRoute);
/*app.use('/cra', craRoute);
app.use('/indisponibilite', indisponibiliteRoute);
app.use('/notification', notificationRoute);
*/





app.listen(3000,()=>{//arrow function
    console.log('server work');
});