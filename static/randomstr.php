<?php

// Nothing special, just a random string generator.
//
// Found at
//    https://stackoverflow.com/questions/6101956/generating-a-random-password-in-php
//
// @date 2018-03-03


header( "Content-Type: text/plain; charset=utf-8" );


function randomPassword( $len = 8 ) {
    $alphabet =
        'abcdefghijklmnopqrstuvwxyz' .
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' .
        '01234567890123456789' .
        '!$%&-_#.?!$&-_#.?!$%&-_#.?';
    $pass = array(); 
    $alphaLength = strlen($alphabet) - 1;
    for ($i = 0; $i < $len; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); 
}

$length = 8;
$count  = 1;
if( array_key_exists('length',$_GET) && !empty($_GET['length']) ) {
    $length = $_GET['length'];
    if( !is_numeric($length) ) {
        header("HTTP/1.1 400 Bad Request");
        die('length must be numeric.');
    }
}
if( array_key_exists('count',$_GET) && !empty($_GET['count']) ) {
    $count = $_GET['count'];
    if( !is_numeric($count) ) {
        header("HTTP/1.1 400 Bad Request");
        die('count must be numeric.');
    }
}

for( $i = 0; $i < $count; $i++ ) {
    echo randomPassword($length);
    if( $i+1 < $count )
        echo "\n";
}


?>