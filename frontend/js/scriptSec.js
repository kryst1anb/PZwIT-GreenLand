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

function sendJSON() {
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "server.php", true);
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      var status = xmlhttp.status;
      if (status === 0 || (status >= 200 && status < 400)) {
        var response = this.responseText;
        console.log(response);
        if (response.includes("Error")) {
          var res = response.split("-");
          var para = document.createElement("p");
          para.className = "errorHandler";
          var node = document.createTextNode("Error " + res[1] + " - " + res[2]);
          para.appendChild(node);
          document.getElementsByClassName("detail-btn-square")[0].appendChild(para);
          if (res[1] != 405) {
            document.getElementById("btn-export").remove();
            document.getElementById("dropdown-currencies").remove();
            //TO DO WYGLAD
          }
        } else {
          var res = response.split(",");
          for (x in res) {
            var option = document.createElement("option");
            option.text = res[x];
            option.value = res[x];
            var select = document.getElementById("dropdown-currencies");
            select.appendChild(option);
          }
        }
      } else {
        console.log("Oh no! There has been an error with the request!");
      }
    }
  };

  xmlhttp.send(
    JSON.stringify({
      send: true,
      key: sessionStorage.getItem("key"),
    })
  );
}
