var wsiw = angular.module('wsiw', []);

function mainController($scope, $http) {
    $scope.source = '';
    $scope.movies = null;
    $scope.movie = null;
    $scope.showOverlay = false;
    $scope.showAbout = false;
    $scope.bodyBackground = '';

    $scope.getMovies = function() {
        $scope.showOverlay = true;

        var baseURL = 'http://api.trakt.tv';
        var method = '';
        var user = '';
        var extra = '';
        switch ($scope.source) {
            case 'watchlist':
            method = 'user/watchlist/movies.json';
            user = $scope.wl_user;
            break;
            case 'collection':
                method = 'user/library/movies/collection.json';
                user = $scope.c_user;
                extra = '/extended';
                break;
            case 'trending':
                method = 'movies/trending.json';
        }
        var apikey = 'eca8a8e86968052661e1027d3eaeb444';
        var user = typeof user === 'undefined' || user == '' ? 'iamhj' : user;
        var url = baseURL + '/' + method + '/' + apikey + '/' + user + extra + '?callback=JSON_CALLBACK';
        $http.jsonp(url)
            .success(function(movies) {
                $scope.movies = movies;
                $scope.chooseMovie();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.chooseMovie = function() {
        $scope.movie = $scope.movies[Math.floor(Math.random()*$scope.movies.length)];
        $scope.bodyBackground = {'background-image' : 'url(' + $scope.movie.images.fanart + ')'};
        $scope.showOverlay = false;
    }
}
