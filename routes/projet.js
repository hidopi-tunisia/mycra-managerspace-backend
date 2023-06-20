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
        return res.status(201).send(savedProjet)
 
    } catch(error){
       return  res.status(422).send(error)
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
 
        projets=await Projet.find().populate('client');

        res.send(projets);
 
    }catch(error){
        res.send(error)
 
    }
 
    })

   router.get('/getbyid/:id',async(req,res)=>{
    try{
        id=req.params.id;
        projet=await Projet.findById({_id: id})
        res.send(projet); 
    }catch(error){
        res.send(error);
    }
});
 router.delete('/delete/:id',async(req,res)=>{
    try{
        id=req.params.id
        deleteProjet=await Projet.findByIdAndDelete({_id:id});
 
        res.send(deleteProjet)
 
 
    }catch(error){
        res.send(error)
    }
 })
   
 module.exports=router;
 