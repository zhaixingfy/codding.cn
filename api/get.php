<?php 
require './config.php';

switch ($_REQUEST['a']) {
  case 'get':
    echo file_get_contents($_REQUEST['url']);
    break;
  default:
    err(1, '未处理的action: '.$_REQUEST['a']);
    break;
}