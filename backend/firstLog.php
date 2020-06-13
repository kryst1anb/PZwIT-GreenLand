<?php
$rawdata = file_get_contents("php://input");
$dataJSON = json_decode($rawdata,true);
$key = $dataJSON['key'];

if($dataJSON['send']){
    $check = count(glob("json/$key*"));
    if($check > 0){
        echo "true";
    }
    else{
        echo "false";
    }
} else {
    header("Location: http://www.google.com");
    exit();
}
?>