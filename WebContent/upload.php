<?php
//error_reporting(E_ALL);
//ini_set("display_errors", 1);
print_r($_FILES);
mkdir ("/tmp/phonegap/uploads", 0777, true); 
move_uploaded_file($_FILES["file"]["tmp_name"],"/tmp/phonegap/uploads/".$_FILES["file"]["name"]);
?>