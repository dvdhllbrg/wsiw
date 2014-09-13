$(document).ready(function() {
    $('#wsiw').on('click', getMovies);
    $('#another').on('click', chooseMovie);
    $('#newsource').on('click', newSource);
    $('#selectsource').on('click', setSource);

    $('.closebutton').on('click', function() {
        $('.closebutton').parent().hide();
        $('.overlay').hide();
    });

});

var movies;
var source = 'watchlist';

function getMovies() {
    var method;
    var baseURL = 'http://api.trakt.tv';
    var apikey = 'eca8a8e86968052661e1027d3eaeb444';
    var user ='iamhj';
    var extra = '';

    $('#loading_image').show();
    $('.overlay').show();


    switch (source) {
        case 'watchlist':
        method = 'user/watchlist/movies.json';
        break;
        case 'collection':
            method = 'user/library/movies/collection.json';
            extra = '/extended';
            break;
        case 'random':
            method = 'movies/trending.json';


    }

    var url = baseURL + '/' + method + '/' + apikey + '/' + user + extra;

    $.getJSON(url, function(data) {
        movies = data;
        chooseMovie();
        $('#loading_image').hide();
        $('.overlay').hide();
    });
}

function setRatings(id) {
    var baseurl = 'http://www.omdbapi.com/?i=';
    var tomatoes = '&tomatoes=true';
    var url = baseurl + id + tomatoes;

    $.getJSON(url, function(data) {
        $('#imdb_rating').html(data.imdbRating);
        $('#rt_rating').html(data.tomatoRating);
    });
}

function chooseMovie() {
    var movie = movies[Math.floor(Math.random()*movies.length)];

    $('body').css('background-image', 'url(' + movie.images.fanart + ')');
    $('.content').load('info.html', function() {
        $('#poster').attr('src', movie.images.poster);
        $('#year').html(movie.year);
        $('#runtime').html(movie.runtime + ' min');
        $.each(movie.genres, function(key, genre) {
            $('#genres').append(genre + ', ');
        });
        $('#genres').html($('#genres').html().slice(0,-2));
        $('#title').html(movie.title);
        $('#movieurl').attr('href', movie.url);
        $('#overview').html(movie.overview);

        $('#nothappy').show();

        setRatings(movie.imdb_id);
    });
}

function newSource() {
    $('#sourceselector').show();
    $('.overlay').show();
    $('#s_' + source).attr('checked', 'checked');
}

function setSource() {
    source = $('input[name=source]:checked').val();
    $('#sourceselector').hide();
    getMovies();
}
