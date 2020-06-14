<?php
$rawdata = file_get_contents("php://input");
$dataJSON = json_decode($rawdata,true);

if($dataJSON['send']){
    $key = $dataJSON['key'];

    $files = array_combine(glob("json/$key*"), array_map('filectime', glob("json/$key*")));
    arsort($files);

    $jsonDataToJS = '[';
    foreach($files as $k => $v){
        $jsonDataToJS .= file_get_contents($k, true).',';
    }

    $jsonDataToJS = substr($jsonDataToJS, 0, -1);
    $jsonDataToJS .= ']';
    print_r(json_encode($jsonDataToJS, true));
} else {
    header("Location: http://www.google.com");
    exit();
}
?>