var jwt = require('jwt-simple');
var User = require('./models/User');
var bcrypt = require('bcrypt-nodejs');
var express = require('express');
var router  = express.Router();

    router.post('/register', (req,res) =>{
        var userData = req.body; 
    
        var user = new User(userData);
    
        user.save((err,newUser) => {
            if(err){
                return res.status(500).send({ message : "Error Saving user"});
            }

            var payload = { sub : newUser._id };
    
            var token = jwt.encode(payload, '123')
    
            console.log(token);
    
            res.status(200).send({token});
           
        });
    });

    router.post('/login', async (req,res) => {
        var loginData = req.body; 
    
        var user = await User.findOne({ email : loginData.email});
    
        if(!user){
            return res.status(401).send({ message : "Email or Password Invalid"});
        }
    
        bcrypt.compare(loginData.password , user.password , (err , isMatch) => {
            if(!isMatch){
                return res.status(401).send({ message : "Email or Password Invalid"});
            }
    
            var payload = { sub : user._id };
    
            var token = jwt.encode(payload, '123')
    
            console.log(token);
    
            res.status(200).send({token});
        })
    })

    var auth = {
        router , checkAuthenticated : (req,res,next) => {
            if(!req.header('Authorisation'))
                return res.status(401).send({ message : 'Unauthorised . Missing Auth Header'});
        
            var token  = req.header('Authorisation').split(' ')[1];
            console.log("Middleware: " +token);
        
            var payload = jwt.decode(token ,'123');
        
            if(!payload)
                return res.status(401).send({ message : 'Unauthorised . Invalid Auth Header'});
        
            req.userId = payload.sub
        
            next();
        }
    }

    module.exports = auth;
