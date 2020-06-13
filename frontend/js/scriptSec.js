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
  const dropDownItems = Object.getOwnPropertyNames(responseOk[0].rates);
  dropDownItems.forEach((currency) => {
    const option = document.createElement("option");
    option.text = currency;
    dropDown.appendChild(option);
  });
}

function onChangeDropdown(currency) {
  //Zmiana waluty na dropdownie przez użytkownika
  if (currency.value !== "Select an item ...") {
    drawChart(currency.value);
  } else {
    document.getElementById("chartContainer").innerText = "";
  }
}

function dataToDraw(currency) {
  const data = [];
  responseOk.forEach((object) => {
    const date = new Date(object.updated * 1000);
    data.push({ x: date, y: object.rates[currency.toString()] });
  });
  return data;
}

function drawChart(currency) {
  //Rysowanie wykresu
  const data = dataToDraw(currency);
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Chart of " + currency + " currency in compare to USD",
    },
    axisX: {
      title: "Date",
    },
    axisY: {
      title: "Value",
    },
    data: [
      {
        type: "line",
        name: "Currency",
        connectNullData: true,
        //nullDataLineDashType: "solid",
        xValueType: "dateTime",
        xValueFormatString: "DD.MM.YYYY HH:MM TT",
        yValueFormatString: "#,##0.##",
        dataPoints: data,
      },
    ],
  });
  chart.render();
}

function sendJSON() {
  fetch("http://localhost:8080/pz/backend/server.php", {
    method: "post",
    body: JSON.stringify({
      send: true,
      key: sessionStorage.getItem("key"),
    })
  })
      .then(res => res.json())
      .then(res => {
        window.response = JSON.parse(res);
        let resOk = [];
        let resError = [];
        response.forEach((object) => {
          if(object.valid) {
            resOk.push(object);
          } else {
            resError.push(object);
          }
        });
        window.responseOk = resOk;
        window.responseError = resError;
        console.log(responseOk);
        console.log(responseError);
        if(resOk.length === 0) {
          //TODO poczekaj na dane;
          //TODO: blokowanie przycisku
        }
        if (resError.length !== 0){
          errorHandler(resError);
        }
        if (responseOk.length !== 0) {
          setUpDropdown();
        }
      });
}

function errorHandler(errorList) {
  errorList.forEach((error) => {
    const para = document.createElement("p");
    para.className = "errorHandler";
    const node = document.createTextNode("Error: " + error.error.code + " " + error.error.message);
    para.appendChild(node);
    document.getElementsByClassName("detail-btn-square")[0].appendChild(para);
  });
}
