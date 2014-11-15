$(document).ready(function() {
    $('#wsiw_button').on('click', getMovies);
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
    $('#select_source_button').on('click', setSource);
    $('#what_is_this').on('click', showAbout);

    $('.close_button').on('click', function() {
        $('.close_button').parent().hide();
        $('#overlay').hide();
    });

});

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

        setRatings(movie.imdb_id);
    });
}

function showAbout() {
    $('#about').show();
    $('#overlay').show();
}

function newSource() {
    $('#source_selector').show();
    $('#overlay').show();
    $('#ss_' + source).attr('checked', 'checked');
}

function setSource() {
    source = $('input[name=source]:checked').val();
    getMovies();
}