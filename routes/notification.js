const express=require('express');

const router=express.Router();
const Notification=require('../models/notification');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/notifier', async(req , res )=>{

    try{
        data = req.body;
        notification=new Notification(data);
        savedNotification=await notification.save();
 
        res.send(savedNotification)
 
    } catch(error){
        res.send(error)
    }
 
 })

 module.exports=router;