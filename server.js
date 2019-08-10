var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jwt-simple');


var User = require('./models/User');
var Post = require('./models/Post');
var auth = require('./auth');


app.use(cors());
app.use(bodyParser.json());




app.get('/posts/:id',async (req,res) =>{
    var author = req.params.id
    var posts = await Post.find({author})
    res.send(posts);
});

app.post('/post' , auth.checkAuthenticated , (req , res) => {

    var postData = req.body;

    postData.author = req.userId;

    var post = new Post(postData);

    post.save((err,result) => {
        if(err){
            console.log('saving post error' + err);
        }
        res.status(200).send({ message :'post saved'});

        console.log('post saved');
    });
})

app.get('/users' ,async (req,res) =>{
    
    try {
        var users = await User.find({} ,'-password -__v' );
        res.send(users);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

});


app.get('/profile/:id',async (req,res) =>{
    
    try {
        
    var user = await User.findById(req.params.id ,'-password -__v' );

    res.send(user);


    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

});




mongoose.connect('mongodb://taran:2210@cluster0-shard-00-00-dgsex.mongodb.net:27017,cluster0-shard-00-01-dgsex.mongodb.net:27017,cluster0-shard-00-02-dgsex.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority' ,{ useNewUrlParser: true }, (err) => {
    if(err){
        console.log(' error connecting to mongo',err);
    }
    else{
        console.log('connected to mongo');
    }
});



app.use('/auth' , auth.router)

app.listen(3000, () =>{
    console.log('Server is running at port 3000');
});