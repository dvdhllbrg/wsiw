function MainController($scope, $http) {
    $scope.source = 'trending';
    $scope.wl_user = 'iamhj';
    $scope.c_user = 'iamhj';
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

        $scope.movies = [];
        var url = 'http://whatshouldiwat.ch/api/movies/';

        if($scope.source == 'top250' || $scope.source == 'rt') {
            url = url + 'local/' + $scope.source;
        }
        else {
            url += 'trakt/';
            switch ($scope.source) {
                case 'watchlist':
                    url = url + 'watchlist/' + $scope.wl_user;
                    break;
                case 'collection':
                    url = url + 'collection/' + $scope.c_user;
                    break;
                case 'trending':
                    url = url + 'trending';
                    break;
            }
        }

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
    };

    $scope.chooseMovie = function() {
        $scope.movie = $scope.movies[Math.floor(Math.random()*$scope.movies.length)];
        $scope.shrinkPoster();
        $scope.bodyBackground = {'background-image' : 'url(' + $scope.movie.images.fanart.full + ')'};
        $scope.setRatings();
        $scope.showLoading = false;
        $scope.showOverlay = false;
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
