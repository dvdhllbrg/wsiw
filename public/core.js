function MainController($scope, $http, $sce) {
    $scope.source = 'trending';
    $scope.wl_user = 'dvdhllbrg';
    $scope.c_user = 'dvdhllbrg';
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
        $scope.showTrailer = false;

        var url = 'http://whatshouldiwat.ch/api/movies/';

        if($scope.source == 'top250' || $scope.source == 'rt') {
            url = url + 'local/' + $scope.source;
        }
        else {
            url += 'trakt/';
            switch ($scope.source) {
                case 'watchlist':
                    url = url + 'watchlist/' + $scope.wl_user;
                    $scope.c_user = $scope.wl_user;
                    break;
                case 'collection':
                    url = url + 'collection/' + $scope.c_user;
                    $scope.wl_user = $scope.c_user;
                    break;
                case 'trending':
                    url = url + 'trending';
                    break;
            }
        }

        $http.get(url)
            .success(function(movies) {
                if(movies.length > 0) {
                    $scope.movies = [];
                    for(var i=0; i<movies.length; i++) {
                        $scope.movies[i] = movies[i].movie;
                    }
                    $scope.chooseMovie();
                } else {
                    $scope.sourceError = true;
                    $scope.showLoading = false;
                    if($scope.movies.length > 0) {
                        $scope.sourceSelectorPopup = true;
                    } else {
                        $scope.showOverlay = false;
                    }
                }
            })
            .error(function(data) {
                $scope.showLoading = false;
                $scope.showOverlay = false;
                $scope.sourceError = true;
            });
    };

    $scope.chooseMovie = function() {
        $scope.movie = $scope.movies[Math.floor(Math.random()*$scope.movies.length)];
        $scope.bodyBackground = {'background-image' : 'url(' + $scope.movie.images.fanart.full + ')'};
        $scope.setRatings();
        $scope.setTrailerSrc();
        $scope.showLoading = false;
        $scope.showOverlay = false;
    };

    $scope.setTrailerSrc = function() {
        var videoId = $scope.movie.trailer.substring($scope.movie.trailer.indexOf('?v=')+3);
        var trailer = 'https://youtube.com/embed/' + videoId + '/?enablejsapi=1';
        console.log(trailer);
        $scope.movie.trailerSrc = $sce.trustAsResourceUrl(trailer);
    };

    $scope.setRatings = function() {
        var url = 'http://www.omdbapi.com/?i=' + $scope.movie.ids.imdb + '&tomatoes=true&callback=JSON_CALLBACK';
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

    $scope.traktUserSelected = function(focused) {
        if(focused == 'watchlist') {
            $scope.wl_user = '';
            $scope.source = 'watchlist';
        } else if(focused == 'collection') {
            $scope.c_user = '';
            $scope.source = 'collection';
        }
    };

    $scope.hideAbout = function() {
        setTimeout(function() {
            if($scope.showAbout) {
                $scope.showAbout = false; 
                $scope.showOverlay = false;
            }
        }, 5);
    };

    $scope.hideTrailer = function() {
        if($scope.showTrailer) {
            $scope.showTrailer = false; 
            document.getElementById('trailerFrame').contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
            $scope.showOverlay = false;
        }
    };
}

angular.module('wsiw', ['angular-click-outside']).controller('MainController', ['$scope', '$http', '$sce', MainController]);
