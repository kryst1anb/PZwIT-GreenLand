window.onload = function () {
  document.getElementById("errorHandlerMessagesContainer").style.display = "none";
  checkAPIKey();
  checkFirstLog();
  sendJSON();
};

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
  const Http = new XMLHttpRequest();
  Http.open("POST", "../../backend/firstLog.php", true);
  Http.send(
    JSON.stringify({
      send: true,
      key: sessionStorage.getItem("key"),
    })
  );
  Http.onreadystatechange = function () {
    console.log(Http.response);
    if (Http.readyState === Http.DONE) {
      if (Http.status === 200) {
        window.response = Http.responseText;
        if (window.response != "true") {
          const para = document.createElement("p");
          para.className = "errorHandlerFirstLog";

          const para2 = document.createElement("i");
          para2.className = "glyphicon glyphicon-globe";

          const node = document.createTextNode("It is your first login with this API Key, we do not have any currency data");
          para.appendChild(node);
          document.getElementsByClassName("errors-info-square")[0].appendChild(para);
          document.getElementsByClassName("errorHandlerFirstLog")[0].appendChild(para2);
          document.getElementById("btn-export").remove();
          document.getElementById("dropdown-currencies").remove();
        }
      } else {
        errorHandler();
        console.log("error");
      }
    }
  };
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
      title: "Value ($)",
    },
    data: [
      {
        type: "line",
        name: "Currency",
        connectNullData: true,
        //nullDataLineDashType: "solid",
        xValueType: "dateTime",
        xValueFormatString: "DD.MM.YYYY HH:MM TT",
        yValueFormatString: "$ #,##0.##",
        dataPoints: data,
      },
    ],
  });
  chart.render();
}

function sendJSON() {
  fetch("../../backend/server.php", {
    method: "post",
    body: JSON.stringify({
      send: true,
      key: sessionStorage.getItem("key"),
    }),
  })
    .then((res) => res.json())
    .then((res) => {
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
      console.log(responseOk);
      console.log(responseError);
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
    });
}

function checkData() {
  (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
}

function errorHandler(errorList) {
  document.getElementById("errorHandlerMessagesContainer").style.display = "block";
  errorList.forEach((error) => {
    let date = new Date(error.date * 1000);
    const para = document.createElement("p");
    para.className = "errorHandler";
    const node = document.createTextNode(
      (date.getDay() < 10 ? "0" : "") +
        date.getDay() +
        "-" +
        (date.getMonth() < 10 ? "0" : "") +
        date.getMonth() +
        "-" +
        date.getFullYear() +
        " " +
        (date.getHours() < 10 ? "0" : "") +
        date.getHours() +
        ":" +
        (date.getMinutes() < 10 ? "0" : "") +
        date.getMinutes() +
        ":" +
        (date.getSeconds() < 10 ? "0" : "") +
        date.getSeconds() +
        " Error: " +
        error.error.code +
        " " +
        error.error.message
    );
    para.appendChild(node);
    document.getElementsByClassName("error-handler")[0].appendChild(para);
  });
}
