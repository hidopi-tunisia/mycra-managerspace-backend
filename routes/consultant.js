const express=require('express');

const router=express.Router();
const Consultant=require('../models/consultant');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');


//Login
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
//Create
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
 //Update
 router.put('/update/:id',async(req,res)=>{
    try{
        id=req.params.id;
        newData=req.body;
        updated=await Consultant.findByIdAndUpdate({_id:id}, newData);
        res.send(updated);
 
 
 
    }catch(error){
        res.send(err)}
  
 })

 //GetAll
 router.get('/getall',async(req,res)=>{

    try{
 
        consultants=await Consultant.find().populate('projet');
        res.send(consultants);
 
    }catch(error){
        res.send(error)
 
    }
 
    })

//GetById
router.get('/getbyid/:id',async(req,res)=>{
       try{
           id=req.params.id;
           consultant=await Consultant.findById({_id: id})
           res.send(consultant)        
       }catch(error){
           res.send(error);
       }
   });
router.get('/idProjet/:id',async(req,res)=>{
       try{
           id=req.params.id;
           consultant=await Consultant.find({projet: id})
           res.send(consultant)        
       }catch(error){
           res.send(error);
       }
   });

   //Delete
   router.delete('/delete/:id',async(req,res)=>{
    try{
        id=req.params.id
        const deleteConsultant=await Consultant.findByIdAndDelete({_id:id});
        return res.send(deleteConsultant)
 
 
    }catch(error){
       return res.send(error)
    }
 })
 module.exports=router;
 