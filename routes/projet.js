const express=require('express');

const router=express.Router();
const Projet=require('../models/projet');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/create', async(req , res )=>{

    try{
        data = req.body;
        projet=new Projet(data);
        savedProjet=await projet.save();
 
        res.send(savedProjet)
 
    } catch(error){
        res.send(error)
    }
 
 })
 router.put('/update/:id',async(req,res)=>{
    try{
        id=req.params.id;
        newData=req.body;
        updated=await Projet.findByIdAndUpdate({_id:id}, newData);
        res.send(updated);
 
 
 
    }catch(error){
        res.send(err)}
  
 })
 router.get('/getall',async(req,res)=>{

    try{
 
        projets=await Projet.find();
        res.send(projets);
 
    }catch(error){
        res.send(error)
 
    }
 
    })

/*router.get('/getbyid/:id',async(req,res)=>{
       try{
           id=req.params.id;
           consultant=await Consultant.findById({_id: id})
           res.send(consultant);

       

       }catch(error){
           res.send(error);
       }
   });
   */
 module.exports=router;
 