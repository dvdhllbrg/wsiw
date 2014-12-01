var wsiw = angular.module('wsiw', []);

function mainController($scope, $http) {
    $scope.source = '';
    $scope.movies = null;
    $scope.movie = null;
    $scope.loading = false;

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
                $scope.loading = true;
                $scope.chooseMovie();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.chooseMovie = function() {
       $scope.movie = $scope.movies[Math.floor(Math.random()*$scope.movies.length)];
       $scope.loading = false;
    }

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
