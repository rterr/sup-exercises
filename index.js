var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;


var app = express();

var jsonParser = bodyParser.json();

var User = require('./models/user.js');

app.get('/users', function(req, res){
    
    User.find(function(err, users) {
        if (err) {
            return res.sendStatus(500);
        }
        res.json(users);
        
    });
});    

app.post('/users', function(req, res) {
    User.create({
        username: req.body.username
    }, function(err, user) {
        if (err) {
            return res.sendStatus(500);
        }
        res.status(201).json(user);
    });
});

// Add your API endpoints here

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

