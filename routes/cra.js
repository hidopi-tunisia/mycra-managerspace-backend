const express=require('express');

const router=express.Router();
const CRA=require('../models/cra');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/post-my-cra-all-month', async(req , res )=>{

    try{
        data = req.body;
        data.type="month"
        cra=new CRA(data);
        savedCRA=await cra.save();
 
        res.send(savedCRA)
 
    } catch(error){
        res.send(error)
    }
 
 })
router.post('/post-my-cra-by-week', async(req , res )=>{

    try{
        data = req.body;
        data.type="week"
        cra=new CRA(data);
        savedCRA=await cra.save();
 
        res.send(savedCRA)
 
    } catch(error){
        res.send(error)
    }
 
 })
 router.put('/update/:id',async(req,res)=>{
    try{
        id=req.params.id;
        newData=req.body;
        updated=await CRA.findByIdAndUpdate({_id:id}, newData);
        res.send(updated);
 
 
 
    }catch(error){
        res.send(err)}
  
 })
 router.get('/getall',async(req,res)=>{

    try{
 
        cras=await CRA.find();
        res.send(cras);
 
    }catch(error){
        res.send(error)
 
    }
 
    })
    router.get('/getbyid/:id',async(req,res)=>{
        try{
            id=req.params.id;
            cra=await CRA.findById({_id: id})
            res.send(cra);
 
        
 
        }catch(error){
            res.send(error);
        }
    });
    router.delete('/delete/:id',(req,res)=>{
        id=req.params.id
        CRA.findByIdAndDelete({_id:id})
        .then(
            (deleteCRA)=>{
                res.send(deleteCRA)
            }
        ).catch(
            (err)=>{
                res.send(err)
            }
        )
     
     });

    module.exports=router;
 
