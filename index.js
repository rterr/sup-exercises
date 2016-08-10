var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var app = express();

var jsonParser = bodyParser.json();

var User = require('./models/user.js');
var Message = require('./models/message.js');

/* 
GET
*/

app.get('/users', function(req, res){
    User.find(function(err, users) {
        if (err) {
            return res.sendStatus(500);
        }
        res.json(users);
        
    });
});    

app.get('/users/:userId', function(req, res){
  User.findOne(
      {_id:req.params.userId},
        function(err, user){ 
            if (err) {
                return res.sendStatus(500);
        }
        if (user){
            res.status(200).json(user);
            console.log('200 OK');
        }
        if (!user) {
             console.log('404 error');
        return res.status(404).json({message: 'User not found'})
        }
    });
});
/*
app.get('/messages', function(req, res){
    Message.find({}, function(err, messages) {
        if (err) {
            return res.sendStatus(500);
        }
        console.log(messages);
        res.status(200).json(messages);
        
    });
});    */

app.get('/messages', function(req, res) {
 var filter = {};
 
 /*
 filter objt
 {
     to: 'Bob',
     from: 'Alice'
 }
 */
 if ('to' in req.query) {
     filter.to = req.query.to;
 }
 if ('from' in req.query) {
     filter.from = req.query.from;
 }
 Message.find(filter)
     .populate('from')
     .populate('to')
     .then(function(messages) {
         res.json(messages);
     });
});

/* 
POST
*/

app.post('/users', jsonParser, function(req, res) {
    if (!req.body.username){
        return res.status(422).json({message: 'Missing field: username'})
    }
     if (typeof req.body.username !== 'string'){
        return res.status(422).json({message: 'Incorrect field type: username'})
    }
    User.create({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        res.status(201).location('/users/'+user._id).json({});
    });
});

/*
PUT
*/
app.put('/users/:userId', jsonParser, function(req, res) {
    if(!req.body.username){
         return res.status(422).json({message: 'Missing field: username'})
    }
     if (typeof req.body.username !== 'string'){
        return res.status(422).json({message: 'Incorrect field type: username'})
    }
    
    User.findOneAndUpdate(
        {_id:req.params.userId},
        {username: req.body.username}, 
    function(err, user) {
        if (err) {
            console.log('500 error');
            return res.sendStatus(500);
        };
        if (user){
            res.status(200).json({});
            console.log('200 OK');
        }
        if (!user) {
            User.create({
                _id:req.params.userId,
                username: req.body.username
            }, 
            function(err, user) {
                if (err) {
                    console.log('500 error in create');
                    return res.sendStatus(500);
                }
            res.status(200).location('/users/'+user._id).json({});
            });
        }

    });
});

/* 
DELETE
*/

app.delete('/users/:userId', function(req, res){
  User.remove(
      {_id:req.params.userId},
        function(err, user){ 
            if (err) {
                return res.sendStatus(500);
            }
            if (!user) {
             console.log('404 error');
            return res.status(404).json({message: 'User not found'})
            }
    res.status(200).json({});
    });
});


var runServer = function(callback) {
    var databaseUri = process.env.DATABASE_URI || global.databaseUri || 'mongodb://localhost/sup';
    mongoose.connect(databaseUri).then(function() {
        var port = process.env.PORT || 8080;
        var server = app.listen(port, function() {
            console.log('Listening on localhost:' + port);
            if (callback) {
                callback(server);
            }
        });
    });
};

if (require.main === module) {
    runServer();
};

exports.app = app;
exports.runServer = runServer;

