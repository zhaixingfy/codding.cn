<?php 
require './config.php';

switch ($_REQUEST['a']) {
  case 'getFiles':
    $path = $_REQUEST['path'];
    $_path = toGBK($path);
    $result = [];

    if (!is_dir($_path)) err(1, '当前路径不是目录： '.$path);
    if (!is_readable($_path)) err(1, '当前目录不可读： '.$path);

    $handler = opendir($_path);

    while ($_name = readdir($handler)) {
      if ($_name === '.' || $_name === '..') continue;
      $name = toUTF8($_name);
      $_tmpPath = $_path.'/'.$_name;
      $result[] = [
        'name' => $name,
        'isDir' => is_dir($_tmpPath),
      ];
    }

    res($result);
    break;
}