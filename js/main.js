
var NebPay = require("nebpay");
var nebPay = new NebPay();
var dappAddress = "n1v8e45CvAZB3Uj6gHFPm3aEveSuzLse3Qm";

if (typeof(webExtensionWallet) === "undefined") {
    alert("请首先安装webExtensionWallet插件");
} 

jQuery(document).ready(function($) {

	'use strict';

        $(window).load(function() { // makes sure the whole site is loaded
            $(".seq-preloader").fadeOut(); // will first fade out the loading animation
            $(".sequence").delay(500).fadeOut("slow"); // will fade out the white DIV that covers the website.
        })
      
        
        $(function() {
  
        function showSlide(n) {
            // n is relative position from current slide
          
            // unbind event listener to prevent retriggering
            $body.unbind("mousewheel");
          
            // increment slide number by n and keep within boundaries
         //   currSlide = Math.min(Math.max(0, currSlide + n), $slide.length-1);
            currSlide = n - 1;
            
            var displacment = window.innerWidth*currSlide;
            // translate slides div across to appropriate slide
            $slides.css('transform', 'translateX(-' + displacment + 'px)');
            // delay before rebinding event to prevent retriggering
            setTimeout(bind, 700);
            
            // change active class on link
            $('nav a.active').removeClass('active');
            $($('a')[currSlide]).addClass('active');
            
        }
      
        function bind() {
             $body.bind('false', mouseEvent);
          }
      
        function mouseEvent(e, delta) {
            // On down scroll, show next slide otherwise show prev slide
            showSlide(delta >= 0 ? -1 : 1);
            e.preventDefault();
        }
        
        $('nav a, .main-btn a').click(function(e) {
            // When link clicked, find slide it points to
            var newslide = parseInt($(this).attr('href')[1]);
        //    console.log("newslide:" + newslide);
            // find how far it is from current slide
            var diff = newslide - currSlide - 1;
            showSlide(newslide); // show that slide

            if(newslide == 2){
                showSearchBox();
            }
            e.preventDefault();
        });

        $(".close_btn").hover(function () { $(this).css({ color: 'black' }) }, function () { $(this).css({ color: '#999' }) }).on('click', closeSearchBox);

        $("#loginbtn").on('click', function () {
            
            var client_name = $("#client_name").val();
            var to = dappAddress;
            var value = "0";
            var callFunction = "searchClient";
            var callArgs = "[\"" + client_name + "\"]";
            $("#loading").css({display: 'block'});
            nebPay.simulateCall(to, value, callFunction, callArgs, {
                listener: searchHandle
            });
            closeSearchBox();
        });

        function searchHandle(resp){
            alert(JSON.parse(resp));
            $("#loading").css({display: 'none'});
        }

        $("#createNewOrder").on('click', function () {
            $("#OrderBox").fadeIn("slow");
            
        });

        $(".close_btn1").hover(function () { $(this).css({ color: 'black' }) }, function () { $(this).css({ color: '#999' }) }).on('click', function(){
            $("#OrderBox").fadeOut("fast");
        });

        $("#createBtn").on('click', function () {
            $("#OrderBox").fadeOut("fast");
            
        });

        $("#showAllOrder").on('click', function () {
            $("#SearchBox1").fadeIn("slow");
            
        });

        $("#createNewBranch").on('click', function () {
            $("#SearchBox2").fadeIn("slow");
            
        });

        $("#loginbtn2").on('click', function () {
            $("#SearchBox2").fadeOut("fast");
            var fac_name = $("#fac_name_2").val();
            var bra_name = $("#bra_name_2").val();
            var bra_addr = $("#bra_addr_2").val();

            var to = dappAddress;
            var value = "0";
            var callFunction = "AddPermission";
            var callArgs = "[\"" + fac_name + "\",\"" + bra_name + "\",\"" + bra_addr + "\"]";
            nebPay.call(to, value, callFunction, callArgs, {
                        listener: function(resp){
                            if( resp.txhash != null) alert("添加成功！");
                            else alert("创建失败请重试！");
                        }
                    });
        });

        $("#showAllBranch").on('click', function () {
            $("#SearchBox2").fadeOut("fast");
            var fac_name = $("#fac_name_2").val();
            var bra_name = $("#bra_name_2").val();
            var bra_addr = $("#bra_addr_2").val();

            var to = dappAddress;
            var value = "0";
            var callFunction = "AddPermission";
            var callArgs = "[\"" + fac_name + "\",\"" + bra_name + "\",\"" + bra_addr + "\"]";
            nebPay.call(to, value, callFunction, callArgs, {
                        listener: function(resp){
                            if( resp.txhash != null) alert("添加成功！");
                            else alert("创建失败请重试！");
                        }
                    });
        });



      
        $(window).resize(function(){
          // Keep current slide to left of window on resize
          var displacment = window.innerWidth*currSlide;
          $slides.css('transform', 'translateX(-'+displacment+'px)');
        });
        
        // cache
        var $body = $('body');
        var currSlide = 0;
        var $slides = $('.slides');
        var $slide = $('.slide');
      
        // give active class to first link
        $($('nav a')[0]).addClass('active');
        
        // add event listener for mousescroll
        $body.bind('false', mouseEvent);
    })        


        $('#form-submit .date').datepicker({
        });


        $(window).on("scroll", function() {
            if($(window).scrollTop() > 100) {
                $(".header").addClass("active");
            } else {
                //remove the background property so it comes transparent again (defined in your css)
               $(".header").removeClass("active");
            }
        });


});

function showSearchBox(){
    $("body").append("<div id='mask'></div>");
    $("#mask").addClass("mask").fadeIn("slow");
    $("#SearchBox").fadeIn("slow");
    $("#loading").css({display: 'none'});
}

function closeSearchBox(){
    $("#SearchBox").fadeOut("fast");
    $("#SearchBox1").fadeOut("fast");
    $("#SearchBox2").fadeOut("fast");
    $("#mask").css({ display: 'none' });
}