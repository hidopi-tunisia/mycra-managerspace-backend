const express=require('express');

const router=express.Router();
const Client=require('../models/client');
const bcrypt=require('bcrypt');
const jwt =require('jsonwebtoken');

router.post('/create', async(req , res )=>{

    try{
        data = req.body;
        client=new Client(data);
        savedClient=await client.save();
        return res.status(201).send(savedClient)
 
    } catch(error){
       return  res.status(422).send(error)
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
 router.put('/archive/:id',(req, res) => {
    const id = req.params.id;
    
    const client = findClientById(id); // Supposons que vous avez une fonction pour trouver le client par son ID
    if (client) {
      client.archived = true; // Marquer le client comme archivé
      saveClient(client); // Supposons que vous avez une fonction pour sauvegarder les modifications du client
      res.status(200).json({ message: 'Client archivé avec succès.' });
    } else {
      res.status(404).json({ error: 'Client non trouvé.' });
    }
  });


 router.get('/all',async(req,res)=>{
    try{
        clients=await Client.find().populate('projet');
        res.send(clients);
    }catch(error){
        res.send(error)
    }
 
    })
/*    router.get('/all', async (req, res) => {
        try {
          const page = parseInt(req.query.page) || 1; // Numéro de la page (par défaut: 1)
          const limit = parseInt(req.query.limit) || 10; // Nombre d'éléments par page (par défaut: 10)
      
          const startIndex = (page - 1) * limit; // Index de départ
          const endIndex = page * limit; // Index de fin
      
          const totalItems = await Client.countDocuments(); // Total des éléments dans la collection
          const totalPages = Math.ceil(totalItems / limit); // Nombre total de pages
      
          const clients = await Client.find().skip(startIndex).limit(limit); // Récupère les clients de la page demandée
      
          res.json({
            totalItems: totalItems,
            page: page,
            totalPages: totalPages,
            data: clients
          });
        } catch (error) {
          res.send(error);
        }
      });

*/

    

router.get('/getbyid/:id',async(req,res)=>{
       try{
           id=req.params.id;
           client=await Client.findById({_id: id})
           res.send(client);

       

       }catch(error){
           res.send(error);
       }
   });

   //Delete
   router.delete('/delete/:id',async(req,res)=>{
    try{
        id=req.params.id
        deleteClient=await Client.findByIdAndDelete({_id:id});
 
        res.send(deleteClient)
    }catch(error){
        res.send(error)
    }
 })

 router.put('/archiver-client/:clientId', (req, res) => {
  const clientId = req.params.clientId;
  
  // Effectuez les opérations nécessaires pour archiver le client avec l'ID fourni
  // par exemple, mettez à jour le statut du client dans votre base de données
  
  res.status(200).json({ message: 'Client archivé avec succès.' });
});
 module.exports=router;
 