var express = require('express');
var app = express();

var mongoose = require('mongoose');
var compress = require('compression');

mongoose.connect('mongodb://localhost/wsiw');

app.use(express.static(__dirname + '/public'));
app.use(compress());

var movieSchema = mongoose.Schema( {
        movie: Object
    }, {
        collection : 'top250'
    });

var Movie = mongoose.model('Movie', movieSchema);

// Routes
app.get('/api/movies/:source', function(req, res) {
    movieSchema.set('collection', req.params.source);
    Movie.find(function(err, movies) {
            if(err) {
                res.send(err);
            }
        res.json(movies);
    });

    delete Movie;
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
