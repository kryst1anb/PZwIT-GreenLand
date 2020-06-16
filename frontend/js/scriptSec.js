window.onload = function () {
  document.getElementById("errorHandlerMessagesContainer").style.display = "none";
  checkAPIKey();
  checkFirstLog();
};

function selectDropDownValueAfterRefresh(currency) {
  if (sessionStorage.getItem("selectedCurrency") != null) {
    let i = 1; //bo 0 to Select an item ...
    if (responseOk) {
      const dropDownItems = Object.getOwnPropertyNames(responseOk[0].rates);
      for(let el of dropDownItems){
        if(el === currency){
          break;
        } else {
          i++;
        }
      }
      document.getElementById("dropdown-currencies").options.selectedIndex = i;
      return true;
    }
  }
  return false;
}

function goToHomePage() {
  // wylogowanie
  sessionStorage.clear();
  window.location.replace("index.html");
}

function checkAPIKey() {
  // sprawdzane czy został podany klucz api
  if (sessionStorage.getItem("key") == null || sessionStorage.getItem("key") == "undefined") {
    goToHomePage();
  } else {
    document.getElementById("infoAPIKey").innerHTML = sessionStorage.getItem("key");
  }
}

function checkFirstLog() {
  // Sprawdzenie czy logowanie z api nastąpiło wpierwszy raz jeżeli tak to leci komunikat i blokowane są przyciski jeżeli nie nic nie jest robione
  fetch("../../backend/firstLog.php", {
    method: "post",
    body: JSON.stringify({
      send: true,
      key: sessionStorage.getItem("key"),
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res) {
        const para = document.createElement("p");
        para.className = "errorHandlerFirstLog";

        const para2 = document.createElement("i");
        para2.className = "glyphicon glyphicon-globe";

        const node = document.createTextNode("It is your first login with this API Key, we do not have any currency data");
        para.appendChild(node);
        document.getElementsByClassName("errors-info-square")[0].appendChild(para);
        document.getElementsByClassName("errorHandlerFirstLog")[0].appendChild(para2);
        document.getElementById("btn-export").style.display = "none";
        document.getElementById("dropdown-currencies").style.display = "none";
        sendJSON("server.php", true);
      } else {
        sendJSON("errorServer.php", false);
        sendJSON("server.php", true);
      }
    });
}

function setUpDropdown() {
  //Inicjalizacja dropdowna po wejściu do stats.html
  const dropDown = document.getElementById("dropdown-currencies");
  const dropDownItems = Object.getOwnPropertyNames(responseOk[0].rates);
  dropDownItems.forEach((currency) => {
    const option = document.createElement("option");
    option.id = currency;
    option.text = currency;
    dropDown.appendChild(option);
  });
}

function onChangeDropdown(currency) {
  //Zmiana waluty na dropdownie przez użytkownika
  if (currency.value !== "Select an item ...") {
    sessionStorage.setItem("selectedCurrency", currency.value);
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
  document.getElementsByClassName("copyright")[0].style.position = "inherit";
  document.getElementsByClassName("copyright")[0].style.marginBottom = "70px";
  document.getElementById("chartContainer").style.display = "block";

  const data = dataToDraw(currency);
  const chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    backgroundColor: "#ebebeb90",
    title: {
      text: "Chart of " + currency + " currency in compare to USD",
    },
    axisX: {
      title: "Date",
    },
    axisY: {
      title: "Value",
      includeZero: false,
    },
    data: [
      {
        type: "line",
        name: "Currency",
        connectNullData: true,
        xValueType: "dateTime",
        xValueFormatString: "DD.MM.YYYY HH:MM TT",
        yValueFormatString: "#,##0.####### " + currency,
        dataPoints: data,
      },
    ],
  });
  chart.render();
}

function sendJSON(serverFileName, firstUse) {
  fetch("../../backend/" + serverFileName, {
    method: "post",
    body: JSON.stringify({
      send: true,
      key: sessionStorage.getItem("key"),
    }),
  })
    .then((res) => res.json())
    .then((res) => {
      if (!firstUse) {
        window.response = JSON.parse(res);
        let resOk = [];
        let resError = [];
        response.forEach((object) => {
          if (object.valid) {
            resOk.push(object);
          } else {
            resError.push(object);
          }
        });
        window.responseOk = resOk;
        window.responseError = resError;
        if (resOk.length === 0) {
          //TODO poczekaj na dane;
          //TODO: blokowanie przycisku
        }
        if (resError.length !== 0) {
          errorHandler(resError);
        }
        if (responseOk.length !== 0) {
          setUpDropdown();
        }
        if (sessionStorage.getItem("selectedCurrency")) {
          if (selectDropDownValueAfterRefresh(sessionStorage.getItem("selectedCurrency"))) {
            drawChart(sessionStorage.getItem("selectedCurrency"));
          }
        }
        document.getElementById("btn-export").style.display = "block";
        document.getElementById("dropdown-currencies").style.display = "block";
        if (document.getElementsByClassName("errorHandlerFirstLog")[0]) {
          document.getElementsByClassName("errorHandlerFirstLog")[0].innerHTML = "";
        }
      } else {
        return;
      }
    })
    .then(
      setTimeout(() => {
        sendJSON("errorServer.php", false);
      }, 60000)
    );
}

function checkData(data) {
  return (data < 10 ? "0" : "") + data;
}

function errorHandler(errorList) {
  let dateToString = "";
  const root = document.getElementById("error-handler");
  const childrens = document.getElementById("error-handler").children;
  if(childrens.length > 0) {
    for (let i = 0; i < childrens.length;) {
      root.removeChild(childrens[i]);
    }
  }

  document.getElementById("errorHandlerMessagesContainer").style.display = "block";
  errorList.forEach((error) => {
    let date = new Date(error.date * 1000);
    const para = document.createElement("p");
    para.id = "errorHandler";
    const node = document.createTextNode(
        getDate(date) +
        " Error: " +
        error.error.code +
        " " +
        error.error.message
    );
    para.appendChild(node);
    dateToString = date.toLocaleString().split(",");
    document.getElementById("error-handler").appendChild(para);
  })
}

function getDate(date){
  return date.getDate() +
      "-" +
      checkData(date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      " " +
      checkData(date.getHours()) +
      ":" +
      checkData(date.getMinutes()) +
      ":" +
      checkData(date.getSeconds())
}

function exportData() {
  //Pierwszy wiersz
  const currencies = Object.getOwnPropertyNames(responseOk[0].rates);
  var data = [
    [ "---",  currencies]
  ];
  //kolejne wiersze
  responseOk.forEach((response) => {
    const date = new Date(response.updated * 1000);
    let newRow = [getDate(date)];
    for(const key in response.rates){
      //pojedynczy wiersz
      newRow.push(response.rates[key]);
    }
    data.push(newRow);
  });

  //Eksport danych
  var csv = 'GreenLand$,All data export\n';
  data.forEach(function(row) {
    csv += row.join(',');
    csv += "\n";
  });

  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'currencies.csv';
  hiddenElement.click();
}
