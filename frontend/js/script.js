function goToStatsPage() {
  window.location.replace("stats.html");
  sessionStorage.setItem("key", document.getElementById("APIKey").value);
}

function validate() {
  var elAPIKey = document.getElementById("APIKey");
  var errPargh = document.getElementsByClassName("errorParagraph")[0];
  var homeSqr = document.getElementsByClassName("home-square")[0];

  if (elAPIKey.value.length == 36 && /^[A-Za-z0-9]+$/.test(elAPIKey.value)) {
    document.getElementById("btn-search").style.display = "inline-block";
    if (errPargh) {
      errPargh.remove();
    }
  } else {
    document.getElementById("btn-search").style.display = "none";
    if (!errPargh) {
      var para = document.createElement("p");
      para.className = "errorParagraph";
      var node = document.createTextNode("Invalid API key");
      para.appendChild(node);
      homeSqr.appendChild(para);
    }
  }
}
/*
400	"You did not supply an API key"
401	"Your API key is not valid"
402	"Your requesting an API function that does not exist. Please check the docs"
403	"You requested a pair that does not exist"
405	"You have hit your monthly subscription allowance."
406	"You've requested a base currency that doesn't exist"
407	"Your subscription plan does not allow you to use secure HTTPS encryption."
408	"Your subscription plan does not allow you to select a base currency."
410	"The 'from' parameter was not set."
411	"The 'to' parameter was not set."
412	"The 'amount' parameter was not set"
413	"The value you entered for the amount parameter is incorrect. Please make sure it is numeric and greater than 0."
414	"One or more of the currencies is not a currency we support or has been entered invalid."
415	"One or more of the currencies you wanted to receive (limit) is not a currency we support or has been entered invalid."
416	"Your subscription plan does not allow you to use the endpoint"
417	"There is no historical data for for the date supplied."
418	"One or more of the dates you supplied were not in the correct format"
419	"We allow a maximum of 365 days. Please change this and try again."
500	"There seems to be a technical fault our end"
*/
