$(document).ready(function() {

  setTimeout(function() {
    $(".loading-txt").html("Completed");
    $('.loading-box').fadeOut('slow', function() {
      $(this).remove();
    });
  }, 2000);
  $("video#bgVideo")[0].src = "assets/cit.mp4";
  $("video#bgVideo").on('loadeddata', function() {

    setTimeout(function() {
      $("#bgVideo").show("slow");
      $("#bgImg").hide();

    }, 2000);
  });



  $("html").niceScroll({
    cursorborder: "solid 1px #505050",
    cursorcolor: "#000",
    background: "#505050",
    cursorwidth: "8px",
    cursoropacitymax: 0.8
  });


});
