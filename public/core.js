var wsiw = angular.module('wsiw', []);

function mainController($scope, $http) {
    $scope.source = 'trending';
    $scope.traktParams = {
        'baseUrl' : 'http://api.trakt.tv',
        'apikey' : 'eca8a8e86968052661e1027d3eaeb444',
        'method' : '',
        'user' : '',
        'extra' : ''
    }
    $scope.movies = [];
    $scope.movie = null;
    $scope.sourceError = false;
    $scope.showOverlay = false;
    $scope.showLoading = false;
    $scope.showAbout = false;
    $scope.sourceSelectorPopup = false;
    $scope.bodyBackground = '';

    $scope.getMovies = function() {
        $scope.sourceError = false;
        $scope.showOverlay = true;
        $scope.showLoading = true;
        $scope.sourceSelectorPopup = false;

        if($scope.source == 'top250') {
            var url = 'http://whatshouldiwat.ch/api/movies';
            $http.get(url)
                .success(function(movies) {
                    for(var i=0; i<movies.length; i++) {
                        $scope.movies[i] = movies[i].movie;
                    }
                    $scope.chooseMovie();
                })
                .error(function(data) {
                    $scope.showLoading = false;
                    $scope.showOverlay = false;
                    $scope.sourceError = true;
                });
        }
        else {
            switch ($scope.source) {
                case 'watchlist':
                    $scope.traktParams.method = 'user/watchlist/movies.json';
                    $scope.traktParams.user = $scope.wl_user;
                    break;
                case 'collection':
                    $scope.traktParams.method = 'user/library/movies/collection.json';
                    $scope.traktParams.user = $scope.c_user;
                    $scope.traktParams.extra = '/extended';
                    break;
                case 'trending':
                    $scope.traktParams.method = 'movies/trending.json';
                    break;
            }

            $scope.traktParams.user = (typeof $scope.traktParams.user === 'undefined' || $scope.traktParams.user == '') ? 'iamhj' : $scope.traktParams.user;
            var url = $scope.traktParams.baseUrl + '/' + $scope.traktParams.method + '/' + $scope.traktParams.apikey + '/' + $scope.traktParams.user + $scope.traktParams.extra + '?callback=JSON_CALLBACK';

            $http.jsonp(url)
                .success(function(movies) {
                    $scope.movies = movies;
                    $scope.chooseMovie();
                })
                .error(function(data) {
                    $scope.showLoading = false;
                    $scope.showOverlay = false;
                    $scope.sourceError = true;
                });
        }
    };

    $scope.chooseMovie = function() {
        $scope.movie = $scope.movies[Math.floor(Math.random()*$scope.movies.length)];
        $scope.bodyBackground = {'background-image' : 'url(' + $scope.movie.images.fanart + ')'};
        $scope.setRatings();
        $scope.showLoading = false;
        $scope.showOverlay = false;
    }

    $scope.setRatings = function() {
        var url = 'http://www.omdbapi.com/?i=' + $scope.movie.imdb_id + '&tomatoes=true&callback=JSON_CALLBACK';
        if(typeof $scope.movie.ratings == 'undefined') {
            $scope.movie.ratings = {};
        }
        if(typeof $scope.movie.ratings.imdb_rating == 'undefined' || $scope.movie.ratings.imdb_rating == '' || typeof $scope.movie.ratings.tomato_rating == 'undefined' || $scope.movie.ratings.tomato_rating == '') {
            $http.jsonp(url)
                .success(function(ratings) {
                    $scope.movie.ratings.imdb_rating = ratings.imdbRating;
                    $scope.movie.ratings.tomato_rating = ratings.tomatoRating;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    }
}
