var express = require('express');
var request = require('request');
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
app.get('/api/movies/:source/:method/:user', function(req, res) {
    if(req.params.source == 'local') {
        if(req.params.method == 'top250') {
            imdbMovie.find(function(err, movies) {
                if(err) {
                    res.send(err);
                }
                res.json(movies);
            });
        } else if(req.params.method == 'rt') {
            rtMovie.find(function(err, movies) {
                if(err) {
                    res.send(err);
                }
                res.json(movies);
            });
        }
    } else if(req.params.source == 'trakt') {
        var url = '';
        if(req.params.method = 'trending') {
            url = 'https://api.trakt.tv/movies/trending?extended=full,images'
        } else if(req.params.method == 'watchlist') {
            url = 'https://users/' + req.params.user + '/watchlist/movies';
        } else if(req.params.method == 'collection') {
            url = 'https://users/' + req.params.user + '/collection/movies';
        }
        request({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'trakt-api-version': '2',
                'trakt-api-key': '95599fc3afe66f9e0821cafb79f86be7b491aee3d7fc9c6f13a642e7360dc540'
            }}, function(err, response, movies) {
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
