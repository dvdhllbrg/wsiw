function MainController($scope, $http) {
    $scope.source = 'trending';
    $scope.traktParams = {
        'baseUrl' : 'https://api.trakt.tv/',
        'apikey' : '',
        'method' : '',
    };
    $scope.wl_user = 'iamhj';
    $scope.c_user = 'iamhj;'
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

        if($scope.source == 'top250' || $scope.source == 'rt' || $scope.source == 'trending') {
            $scope.movies = [];
            var url = 'http://whatshouldiwat.ch/api/movies/' + $scope.source;
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
                    $scope.traktParams.method = 'users/' + $scope.wl_user + '/watchlist/movies';
                    break;
                case 'collection':
                    $scope.traktParams.method = 'users/' + $scope.c_user + '/collection/movies';
                    break;
                //case 'trending':
                    //$scope.traktParams.method = 'movies/trending';
                    //break;
            }

            var traktUrl = $scope.traktParams.baseUrl + $scope.traktParams.method + '?extended=full,images';

            var req = {
                method: 'GET',
                url: traktUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'trakt-api-version': '2',
                    'trakt-api-key': $scope.traktParams.apikey
                },
                withCredentials: true,
                responseType: 'json'
            }

            $http(req)
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
        $scope.shrinkPoster();
        $scope.bodyBackground = {'background-image' : 'url(' + $scope.movie.images.fanart + ')'};
        $scope.setRatings();
        $scope.showLoading = false;
        $scope.showOverlay = false;
    };

    $scope.shrinkPoster = function() {
        var shrunkPoster = $scope.movie.images.poster;
        shrunkPoster = shrunkPoster.substring(0, shrunkPoster.indexOf('.jpg'));
        if(shrunkPoster.substring(shrunkPoster.length - 4) != '-300') {
            shrunkPoster = shrunkPoster + '-300' + '.jpg';
            $scope.movie.images.poster = shrunkPoster;
        }
    };

    $scope.setRatings = function() {
        var url = 'http://www.omdbapi.com/?i=' + $scope.movie.imdb_id + '&tomatoes=true&callback=JSON_CALLBACK';
        if(typeof $scope.movie.ratings == 'undefined') {
            $scope.movie.ratings = {};
        }
        if(typeof $scope.movie.ratings.imdb_rating === 'undefined' || $scope.movie.ratings.imdb_rating === '' || typeof $scope.movie.ratings.tomato_rating === 'undefined' || $scope.movie.ratings.tomato_rating === '') {
            $http.jsonp(url)
                .success(function(ratings) {
                    $scope.movie.ratings.imdb_rating = ratings.imdbRating;
                    $scope.movie.ratings.tomato_rating = ratings.tomatoRating;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
        }
    };
}

angular.module('wsiw', []).controller('MainController', ['$scope', '$http', MainController]);
