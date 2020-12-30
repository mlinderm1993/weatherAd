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


function timer() {
    $.getJSON("debug/answer.json", function(data){
        console.log(data.image); // Prints: image path
        $("#img-product").attr("src",data.ProductImage);
        $("#txt-product").text(data.ProductText);
    }).fail(function(){
        console.log("An error has occurred.");
    });
    var now = new Date(Date.now());
    var formatted = (now.getHours() < 10 ? '0' : '') + now.getHours() + ":" + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes() +  ":" + (now.getSeconds() < 10 ? '0' : '') + now.getSeconds() + " Uhr";
    document.getElementById("loading-spinner").style.display = "none";
    $("#timestamp").text("Stand: " + formatted);
}
//timer();
setTimeout(() => {  timer(); }, 2000);
//timer();
setInterval(timer, 3*1000);