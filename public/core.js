var wsiw = angular.module('wsiw', []);

function mainController($scope, $http) {
    $scope.source = '';

    $http.get('/api/movies')
        .success(function(data) {
            $scope.movies = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error ' + data);
        });


    $scope.getMovies = function() {
        var baseURL = 'http://api.trakt.tv';
        var method = '';
        var extra = '';
        switch ($scope.source) {
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
        var apikey = 'eca8a8e86968052661e1027d3eaeb444';
        var user = 'iamhj';
        var url = baseURL + '/' + method + '/' + apikey + '/' + user + extra + '?callback=JSON_CALLBACK';
        $http.jsonp(url)
            .success(function(movies) {
                $scope.movies = movies;
                console.log(movies);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.createMovie = function() {
        $http.post('/api/movies', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.movies = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteMovie = function(id) {
        $http.delete('/api/movies/' + id)
            .success(function(data) {
                $scope.movies = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}
