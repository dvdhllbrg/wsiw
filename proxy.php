<?php
if(!isset($_GET['source'])) {
    die();
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_REFERER, 'http://vaurora');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$url = '';

$baseURL = 'http://api.trakt.tv';
$apikey = 'eca8a8e86968052661e1027d3eaeb444';
$user ='iamhj';
$extra = '';
switch($_GET['source']) {
    case 'watchlist':
        $method = 'user/watchlist/movies.json';
        break;
    case 'collection':
        $method = 'user/library/movies/collection.json';
        $extra = '/extended';
        break;
    case 'random':
        $method = 'movies/trending.json';
}


$url = $baseURL . '/' . $method . '/' . $apikey . '/' . $user . $extra;

curl_setopt($ch, CURLOPT_URL, $url);
$output = curl_exec($ch);
curl_close($ch);
echo $output;
?>
