<?php
    $rawdata = file_get_contents("php://input");
    $dataJSON = json_decode($rawdata,true);
    $key = $dataJSON['key'];
    set_time_limit(0);
    if($dataJSON['send']){
    while (true){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://currencyapi.net/api/v1/rates?key=$key");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $json = curl_exec($ch);
        
        $obj = json_decode($json,true);

        if(curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) {
            $date = new DateTime(date("Y-m-d H:i:s"));
            $getAPITime = date_format($date, 'U');
            
            file_put_contents("json/$key-$getAPITime.json", $json);
            $files = array_combine(glob("json/$key*"), array_map('filectime', glob("json/$key*")));
            arsort($files);

            $jsonDataToJS = '{"json":[';
            foreach($files as $k => $v){
                $jsonDataToJS .= file_get_contents($k, true).',';
            }
            $jsonDataToJS = substr($jsonDataToJS, 0, -1);
            $jsonDataToJS .= ']}';
            print_r(json_decode($jsonDataToJS, true));
        } else{
            $getAPITime = $obj['updated'];
            file_put_contents("json/$key-$getAPITime.json", $json);

            $files = array_combine(glob("json/$key*"), array_map('filectime', glob("json/$key*")));
            arsort($files);

            $jsonDataToJS = '{"json":[';
            foreach($files as $k => $v){
                $jsonDataToJS .= file_get_contents($k, true).',';
            }
            $jsonDataToJS = substr($jsonDataToJS, 0, -1);
            $jsonDataToJS .= ']}';
            print_r(json_decode($jsonDataToJS, true));
        }
        curl_close($ch);
        sleep(3600);
      }
    } else {
        header("Location: http://www.google.com");
         exit();
    }
?>
