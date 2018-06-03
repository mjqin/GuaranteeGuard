
var NebPay = require("nebpay");
var nebPay = new NebPay();
var dappAddress = "n1hfkz1HTBT5tUkAFXX7WVmVx9vXr52knco";

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
            if(newslide==2){
                $("#loading").css({display: 'none'});
            }
            if(newslide==3){
                $("#loading1").css({display: 'none'});
            }
            if(newslide==4){
                $("#loading2").css({display: 'none'});
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

        function addOrder(order){
            var manufacturer = order.manufacturer,
                branch = order.branch,
                client = order.client,
                product = order.product,
                createTime = order.createTime,
                validTime = order.validTime,
                guaranteeContent = order.guaranteeContent,
                status = order.status;
            var statusContent;
            if(status) statusContent = "有效";
            else statusContent = "已过期";
            var content = "<div class=\"col-md-6\"><p>" + 
                "厂商名称：" + manufacturer + "</br>" + 
                "分部名称：" + branch + " </br>" + 
                "客户名称：" + client + "</br>"  + 
                "产品名称：" + product + "</br>" + 
                "创建时间：" + createTime + "</br>" + 
                "有效期至：" + validTime + "</br>" + 
                "保修内容：" + guaranteeContent + "</br>" + 
                "状态：" + statusContent + "</br>" + 
                "</p></div>"
            $("#myOrder").append(content);
        }

        function searchHandle(resp){
        //    alert(JSON.stringify(resp));
            $("#loading").css({display: 'none'});
            if(resp == null || resp.execute_err != "") {
                    alert(resp.execute_err);
                    return;
                }
            var result = JSON.parse(resp.result);
            for(var i in result){
                addOrder(result[i]);
            }
        }

        $("#showClient").on('click', function () {
            showSearchBox();
        });

        $("#createNewOrder").on('click', function () {
            $("#OrderBox").fadeIn("slow");
        });

        $(".close_btn1").hover(function () { $(this).css({ color: 'black' }) }, function () { $(this).css({ color: '#999' }) }).on('click', function(){
            $("#OrderBox").fadeOut("fast");
        });

        $("#createBtn").on('click', function () {
            $("#OrderBox").fadeOut("fast");
            var name = $("#name").val();
            var branch_name = $("#branch_name").val();
            var client = $("#client").val();
            var product = $("#product").val();
            var valid_time = $("#valid_time").val();
            var content = $("#content").val();

            if(name == null || name == "" 
                || branch_name == null || branch_name == "" 
                || client == null || client == ""
                || product == null || product == "" 
                || valid_time == null || valid_time == "" 
                || content == null || content == ""  ){
                alert("所有字段都不能为空！");
                return;
            }

            var createTime = new Date().toLocaleDateString();

            var to = dappAddress;
            var value = "0";
            var callFunction = "CreateNewGuarantee";
            var callArgs = "[\"" + name + "\",\"" + branch_name + "\",\"" + client + "\",\"" + 
                                product + "\",\"" + createTime + "\",\"" + valid_time + "\",\"" + content + "\"]";
            nebPay.call(to, value, callFunction, callArgs, {
                listener: createHandle
            });
        });

        function createHandle(resp){
          //  alert(JSON.stringify(resp));
            if( resp.txhash != null) alert("创建成功！");
            else alert("创建失败请重试！");
        }

        $("#showAllOrder").on('click', function () {
            $("#SearchBox1").fadeIn("slow");
        });

        $("#loginbtn1").on('click', function () {
            var fac_name = $("#fac_name_1").val();
            var bra_name = $("#bra_name_1").val();
            if(fac_name == null || fac_name == "" || bra_name == null || bra_name == ""){
                alert("所有字段都不能为空！");
                return;
            }
            var to = dappAddress;
            var value = "0";
            var callFunction = "searchBranchGuarantee";
            var callArgs = "[\"" + fac_name + "\",\"" + bra_name + "\"]";
            $("#SearchBox1").fadeOut("fast");
            $("#loading1").css({display: 'block'});
            nebPay.simulateCall(to, value, callFunction, callArgs, {
                        listener: showAllHandle
                    });
        });

        function showAllHandle(resp){
            if(resp == null ){
                alert("查询失败，请重试");
                return;
            }
            if(resp.execute_err != ""){
                alert(resp.execute_err);
                return;
            }
            var result = JSON.parse(resp.result);
            $("#loading1").css({display: 'none'});
            for(var i in result){
                addBranchOrder(result[i]);
            }
        }

        function addBranchOrder(order){
            var manufacturer = order.manufacturer,
                branch = order.branch,
                client = order.client,
                product = order.product,
                createTime = order.createTime,
                validTime = order.validTime,
                guaranteeContent = order.guaranteeContent,
                status = order.status;
            var statusContent;
            if(status) statusContent = "有效";
            else statusContent = "已过期";
            var content = "<div class=\"col-md-6\"><p>" + 
                "厂商名称：" + manufacturer + "</br>" + 
                "分部名称：" + branch + " </br>" + 
                "客户名称：" + client + "</br>"  + 
                "产品名称：" + product + "</br>" + 
                "创建时间：" + createTime + "</br>" + 
                "有效期至：" + validTime + "</br>" + 
                "保修内容：" + guaranteeContent + "</br>" + 
                "状态：" + statusContent + "</br>" + 
                "</p></div>"
            $("#showAllOrderContent").append(content);

        }

        $("#createNewBranch").on('click', function () {
            $("#SearchBox2").fadeIn("slow");
        });

        $("#loginbtn2").on('click', function () {
            $("#SearchBox2").fadeOut("fast");
            var fac_name = $("#fac_name_2").val();
            var bra_name = $("#bra_name_2").val();
            var bra_addr = $("#bra_addr_2").val();

            if(fac_name == null || fac_name == "" || bra_name == null || bra_name == "" || bra_addr == null || bra_addr == ""){
                alert("所有字段都不能为空！");
                return;
            }

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
            $("#SearchBox3").fadeIn("slow");
        });

        $("#loginbtn3").on('click', function () {
            $("#SearchBox3").fadeOut("fast");
            var fac_name = $("#fac_name_3").val();

            if(fac_name == null || fac_name == ""){
                alert("字段都不能为空！");
                return;
            }

            var to = dappAddress;
            var value = "0";
            var callFunction = "searchPermission";
            var callArgs = "[\"" + fac_name + "\"]";
            $("#loading2").css({display: 'block'});
            $("#warning1").text("");
            nebPay.simulateCall(to, value, callFunction, callArgs, {
                        listener: showPermissionHandle
                    });
        });

        function showPermissionHandle(resp){
            $("#loading2").css({display: 'none'});
            if(resp == null) {
                alert("执行失败，请重试");
                return;
            }
            if(resp.execute_err != ""){
                alert(resp.execute_err);
                return;
            }
            var result = JSON.parse(resp.result);
            if(result.length == 0){
                var content = "<div class=\"col-md-12\"><p id=\"warning1\">" + 
                    "暂无分部，请给分部授予权限。"
                    "</p></div>";
                $("#showPermissionContent").append(content);
            }else{
                for(var i in result){
                    addPermissions(result[i]);
                }
            }
            
        }

        function addPermissions(branch){
            var name = branch.name, 
                addr = branch.addr, 
                isValid = branch.valid;

            var statusContent;
            if(isValid) statusContent = "权限有效";
            else statusContent = "权限已过期";
            var content = "<div class=\"col-md-12\"><p>" + 
                "分部名称：" + name + " </br>" + 
                "分部地址：" + addr + "</br>"  + 
                "状态：" + statusContent + "</br>" + 
                "</p></div>"
            $("#showPermissionContent").append(content);
        }

        $("#createNewCaptical").on('click', function () {
            $("#SearchBox4").fadeIn("slow");
        });

        $("#loginbtn4").on('click', function () {
            $("#SearchBox4").fadeOut("fast");
            var fac_name = $("#fac_name_4").val();

            if(fac_name == null || fac_name == ""){
                alert("字段不能为空！");
                return;
            }

            var to = dappAddress;
            var value = "0";
            var callFunction = "CreateManufacturer";
            var callArgs = "[\"" + fac_name + "\"]";
            nebPay.call(to, value, callFunction, callArgs, {
                        listener: function(resp){
                            if( resp.txhash != null) alert("创建成功！");
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
    $("#SearchBox3").fadeOut("fast");
    $("#SearchBox4").fadeOut("fast");
    $("#mask").css({ display: 'none' });
}