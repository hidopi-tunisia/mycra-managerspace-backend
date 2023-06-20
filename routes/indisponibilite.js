const express=require('express');

const router=express.Router();
const Indisponibilite=require('../models/indisponibilite');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/create_Indis', async(req , res )=>{

    try{
        data = req.body;
        indisponibilite=new Indisponibilite(data);
        savedIndisponibilite=await indisponibilite.save();
 
        res.send(savedIndisponibilite)
 
    } catch(error){
        res.send(error)
    }
 
 })

 router.put('/update/:id',async(req,res)=>{
    try{
        id=req.params.id;
        newData=req.body;
        updated=await Indisponibilite.findByIdAndUpdate({_id:id}, newData);
        res.send(updated);
 
 
 
    }catch(error){
        res.send(err)}
  
 })
 router.get('/getall',async(req,res)=>{

    try{
 
        Indisponibilites=await Indisponibilite.find();
        res.send(Indisponibilites);
 
    }catch(error){
        res.send(error)
 
    }
 
    })

router.get('/getbyid/:id',async(req,res)=>{
       try{
           id=req.params.id;
           indisponibilite=await Indisponibilite.findById({_id: id})
           res.send(indisponibilite);

       

       }catch(error){
           res.send(error);
       }
   });
   router.delete('/delete/:id',(req,res)=>{
    id=req.params.id
    Indisponibilite.findByIdAndDelete({_id:id})
    .then(
        (deleteIndisponibilite)=>{
            res.send(deleteIndisponibilite)
        }
    ).catch(
        (err)=>{
            res.send(err)
        }
    )
 
 });

 module.exports=router;