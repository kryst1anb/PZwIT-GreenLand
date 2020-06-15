<?php
    $rawdata = file_get_contents("php://input");
    $dataJSON = json_decode($rawdata,true);
    $key = $dataJSON['key'];

    set_time_limit(0);
    if($dataJSON['send']){
       while (true){
           sleep(3600);
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://currencyapi.net/api/v1/rates?key=$key");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $json = curl_exec($ch);
    
            $obj = json_decode($json,true);
    
            if(curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) {
                $date = new DateTime(date("Y-m-d H:i:s"));
                $getAPITime = date_format($date, 'U'); 
                $json = $json[0]."\"date\":".$getAPITime.", ".substr($json, 1, strlen($json) - 1);
                //file_put_contents("json/$key-$getAPITime.json", $json);
                $fp = fopen("json/$key-$getAPITime.json","w");
                fwrite($fp,$json);
                fclose($fp);

            } else {
                $getAPITime = $obj['updated'];
                //file_put_contents("json/$key-$getAPITime.json", $json);
                $fp = fopen("json/$key-$getAPITime.json","w");
                fwrite($fp,$json);
                fclose($fp);
            }
            curl_close($ch);
        }
     } else {
          header("Location: http://www.google.com");
          exit();
    }
?>
