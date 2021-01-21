function timer() {
    $.getJSON('debug/answer.json', function (json) {

        "use strict";
    
        var content = data.content;
    });
    // set a click handler on all .box elements
    $('.box').click(function () {

    // return the first element, if it exists, of the content array that has a matching id to the clicked .box element's id
    var c = content.find(o => o.id == this.id);
  
    // make sure there was a match
    if (c) {
      // append an image with the appropriate .src property
      $('.img-product').append("<img src='" + c.image + "'>");
    }
    });
}

function toComma(i) {
    i = i.toFixed(2);
    i = i.toString().replace("." , ",");
    return i;
}

function timer() {

    $.getJSON("http://localhost:4200/api/data", function(response){
        console.log(response); // Prints: image path
        // get date from data store and convert
        var timeStamp = new Date(response.data.date);
        var date = timeStamp.toLocaleDateString();
        var time = timeStamp.toLocaleTimeString();
        
        //print values to frontend
        $("#timestamp").text("Stand: " + date + ", " + time + " Uhr");
        $("#img-product").attr("src",response.img.src);
        $("#txt-product").text(response.img.desc);
        $("#temperature").text(toComma(response.data.temperature) + " °C");
        $("#pressure").text(toComma(response.data.pressure) + " hPa");
        $("#humidity").text(toComma(response.data.humidity) + " %");
        $("#fineParts").text(toComma(response.data.fineParts) + " µg/m³");
    }).fail(function(){
        console.log("An error has occurred.");
    });
    document.getElementById("loading-spinner").style.display = "none";
}
//timer();
setTimeout(() => {  timer(); }, 2000);
//timer();
setInterval(timer, 10*1000);