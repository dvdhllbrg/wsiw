$(document).ready(function() {
    $('#wsiw').on('click', getMovies);
    $('label').on('click', function() {
        $(this).next('input[type=text]').select();
    });
    $('input[name=source]').on('click', function() {
        $('.source_error').hide();
    });
    $('.trakt_user').focus(function() {
        $(this).val('');
        $(this).prev('input[name=source]').click();
    });
    $('#another').on('click', chooseMovie);
    $('#newsource').on('click', newSource);
    $('#selectsource').on('click', setSource);
    $('#whatisthis').on('click', showAbout);

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
    var user = $('input[name=source]:checked').next('input[type=text]').val();
    var user = typeof user === 'undefined' || user == '' ? 'iamhj' : user;
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

    var url = baseURL + '/' + method + '/' + apikey + '/' + user + extra + '?callback=?';

    $.getJSON(url).success(function(data) {
        $('#sourceselector').hide();
        movies = data;
        chooseMovie();
    }).error(function() {
        $('.source_error').show();
    }).complete(function() {
        $('#loading_image').hide();
        if(!$('#sourceselector').is(':visible')) {
            $('.overlay').hide();
        }
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

        $('#whatisthis').hide();
        $('#nothappy').show();

        setRatings(movie.imdb_id);
    });
}

function showAbout() {
    $('#about').show();
    $('.overlay').show();
}

function newSource() {
    $('#sourceselector').show();
    $('.overlay').show();
    $('#s_' + source).attr('checked', 'checked');
}

function setSource() {
    source = $('input[name=source]:checked').val();
    getMovies();
}
