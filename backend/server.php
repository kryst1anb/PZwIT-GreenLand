<?php
    // set_time_limit(0);
    // while (true){
    // $key = "rziZsXX2Skmc31Iq6gob3dfgQDMUb4ceowC0";
    //     $json = file_get_contents("https://currencyapi.net/api/v1/rates?key=$key");
    //     $obj = json_decode($json);
    //     $getAPITime = $obj->{'updated'};
    //     file_put_contents("json/$key-$getAPITime.json", $json);
    //     file_put_contents($file, $json);
    //     sleep(3600);
    // }

    $rawdata = file_get_contents("php://input");
    $dataJSON = json_decode($rawdata,true);
    $key = $dataJSON['key'];
    set_time_limit(0);
    if($dataJSON['send']){
//        while (true){
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, "https://currencyapi.net/api/v1/rates?key=$key");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $json = curl_exec($ch);

            $obj = json_decode($json,true);

            if(curl_getinfo($ch, CURLINFO_HTTP_CODE) !== 200) {
                echo " Error-".$obj['error']['code']."-".$obj['error']['message'];
            } else{
                $getAPITime = $obj['updated'];
                file_put_contents("json/$key-$getAPITime.json", $json);

                $files = array_combine(glob("json/$key*"), array_map('filectime', glob("json/$key*")));
                arsort($files);
                $data = json_decode(file_get_contents(key($files)),true);

                echo json_encode($data);
            }

            curl_close($ch);
//            sleep(3600);
//      }
    } else
      {
          header("Location: http://www.google.com");
          exit();
      }
?>
