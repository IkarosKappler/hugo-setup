<?php

/**
 * This script generates a random character sequence with the given $length
 * (defaule length=32).
 *
 * Following algorithms $algorithm are available:
 *  - char
 *  - md5
 *  - sha1 (default)
 *
 * Inspired by
 *  http://stackoverflow.com/questions/637278/what-is-the-best-way-to-generate-a-random-key-within-php
 *
 * @author   Ikaros Kappler
 * @modified 2015-12-01 Ikaros Kappler (added 'addDelimiters' param).
 * @modified 2016-03-08 Ikaros Kappler (added 'upperCase' param).
 * @date     2015-01-11
 **/

header( "Content-Type: text/plain; charset=utf-8" );


/* Set defaults */
$length        = 32;
$algorithm     = "sha1";
$addDelimiters = true;
$upperCase     = false;


/* Fetch params */
if( array_key_exists("length",$_GET) && $_GET["length"] )
  $length = $_GET["length"];
if( array_key_exists("algorithm",$_GET) && $_GET["algorithm"] )
  $algorithm = $_GET["algorithm"];
if( array_key_exists("addDelimiters",$_GET) && !$_GET["addDelimiters"] )
  $addDelimiters = false;
if( array_key_exists("upperCase",$_GET) && $_GET["upperCase"] )
  $upperCase = true;

/* Define functions */
function rand_char($length) {
  $random = '';
  for ($i = 0; $i < $length; $i++) {
    $random .= chr(mt_rand(33, 126));
  }
  return $random;
}

function rand_sha1($length) {
  $max = ceil($length / 40);
  $random = '';
  for ($i = 0; $i < $max; $i ++) {
    $random .= sha1(microtime(true).mt_rand(10000,90000));
  }
  return substr($random, 0, $length);
}

function rand_md5($length) {
  $max = ceil($length / 32);
  $random = '';
  for ($i = 0; $i < $max; $i ++) {
    $random .= md5(microtime(true).mt_rand(10000,90000));
  }
  return substr($random, 0, $length);
}

function addDelimiters( $addDelimiters, $key ) {
  if( !$addDelimiters )
    return $key;

  echo "Raw           : " . $key . "\n";

  $tokens = array();
  $len    = strlen($key);
  if( $len > 8 ) {
    $tokens[] = substr($key,0,8);
    if( $len > 12 ) {
      $tokens[] = substr($key,8,4);
      if( $len > 16 ) {
	$tokens[] = substr($key,12,4);
	if( $len > 20 ) {
	  $tokens[] = substr($key,16,4);
	  if( $len > 24 ) {
	    $tokens[] = substr($key,20);
	  }
	}
      } 
    }
    //echo "tokens=" . $tokens . "\n";
    return implode("-",$tokens);
  } else {
    return $key;
  }
}

function handleCase( $str, $upperCase ) {
  if( $upperCase )
    return strtoupper($str);
  else
    return strtolower($str);
}

echo "length        : " . $length . "\n";
echo "algorithm     : " . $algorithm . " (available: sha1, md5, char)\n";
echo "addDelimiters : " . $addDelimiters . "\n";
echo "upperCase     : " . $upperCase . "\n";
if( $algorithm == "sha1" )
  echo "rand_sha1     : " . handleCase(addDelimiters($addDelimiters,rand_sha1($length)),$upperCase) . "\n";
else if( $algorithm == "md5" )
  echo "rand_md5      : " . handleCase(addDelimiters($addDelimiters,rand_md5($length)),$upperCase) . "\n";
else if( $algorithm == "char" ) 
  echo "rand_char     : " . handleCase(addDelimiters($addDelimiters,rand_char($length)),$upperCase) . "\n";
else
  echo "Illegal algorihm.\n";

?>