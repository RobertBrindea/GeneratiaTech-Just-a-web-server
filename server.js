const express = require('express');
let app = express();
let server = app.listen(3000);
app.use(express.static('public'));

const socket = require('socket.io');
let io = socket(server);

const goose = require('mongoose');
const { MongoClient } = require('mongodb');
const url = "mongodb+srv://default_user:mypass1234@cluster0.mcrll.mongodb.net/Posts?retryWrites=true&w=majority";

io.sockets.on("connection", (socket) =>{
    console.log("new connection: " + socket.id);

    socket.on("addPost", (post) =>{
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
            const db = client.db('Posts');
            db.collection("Posts").find().limit(1).sort({_id:-1}).forEach(lastDoc => {
                post['_id'] = lastDoc['_id'] + 1;
                db.collection('Posts').insertOne(post).then(()=>client.close());
            });
        });
    });

    socket.on("getPosts", (restrictions) =>{
        MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then((client) => {
            const db = client.db('Posts');
            let result = [], idOrCategory;
            if(restrictions.id) idOrCategory = {_id:{$eq:restrictions.id}};
            else if(restrictions.category) idOrCategory = {category:{$eq:restrictions.category}};

            let foundPosts = false;
            db.collection("Posts").find(idOrCategory).sort({timestamp:-1}).forEach(elem => result.push(elem)).then(()=> {
                socket.emit("dbResult", result);
                foundPosts = true;
            });
            if(!foundPosts) socket.emit("dbResult", "Nicio postare nu a fost gasita!");
        });
    });
});

