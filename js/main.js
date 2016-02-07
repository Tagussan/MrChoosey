(function() {
  'use strict';

  $(document).on('blur', 'textarea,input', function () {
    if($(this).val() != ""){
      $(this).addClass('active');
    }
  });

  /*** START UP ***/
  $(document).ready(function() {
  });

  $(window).on('load', function() {
    $("#loader").fadeOut();
    setTimeout(function(){
      $("#preload").fadeIn();
    },1000);
  });

  $(window).on('scroll', function() {
  });

  /*** recalculate page when windows size is changed ***/
  var timer = false;
  $(window).resize(function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {

    }, 200);
  });

  /*** Jump to Label ***/
  $('a[href^=#]').click(function(){
    var speed = 500;
    var href= $(this).attr("href");
    var jumpTarget = $(href == "#" || href == "" ? 'html' : href);
    var position = jumpTarget.offset().top;
    $("html, body").animate({scrollTop:position - menuOffset}, speed, "swing");
    return false;
  });

  /*** Hover for iOS device ***/
  $('*').on('touchstart',function(){
    $(this).addClass("hover");
  }).on('touchend',function(){
    $(this).removeClass("hover");
  });

})();

function preloadImg() {
	for(var i = 0; i< arguments.length; i++){
		$("<img>").attr("src", arguments[i]);
	}
}
