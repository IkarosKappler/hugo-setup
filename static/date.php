<?php

/**
 * @date 2013-01-14
 * @modified 2018-01-13 Optimized for PHP7.1
 **/

header( "Content-Type: text/plain; charset=utf-8" );



$ts = 'now';
if( array_key_exists('ts',$_GET) ) {
    $ts = $_GET["ts"];
    if( !$ts )
        die( "UNIX Time stamp \$ts missing." );
}



if( strtolower($ts) == "now" )
  $ts = time();



echo "date(" . $ts . ")=" . date( "Y-m-d H:i:s", $ts ) . "\n";



?>