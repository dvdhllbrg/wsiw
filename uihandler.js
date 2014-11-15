var movies;

$(document).ready(function() {
    $('#wsiw_button').on('click', getMovies);
    $('input[name=source]').on('click', function() {
        $('#ss_' + $(this).val()).attr('checked', 'checked');
        $('.source_error').hide();
    });
    $('.trakt_user').focus(function() {
        $(this).val('');
        $(this).prev('input[name=source]').click();
    });
    $('#another').on('click', chooseMovie);
    $('#new_source').on('click', showSourceSelector);
    $('#select_source_button').on('click', getMovies);
    $('#what_is_this').on('click', showAbout);

    $('.close_button').on('click', function() {
        $('.close_button').parent().hide().removeClass('source_selector_popup');
        $('#overlay').hide();
    });

});

function getMovies() {
    $('#loading_image').show();
    $('#overlay').show();

    var user = $('input[name=source]:checked').next('input[type=text]').val();
    var user = typeof user === 'undefined' || user == '' ? 'iamhj' : user;

    var source = $('input[name=source]:checked').val();
    switch (source) {
        case 'watchlist':
        method = 'user/watchlist/movies.json';
        break;
        case 'collection':
            method = 'user/library/movies/collection.json';
            extra = '/extended';
            break;
        case 'trending':
            method = 'movies/trending.json';
    }

    fetchMovies(user, method, function(state) {
        $('#loading_image').hide();

        if(state == 'success') {
            $('#source_selector').hide();
            chooseMovie();
        } else if(state == 'error') {
            $('.source_error').show();
        }

        if(!$('#source_selector').hasClass('source_selector_popup')) {
            $('#overlay').hide();
        }
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

        $('#what_is_this').hide();
        $('#nothappy').show();

        getRatings(movie.imdb_id, function(imdbRating, tomatoRating) {
            $('#imdb_rating').html(imdbRating);
            $('#rt_rating').html(tomatoRating);
        });
    });
}

function showAbout() {
    $('#about').show();
    $('#overlay').show();
}

function showSourceSelector() {
    $('#source_selector').addClass('source_selector_popup');
    $('#source_selector').show();
    $('#source_selector .close_button').show();
    $('#select_source_button').show();
    $('#overlay').show();
}
