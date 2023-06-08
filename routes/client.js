const express=require('express');

const router=express.Router();
const Client=require('../models/client');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');

router.get('/', function(req, res, next) {
    res.send('La liste des clients dun manager');
  });

router.post('/create', async(req , res )=>{
console.log("create begin");
    try{
        data = req.body;
        client=new Client(data);
        savedClient=await client.save();
 
        res.send(savedClient)
 
    } catch(error){
        res.send(error)
    }
 
 })
 router.put('/update/:id',async(req,res)=>{
    try{
        id=req.params.id;
        newData=req.body;
        updated=await Client.findByIdAndUpdate({_id:id}, newData);
        res.send(updated);
 
    }catch(error){
        res.send(err)}
  
 })
 router.get('/getall',async(req,res)=>{
console.log("get all clients");
    try{
 
        clients=await Client.find();
        res.send(clients);
 
    }catch(error){
        res.send(error)
 
    }
 
    })

router.get('/getbyid/:id',async(req,res)=>{
       try{
           id=req.params.id;
           client=await Client.findById({_id: id})
           res.send(client);

       

       }catch(error){
           res.send(error);
       }
   });

   router.put('/addpro/:idclient',async(req,res)=>{
    try{
        const id=req.params.idclient
        const projet=req.body
        const client=await Client.findByIdAndUpdate(id,{projet:projet})
        return res.status(201).send(client)

    }catch(err){
        return res.status(422).send(err)
    }

   })
   router.put('/addconsult/:idclient',async(req,res)=>{
    try{
        const id=req.params.idclient
        const consultant=req.body
        const client=await Client.findByIdAndUpdate(id,{consultant:consultant})
        return res.status(201).send(client)

    }catch(err){
        return res.status(422).send(err)
    }

   })
 module.exports=router;
 