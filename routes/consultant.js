const express=require('express');

const router=express.Router();
const Consultant=require('../models/consultant');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/login',async(req , res )=>{
    data = req.body;

    user = await Consultant.findOne({ email: data.email})
    if(!user){
        res.status(404).send(' email or password invalid !')
    }else{
        validPass = bcrypt.compareSync(data.password , user.password)
        if(!validPass){
            res.status(401).send(' email or password invalid !')
        }else{
            payload={
                _id: user._id,
                email: user.email,
                name: user.name
            }
            token=jwt.sign(payload,'1234')
            res.status(200).send({mytoken: token})

        }
    }

    usr.save().then(
        (savedUser)=>{
            res.status(200).send(savedUser)
        }
    ).catch((err)=>{
        res.status(400).send(err)
    })

});

router.post('/create', async(req , res )=>{

    try{
        data = req.body;
        consultant=new Consultant(data);
        savedConsultant=await consultant.save();
 
        res.send(savedConsultant)
 
    } catch(error){
        res.send(error)
    }
 
 })
 router.put('/update/:id',async(req,res)=>{
    try{
        id=req.params.id;
        newData=req.body;
        updated=await Consultant.findByIdAndUpdate({_id:id}, newData);
        res.send(updated);
 
 
 
    }catch(error){
        res.send(err)}
  
 })
 router.get('/getall',async(req,res)=>{

    try{
 
        consultants=await Consultant.find();
        res.send(consultants);
 
    }catch(error){
        res.send(error)
 
    }
 
    })

router.get('/getbyid/:id',async(req,res)=>{
       try{
           id=req.params.id;
           consultant=await Consultant.findById({_id: id})
           res.send(consultant);

       

       }catch(error){
           res.send(error);
       }
   });
   router.put('/addpro/:idconsult',async(req,res)=>{
    try{
        const id=req.params.idconsult
        const projet=req.body
        const consultant=await Consultant.findByIdAndUpdate(id,{projet:projet})
        return res.status(201).send(consultant)

    }catch(err){
        return res.status(422).send(err)
    }

   })
 module.exports=router;
 