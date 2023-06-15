const express=require('express');

const router=express.Router();
const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');
const nodemailer=require('nodemailer')


router.post('/register',async(req , res )=>{
  try{

    data = req.body;

    user=new User(data);
    salt =bcrypt.genSaltSync(10);
    cryptedPass= await bcrypt.hashSync(data.password , salt);
    user.password = cryptedPass;

    const result=await user.save()
    return res.status(200).send(result)
  }catch(err){
    return res.status(422).send(err)  
  }

});


router.post('/login',async(req , res )=>{
    try{
        data = req.body;
        user = await User.findOne({ email: data.email})
        if(!user){
         return   res.status(404).send(' email or password invalid !')
        }else{
            validPass = bcrypt.compareSync(data.password , user.password)
            if(!validPass){
              return  res.status(401).send(' email or password invalid !')
            }else{
                payload={
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    role:user.role
                }
                token=jwt.sign(payload,'1234')
                return res.status(200).send({token: token})
    
            }
        }
        
        
    }catch(err){
        return res.status(422).send(err)
    }

});


router.post('/create', async(req , res )=>{

   try{
       data = req.body;
       usr=new User(data);
       savedUser=await usr.save();

       res.send(savedUser)

   } catch(error){
       res.send(error)
   }

})


router.get('/getall',(req,res)=>{

   User.find().then(
       (users)=>{
           res.send(users); 
       }

   ).catch((err)=>{
       res.send(err);
   })
});


router.get('/all',async(req,res)=>{

   try{

       users=await User.find();
       res.send(users);

   }catch(error){
       res.send(error)

   }

   })


   router.get('/getbyid/:id',(req,res)=>{

       myid=req.params.id;

       User.findOne({_id:myid}).then(
           (user)=>{
               res.send(user); 
           }
   
       ).catch((err)=>{
           res.send(err);
       })
   });


   router.get('/byid/:id',async(req,res)=>{
       try{
           id=req.params.id;
           user=await User.findById({_id: id})
           res.send(user);

       

       }catch(error){
           res.send(error);
       }
   });


router.put('/update/:id',(req,res)=>{
   id=req.params.id;
   newData=req.body;

   User.findByIdAndUpdate({_id:id}, newData)
   .then((updated)=>{
       res.send(updated)
   }).catch((err)=>{
       res.send(err)
   })
});

router.put('/up/:id',async(req,res)=>{
   try{
       id=req.params.id;
       newData=req.body;
       updated=await User.findByIdAndUpdate({_id:id}, newData);
       res.send(updated);



   }catch(error){
       res.send(err)}
 
})


router.delete('/delete/:id',(req,res)=>{
   id=req.params.id
   User.findByIdAndDelete({_id:id})
   .then(
       (deleteUser)=>{
           res.send(deleteUser)
       }
   ).catch(
       (err)=>{
           res.send(err)
       }
   )

});

router.delete('/del/:id',async(req,res)=>{
   try{
       id=req.params.id
       deleteUser=await User.findByIdAndDelete({_id:id});

       res.send(deleteUser)


   }catch(error){
       res.send(error)
   }
}

)





router.post ('/getResetPasswordLink',async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        service:'Outlook365',
        port: 587,
        secure: true,
        requireTLS: true,
        pool:true,
        auth: {
          user: 'eyarouine@outlook.com',
          pass: 'rouine-292000',
        },
        tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
          },
      });
      transporter.verify(async function (error, success) {
        if (error) {
          console.log(error);
        } else {
  
      const token = await jwt.sign({ id: user._id }, 'mail code 1234', {
        expiresIn: '30min',
      });
  
      // const url = `http://localhost:3000/createNewPassword/${token}`;    //localhost
      const url = `http://localhost:4200/reset-password/${token}`;
  
      const emailSent = await transporter.sendMail({
        from: 'eyarouine@outlook.com',
        to: email,
        subject: 'Reset Password',
        text: `Reset your password for React ToDo app.  \n  ${url}`,
       
      });
      if (emailSent) {
        return res.status(201).json({
          status: 'Password reset email sent.',
          message: `Password reset link was sent to ${email}.`,
        });
      } else {
       return res.status(403).send('Password reset failed, Email sending failed!');
       
      }
    }})    
    } else {
      return res.status(403).send('There is no account associated with this email!');
     
    }
  });
  
router.post('/resetPassword/:token',async (req, res) => {
    const { id } = jwt.verify(req.params.token, 'mail code 1234');
    if (id) {
      let { newPassword, confirmPassword } = req.body;
      if (newPassword === confirmPassword) {
        salt =bcrypt.genSaltSync(10);
        cryptedPass= await bcrypt.hashSync(newPassword , salt);
        const updatedUser = await User.findByIdAndUpdate(id, {
          password: cryptedPass,
        });
        updatedUser.save();
        if (updatedUser) {
          return res.status(200).send({ status: 'Password reset successfully!' });
        } else {
         return res.status(404).send('Password reset failed!');
        }
      } else {
       return res.status(404).send('Password does not match!');
      }
    } else {
      return res.status(404).send('User not found!');
    }
  });


module.exports=router;