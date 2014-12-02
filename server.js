var express = require('express');
var app = express();

var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://localhost/movies');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended' : 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var Movie = mongoose.model('Movie', {
    movie : Object
});

app.listen(80);
console.log('Magic happens on port 80!');

// Routes
app.get('/api/movies/:collection', function(req, res) {
    Movie.find(function(err, movies) {
        if(err) {
            res.send(err);
        }
        res.json(movies);
    });
});

// Application
app.get('*', function(req, res) {
    res.sendfile('.public/index.html');
});

