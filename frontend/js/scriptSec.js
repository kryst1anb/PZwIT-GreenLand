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
  response.forEach((object) => {
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
  const Http = new XMLHttpRequest();
  Http.open("POST", "../../backend/server.php", true);
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
        //200 to odpowiedź z php, nie z API walut
        window.response = Http.responseText;
        if (response.includes("Error")) {
          errorHandler();
          return;
        } else {
          window.response = JSON.stringify(Http.response);
        }
        if (response.includes("Error")) {
          errorHandler();
        }
        if (response.length !== 0) {
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
