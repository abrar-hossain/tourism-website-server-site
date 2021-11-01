const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qkmbj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
    const database = client.db('online_service');
    const servicesCollection = database.collection('services');
    const ordersCollection = database.collection('order');
    //get services api
    app.get('/services', async(req,res)=>{
    const  cursor = servicesCollection.find({});
    const services = await cursor.toArray();
    res.send(services);
    //GET Single services
    app.get('/services/:id', async(req,res)=>{
        const id = req.params.id;
        console.log('getting specific service',id);
        const query ={_id: ObjectId(id)};
        const service = await servicesCollection.findOne(query);
        res.json(service);
    })
    //POST API
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);

        })
    //Delete API
    app.delete('/services/:id', async(req,res)=>{
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await servicesCollection.deleteOne(query);
        res.json(result);
    })
})
    }
    finally{
//await client.close();
    }
}

run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('jatra is running');
})
app.listen(port,(req,res)=>{
    console.log('Server is runing',port);
})