window.onload = function () {
  checkAPIKey();
  sendJSON();
};

function goToHomePage() {
  sessionStorage.clear();
  window.location.replace("index.html");
}

function checkAPIKey() {
  if (sessionStorage.getItem("key") == null || sessionStorage.getItem("key") == "undefined") {
    goToHomePage();
  } else {
    document.getElementById("infoAPIKey").innerHTML = sessionStorage.getItem("key");
  }
}

function setUpDropdown() {
  //Inicjalizacja dropdowna po wejściu do stats.html
  const dropDown = document.getElementById("dropdown-currencies");
  const dropDownItems = Object.getOwnPropertyNames(response[0].rates);
  dropDownItems.forEach((currency) => {
    const option = document.createElement('option');
    option.text = currency;
    dropDown.appendChild(option);
  });
}

function onChangeDropdown(currency) {
  //Zmiana waluty na dropdownie przez użytkownika
  if(currency.value !== "Select an item ...") {
    drawChart(currency.value);
  } else {
    document.getElementById("chartContainer").innerText ="";
  }
}

function dataToDraw(currency){
  const data = [];
  response.forEach((object) => {
    const date = new Date(object.updated * 1000);
    data.push({x: date, y: object.rates[currency.toString()]});
  });
  return data;
}

function drawChart(currency){
  //Rysowanie wykresu
  const data = dataToDraw(currency);
  const chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      title: {
        text: "Chart of " + currency + " currency in compare to USD",
      },
      axisX: {
        title: "Date"
      },
      axisY: {
        title: "Value",
      },
      data: [{
        type: "line",
        name: "Currency",
        connectNullData: true,
        //nullDataLineDashType: "solid",
        xValueType: "dateTime",
        xValueFormatString: "DD.MM.YYYY HH:MM TT",
        yValueFormatString: "#,##0.##",
        dataPoints: data,
      }]
    });
  chart.render();
}

function sendJSON() {
  const Http = new XMLHttpRequest();
  Http.open("POST", "http://localhost:8080/pz/backend/server.php", true);
  Http.send(
      JSON.stringify({
        send: true,
        key: sessionStorage.getItem("key"),
      })
  );
  Http.onreadystatechange = function () {
    console.log(Http.response);
    if(Http.readyState === Http.DONE) {
      if(Http.status === 200) { //200 to odpowiedź z php, nie z API walut
        // window.response = Http.responseText;
        // if(response.includes("Error")){
        //   errorHandler();
        //   return;
        // } else {
        //   window.response = JSON.stringify(Http.response);
        // }
        //TODO: odkomentować to wyżej jak będzie poprawna odp z backendu i usunąć to niżej
        // window.response powoduje, że response jest globalna, żeby sie nie bawić w przekazywanie/zapisywanie gdzies odpowiedzi
          window.response = [
          {"valid":true,"updated":1591972838,"base":"USD","rates":{"AED":3.67315,"AFN":77.92035,"ALL":109.9457,"AMD":481.814,"ANG":1.7953,"AOA":599.795,"ARS":69.38617,"AUD":1.4583,"AWG":1.8,"AZN":1.7,"BAM":1.7307,"BBD":2.01949,"BCH":0.004131377814501136,"BDT":84.95716,"BGN":1.7291,"BHD":0.37757,"BIF":1897.43985,"BMD":1,"BND":1.39063,"BOB":6.90612,"BRL":5.03545,"BSD":1.00019,"BTC":0.00010578752997754131,"BTG":0.11641443538998836,"BWP":11.6776,"BZD":2.01612,"CAD":1.35867,"CDF":1845.1,"CHF":0.94958,"CLP":788.63,"CNH":7.07936,"CNY":7.0787,"COP":3771.0785,"CRC":579.11026,"CUC":1,"CUP":0.99993,"CVE":97.5746,"CZK":23.68989,"DASH":0.013594344752582924,"DJF":177.729,"DKK":6.614,"DOP":58.01869,"DZD":128.67745,"EGP":16.18571,"EOS":0.38910505836575876,"ETB":34.73117,"ETH":0.004217185028993147,"EUR":0.88678,"FJD":2.17931,"GBP":0.79646,"GEL":3.05,"GHS":5.78603,"GIP":0.79646,"GMD":51.5625,"GNF":9597.46785,"GTQ":7.69408,"GYD":209.43027,"HKD":7.7497,"HNL":24.811,"HRK":6.70974,"HTG":107.76859,"HUF":307.44,"IDR":14211.31,"ILS":3.4619,"INR":75.99575,"IQD":1193.9795,"IRR":42107.1,"ISK":134.8765,"JMD":140.52593,"JOD":0.70905,"JPY":107.307,"KES":106.45573,"KGS":74.78584,"KHR":4140.042,"KMF":433.14665,"KRW":1203.77,"KWD":0.30767,"KYD":0.83348,"KZT":404.31862,"LAK":9008.2674,"LBP":1512.2376,"LKR":185.37567,"LRD":199.26,"LSL":17.081,"LTC":0.022266755733689605,"LYD":1.39496,"MAD":9.65601,"MDL":17.17804,"MKD":54.57682,"MMK":1400.194,"MOP":7.98384,"MUR":39.7,"MVR":15.451,"MWK":737.22556,"MXN":22.3417,"MYR":4.26772,"MZN":69.6835,"NAD":17.171,"NGN":387.5695,"NIO":33.77111,"NOK":9.6087,"NPR":121.40247,"NZD":1.55374,"OMR":0.38498,"PAB":1.00019,"PEN":3.4616,"PGK":3.46366,"PHP":50.27802,"PKR":165.14796,"PLN":3.946,"PYG":6691.42155,"QAR":3.6412,"RON":4.28672,"RSD":104.245,"RUB":69.4963,"RWF":954.74744,"SAR":3.7535,"SBD":8.33606,"SCR":17.59032,"SDG":55.305,"SEK":9.331,"SGD":1.39139,"SLL":9750.5,"SOS":582.53,"SRD":7.45835,"SVC":8.75188,"SZL":17.08623,"THB":30.95855,"TJS":10.28185,"TMT":3.51,"TND":2.84115,"TOP":2.2711,"TRY":6.8345,"TTD":6.75027,"TWD":29.67219,"TZS":2315.1,"UAH":26.73694,"UGX":3720.74805,"USD":1,"UYU":42.84096,"UZS":10173.0885,"VND":23210.6305,"XAF":580.42432,"XAG":0.05659950192438307,"XAU":0.0005748183573990619,"XCD":2.70269,"XLM":13.60544217687075,"XOF":580.45,"XRP":5.161556725508413,"YER":250.415,"ZAR":17.0538,"ZMW":18.33854}},
          {"valid":true,"updated":1591972920,"base":"USD","rates":{"AED":4,"AFN":77.92035,"ALL":109.9457,"AMD":481.814,"ANG":1.7953,"AOA":599.795,"ARS":69.38617,"AUD":1.4583,"AWG":1.8,"AZN":1.7,"BAM":1.7307,"BBD":2.01949,"BCH":0.004136761329555091,"BDT":84.95716,"BGN":1.7291,"BHD":0.37757,"BIF":1897.43985,"BMD":1,"BND":1.39063,"BOB":6.90612,"BRL":5.03545,"BSD":1.00019,"BTC":0.00010582906489438258,"BTG":0.11641443538998836,"BWP":11.6776,"BZD":2.01612,"CAD":1.35839,"CDF":1845.1,"CHF":0.94984,"CLP":789.07,"CNH":7.0799,"CNY":7.0781,"COP":3771.0785,"CRC":579.11026,"CUC":1,"CUP":0.99993,"CVE":97.5746,"CZK":23.68989,"DASH":0.013598041881968996,"DJF":177.729,"DKK":6.6161,"DOP":58.01869,"DZD":128.67745,"EGP":16.18571,"EOS":0.3892565200467108,"ETB":34.73117,"ETH":0.0042202105885083665,"EUR":0.88678,"FJD":2.17931,"GBP":0.79646,"GEL":3.05,"GHS":5.78603,"GIP":0.79646,"GMD":51.5625,"GNF":9597.46785,"GTQ":7.69408,"GYD":209.43027,"HKD":7.7497,"HNL":24.811,"HRK":6.70974,"HTG":107.76859,"HUF":307.53,"IDR":14211.31,"ILS":3.4619,"INR":75.99575,"IQD":1193.9795,"IRR":42107.1,"ISK":134.8765,"JMD":140.52593,"JOD":0.70905,"JPY":107.352,"KES":106.45573,"KGS":74.78584,"KHR":4140.042,"KMF":433.14665,"KRW":1203.77,"KWD":0.30767,"KYD":0.83348,"KZT":404.31862,"LAK":9008.2674,"LBP":1512.2376,"LKR":185.37567,"LRD":199.26,"LSL":17.081,"LTC":0.02229654403567447,"LYD":1.39496,"MAD":9.65601,"MDL":17.17804,"MKD":54.57682,"MMK":1400.194,"MOP":7.98384,"MUR":39.7,"MVR":15.451,"MWK":737.22556,"MXN":22.3311,"MYR":4.26772,"MZN":69.6835,"NAD":17.171,"NGN":387.5695,"NIO":33.77111,"NOK":9.6133,"NPR":121.40247,"NZD":1.55374,"OMR":0.38498,"PAB":1.00019,"PEN":3.4616,"PGK":3.46366,"PHP":50.27802,"PKR":165.14796,"PLN":3.9473,"PYG":6691.42155,"QAR":3.6412,"RON":4.28672,"RSD":104.245,"RUB":69.5046,"RWF":954.74744,"SAR":3.7535,"SBD":8.33606,"SCR":17.59032,"SDG":55.305,"SEK":9.3331,"SGD":1.39133,"SLL":9750.5,"SOS":582.53,"SRD":7.45835,"SVC":8.75188,"SZL":17.08623,"THB":30.95855,"TJS":10.28185,"TMT":3.51,"TND":2.84115,"TOP":2.2711,"TRY":6.8346,"TTD":6.75027,"TWD":29.67219,"TZS":2315.1,"UAH":26.73694,"UGX":3720.74805,"USD":1,"UYU":42.84096,"UZS":10173.0885,"VND":23210.6305,"XAF":580.42432,"XAG":0.056605909656968184,"XAU":0.0005749588185746195,"XCD":2.70269,"XLM":13.60544217687075,"XOF":580.45,"XRP":5.167157546633597,"YER":250.415,"ZAR":17.0575,"ZMW":18.33854}},
        ];
        if(response.includes("Error")){
          errorHandler();
        }
        if(response.length !== 0) {
          setUpDropdown();
        } else {
          console.log("trzeba poczekać na dane");
          //TODO: funkcja wypisująca komunikat o tym, że trzeba poczekać na dane
        }
      } else {
        errorHandler();
        console.log("error");
      }
    }
  };
}

function errorHandler() {
  if (response.includes("Error")) {
    const res = response.split("-");
    const para = document.createElement("p");
    para.className = "errorHandler";
    const node = document.createTextNode("Error " + res[1] + " - " + res[2]);
    para.appendChild(node);
    document.getElementsByClassName("detail-btn-square")[0].appendChild(para);
    if (res[1] != 405) {
      document.getElementById("btn-export").remove();
      document.getElementById("dropdown-currencies").remove();
      //TODO WYGLAD
    }
  } else {
    //TODO jakiś uniwersalny komunikat typu "Oh, something went wrong ..."
  }
}
