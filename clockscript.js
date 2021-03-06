$(document).ready(function() {
	//Wrapper contains the active 10 minute break divs. Is hidden as long as breakexplain is being shown.
	$(".wrapper").hide();
    /* 
    WARNING MESSAGE FOR REFRESH. TBA upon completion.
    
    window.onbeforeunload = function() {
        return "WARNING...THE CLOCK WILL BE RESET";
    }
    */

    //Function pad makes it so that a number has a 0 before it if it's a single digit.
    function pad(d) {
    	return (d < 10) ? '0' + d.toString() : d.toString();
    }

    //Function takes care of counting down
    function timer(initialTime, totalInterval, tickerId, display){
    	var time = new Date().getTime() - initialTime;

        var elapsed = Math.floor(time / 1000) ;

        var t = totalInterval-elapsed;
        var hours = Math.floor(
            t/3600
            );
        var minutes = Math.floor(
            (t%3600)/60
            );
        var seconds = Math.floor(
            (t%3600)%60
            );
        
        $(display).html(hours + 'h ' + pad(minutes) + 'm ' + pad(seconds));
       
        alarmSequence(elapsed, totalInterval, tickerId);
        progressValue(elapsed, totalInterval);
        
    }

    function recessTimer(initialTime, totalInterval, tickerId, display){
    	var time = new Date().getTime() - initialTime;

        var elapsed = Math.floor(time / 1000) ;

        var t = totalInterval-elapsed;
        var hours = Math.floor(
            t/3600
            );
        var minutes = Math.floor(
            (t%3600)/60
            );
        var seconds = Math.floor(
            (t%3600)%60
            );
        
        $(display).html(minutes+ 'm ');

        //Takes care of closing the recess timer when the break is over
    	if (elapsed >= totalInterval) {
    		clearInterval(tickerId);
    		$(display).html('');
    		$(display).removeClass("active");
    	};
    }

	//Alarm sequence
	function alarmSequence(elapsed, totalInterval, tickerId){
		switch(elapsed){
	    	//70 min break
	    	case 4200:
	    		recessAlarm();
	    		break;
	    	//80 min resume
	    	case 4800:
	    		resumeAlarm();
	    		break;
	    	//130 min break
	    	case 7800:
	    		recessAlarm();
	    		break;
	    	//140 min resume
	    	case 8400:
	    		resumeAlarm();
	    		break;
	    	//170 min break
	    	case 10200:
	    		recessAlarm();
	    		//Transitions background colour over 10 min.
	    		$("body").animate({backgroundColor: '#FFC107'}, 600000);
	    		break;
	    }
	    //Closing alarm. Productivity session success!
		if (elapsed >= totalInterval) {
			closingAlarm(tickerId);
		};	
	}
	//Progress bar updater
	function progressValue(elapsed, totalInterval){

		if (elapsed>=totalInterval) {
			$('.progressvalue').width("100%");
		}
		else {
			var fraction = elapsed/totalInterval;
			var lengthCompleted = fraction*100 + '%';
			$('.progressvalue').width(lengthCompleted);
		}
	}

	//Alarms
	function recessAlarm(){
		var audio = new Audio('sounds/Temple_Bell.mp3');
		audio.play();
		breakCounter++;
		var activeRecessDiv = ".recessDigits" + breakCounter;
		$(activeRecessDiv).addClass("active");
		var startTime = new Date().getTime();
		//The 10 minute recess updater. Function runs once a minute to reflect minutes left in break.
		recessTicker = setInterval(function(){recessTimer(startTime, 600, recessTicker, activeRecessDiv);}, 60000);
	}

	function resumeAlarm(){
		var audio = new Audio('sounds/Car_Door.mp3');
		audio.play();
	}

	function closingAlarm(tickerId){
		var audio = new Audio('sounds/Ship_Bell.mp3');
		audio.play();
		clearInterval(tickerId);
	}
	
	//Global variables to coordinate between the event handlers, and be able to terminate ticker from outside of the function.
	var clicked = true;
	var tickerLong;
	var recessTicker;
	var breakCounter = 0;
	
	//Start button event handler
    $(".button").click(function(){
		if (clicked) {
			$(".digits").fadeOut(1000).fadeIn(200);
			initialTime = new Date().getTime();
		    tickerLong = setInterval(function(){ timer(initialTime, 10800, tickerLong, '.digits');}, 1000);
		    $(".digits").removeClass("button");
		    $(".progressvalue").animate({width: "0"}, 1200);
		    
		    $(".breakexplain").fadeOut(1000);
		    setTimeout(function(){$(".wrapper").fadeIn(200);}, 1000);
		};
		clicked = false;
    });
    
    //Reset button event handler
    $(".reset").click(function(){
		clicked = true;
		breakCounter = 0;
		//Resets background colour
		$("body").animate({backgroundColor: '#00BCD4'}, 10000); 
    	clearInterval(tickerLong);
    	$(".progressvalue").animate({width: "100%"}, 1000);
    	$(".digits").addClass("button").fadeOut(500).fadeIn(500);
    	setTimeout(function(){$(".button").html("START WORKING FOR 3 HOURS");}, 500);
    	
    	//Resets 10 min recess breaks
    	clearInterval(recessTicker);
    	$(".wrapper").fadeOut(500);
    	setTimeout(function(){
    		$(".recessDigits1, .recessDigits2, .recessDigits3").html("10m");
    		$('.breakexplain').fadeIn(500);
    	},500);
    });
   
});