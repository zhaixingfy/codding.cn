<?php 
error_reporting(0);

if (strpos($_SERVER['HTTP_REFERER'], '540')) {
  header('Access-Control-Allow-Origin: *');
}

function res($data) {
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function err($code, $msg) {
  res(Array(
    'code' => $code,
    'msg' => $msg,
  ));
  exit;
}