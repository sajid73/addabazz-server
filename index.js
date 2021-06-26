const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express()
require('dotenv').config()
const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qslol.mongodb.net/addabazz?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello World! from addabazz')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogs = client.db("addabazz").collection("blogs");
  const admin = client.db("addabazz").collection("admin");

  app.post('/addblog', (req,res)=> {
    const blog = req.body;
    blogs.insertOne(blog)
    .then(result => {})
  })

  app.get('/blogs', (req, res) => {
    blogs.find({})
    .toArray((err,documents)=> {
      res.send(documents)
    })
  })

  app.get('/blog/:id', (req, res) => {
    blogs.find({_id: ObjectId(req.params.id)})
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.delete('/removeblog/:id', (req,res) =>{
    blogs.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      console.log(result);
    })
  })

  app.post('/admins', (req,res) => {
    const email = req.body.email;
    admin.find({email: email})
    .toArray((err, document)=>{
        res.send(document.length > 0);
    })
})

});


app.listen(process.env.PORT || port)