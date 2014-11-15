function fetchMovies(user, method, callback) {
    var baseURL = 'http://api.trakt.tv';
    var apikey = 'eca8a8e86968052661e1027d3eaeb444';

    var extra = '';
    var url = baseURL + '/' + method + '/' + apikey + '/' + user + extra + '?callback=?';

    $.getJSON(url).success(function(data) {
        //$('#source_selector').hide();
        movies = data;
        //chooseMovie();
        callback('success');
    }).error(function() {
        //$('.source_error').show();
        callback('error');
    })//.complete(function() {
        //$('#loading_image').hide();
        //if(!$('#source_selector').is(':visible')) {
            //$('#overlay').hide();
        //}
    //});
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
