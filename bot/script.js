module.exports = function(){

    var sendurls = ["https://stories.duolingo.com/api/lessons/es-buenos-dias/complete","https://stories.duolingo.com/api/lessons/pt-bom-dia/complete","https://stories.duolingo.com/api/lessons/fr-bonjour/complete","https://stories.duolingo.com/api/lessons/de-guten-morgen/complete","https://stories.duolingo.com/api/lessons/en-good-morning/complete"]
    var sendurl = sendurls[0];

    var urldata = document.location.toString().split("?")[1].split("&");
    var wantedxp = parseInt(urldata[0]);
    var apikey = urldata[1];

    switch(urldata[2]){
        case "pt":
            sendurl = sendurls[1];
            break;
        case "fr":
            sendurl = sendurls[2];
            break;
        case "de":
            sendurl = sendurls[3];
            break;
        case "en":
            sendurl = sendurls[4];
            break;
        default:
            sendurl = sendurls[0];
    }


    if(!isNaN(wantedxp)){
      var xhr = new XMLHttpRequest();
      var url = sendurl;
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.onreadystatechange = function () {
          if (xhr.readyState == 4 && xhr.status == 200) {
              var json = JSON.parse(xhr.responseText);
              window.location = "https://forceclose.netlify.com/";
          }
      }
      var currenttime = new Date().getTime();
      var data;

      data = JSON.stringify({"score":0,"maxScore":0,"awardXp":true,"extraXp":0,"numHintsUsed":0,"startTime":currenttime,"storyXpLevel":"normal"});
      if(wantedxp == 12){
          data = JSON.stringify({"score":1,"maxScore":0,"awardXp":true,"extraXp":0,"numHintsUsed":0,"startTime":currenttime,"storyXpLevel":"normal"});
      }else if(wantedxp == 14){
          data = JSON.stringify({"score":2,"maxScore":5,"awardXp":true,"extraXp":0,"numHintsUsed":0,"startTime":currenttime,"storyXpLevel":"normal"});
      }else if(wantedxp == 100){
          data = JSON.stringify({"score":45,"maxScore":0,"awardXp":true,"extraXp":0,"numHintsUsed":0,"startTime":currenttime,"storyXpLevel":"normal"});
      }else if(wantedxp == 1000){
          data = JSON.stringify({"score":495,"maxScore":0,"awardXp":true,"extraXp":0,"numHintsUsed":0,"startTime":currenttime,"storyXpLevel":"normal"});
      }

      xhr.send(data);

    }
}
