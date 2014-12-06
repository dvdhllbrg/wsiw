var express = require('express');
var app = express();

var mongoose = require('mongoose');
var compress = require('compression');

mongoose.connect('mongodb://localhost/wsiw');

app.use(express.static(__dirname + '/public'));
app.use(compress());

var imdbSchema = mongoose.Schema( {
        movie: Object
    }, {
        collection : 'top250'
    });
var imdbMovie = mongoose.model('imdbMovie', imdbSchema);

var rtSchema = mongoose.Schema( {
        movie: Object
    }, {
        collection : 'rt'
    });
var rtMovie = mongoose.model('rtMovie', rtSchema);


// Routes
app.get('/api/movies/:source', function(req, res) {
    if(req.params.source == 'top250') {
        imdbMovie.find(function(err, movies) {
            if(err) {
                res.send(err);
            }
            res.json(movies);
        });
    } else if(req.params.source == 'rt') {
        rtMovie.find(function(err, movies) {
            if(err) {
                res.send(err);
            }
            res.json(movies);
        });
    }
});

// Application
app.get('/', function(req, res) {
    res.sendfile('.public/index.html');
});

// 404
app.get('*', function(req, res) {
    res.status(404).sendfile('/opt/mean/wsiw/public/404.html');
});

app.listen(80);
console.log('Magic happens on port 80!');
