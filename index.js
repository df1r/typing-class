/*
This code simulates shifting the typewrite keyboard down, so that, for example, 
when the user strikes a "1" the character that appears on the screen is a "q". 
The constant "strike" defines the mapping of each key to another key.

Note: there is something weird about the ampersand. It is impossible to delete
a string of text that ends with an "&". I don't yet know why.

Note: After a button click, a space-button press acts as a re-click of the button.
I have to learn how to disable this, because instead of the text freezing when the
timer runs out, the typist will hit the next space bar and will erase the text.
For now I will put a 5-second delay on the end of the count-down and the re-activation
of the button.
*/
const strike = {//This is an array giving the correspondence of the keys, effectively shifting the position of the hands on the keyboard.
    1: "q", 2: "w", 3: "e",4:"r",5:"t",6:"y",7:"u",8:"i",9:"o",0:"p",'-':"[",'=':"]",'\\':"<br>",
    q:"a",w:"s",e:"d",r:"f",t:"g",y:"h",u:"j",i:"k",o:"l",p:";",'[':"'",']':"<br>",
    a:"z",s:"x",d:"c",f:"v",g:"b",h:"n",j:"m",k:",",l:".",';':"/",
    z:"1",x:"2",c:"3",v:"4",b:"5",n:"6",m:"7",',':"8",'.':"9",'/':"0",
    '!': "Q", '@': "W", '#': "E",'$':"R",'%':"T",'^':"Y",'&':"U",'*':"I",'(':"O",')':"P",'_':"{",'+':"}",
    Q:"A",W:"S",E:"D",R:"F",T:"G",Y:"H",U:"J",I:"K",O:"L",P:":",'{':"\"",'}':"<br>",'|':"<br>",
    A:"Z",S:"X",D:"C",F:"V",G:"B",H:"N",J:"M",K:" ",L:" ",':':"?",
    Z:"!",X:"@",C:"#",V:"$",B:"%",N:"^",M:" ",'<':"*",'>':"(",'?':")",
    ArrowLeft:"-",ArrowRight:"=",ArrowUp:"+",ArrowDown:"_"
};
const startCount=200;//Modify this line to make the time constraint longer or shorter, in seconds.
var countDownValue=startCount;//initialize the count-down at page load
var pageNumber;
$(".count-down").html(startCount);//display the count-down
$("#start-value").text(startCount);//insert the time constraint into the instructions
$("#goal-text").text("[Text will appear after Start button is clicked.]");
$("#start-button").on("click", onClick );//set an event listener for the button
function onClick() {//call-back function when button is pressed
    pageNumber=Math.floor(100+20*(Math.random()));
    $("#goal-text").text($("#n"+pageNumber).text());
    countDownValue=startCount;//re-start the clock
    $(".count-down").html(startCount);//display the count-down
    $("#start-button").unbind();//de-activate the button
    $("#start-button").addClass("pressed-button");//make the button look de-activated
    $("#modify-text").html("_");//add a pseudo-cursor
    $("#modify-text").removeClass("green-background");//clear the state that says the user has won
    $("#modify-text").removeClass("red-background");//clear the state that says the user has lost
    $(document).keydown( function(e)  {//set an event listener for the keyboard strikes with embedded anonymous call-back function
        switch (e.key) {//this switch handles the correspondence between the pressed keys and the resulting characters
            case "Backspace": //In this case, delete the latest character typed
                if ($("#modify-text").html().slice(-5,-1) === "<br>") {//we handle the backspace over a new-line separately, since we need to delete four characters from the string, <br>.
                    $("#modify-text").html($("#modify-text").html().slice(0,-5)+"_");//remember that the pseudo-cursor is tacked on to the end of the string.
                } else {
                    $("#modify-text").html($("#modify-text").html().slice(0,-2)+"_");
                }
            break;
            case " ": $("#modify-text").html($("#modify-text").html().slice(0,-1)+" _");
            break;
            case "Enter": $("#modify-text").html($("#modify-text").html().slice(0,-1)+"<br>"+"_");
            break;
            /* Tab takes the focus out of the window. I can't de-activate that behavior,
            so I won't try to deal with the Tab case.
            case "Tab": $("#modify-text").html($("#modify-text").html()+"    ");
            break;*/
            case "Shift"://all of these cases describe key-presses that have no effect, essentially de-activating those keys.
            case "CapsLock":
            case "Delete":
            case "Control":
            case "Escape":
            case "Meta":
            case "Unidentified":
            case "AudioVolumeMute":
            case "AudioVolumeDown":
            case "AudioVolumeUp":
            case "MediaTrackPrevious":
            case "MediaPlayPause":
            case "MediaTrackNext":
            break;
            default:  $("#modify-text").html($("#modify-text").html().slice(0,-1)+strike[e.key]+"_");//remove cursor, add new character, add cursor 
        }
        if ($("#modify-text").text().slice(0,-1) === $("#goal-text").text()) {//check whether the user won, and if so, de-activate the keyboard, stop the timer, re-activate the button after a five-second delay, and make the box green.
            $(document).unbind();
            clearInterval(x);
            setTimeout(function() {
                $("#start-button").on("click", onClick);
                $("#start-button").removeClass("pressed-button");
            },5000);
            $("#modify-text").addClass("green-background");
        } 
    });//end of keyboard event-listener call-back function. We are still inside the click call-back function
    var x=setInterval(function() {//start the timer
        countDownValue--;
        $(".count-down").html(countDownValue);
        if ( countDownValue <= 0 ) {//check whether the user lost, and if so, stop the count-down, de-activate the keyboard, make the box red, and after a five-second delay, re-activate the button
            clearInterval(x);
            $(document).unbind();
            $("#modify-text").addClass("red-background");
            setTimeout(function() {
                $(".count-down").html(countDownValue);
                $("#start-button").on("click", onClick);
                $("#start-button").removeClass("pressed-button");
            },5000);
        }
    },1000);
}

//Grab the text to be typed randomly from the first paragraph on some Wikipedia page.
//why can't I backspace past the ampersand?
//Learn how to change the "focus?" so that the space key doesn't re-click the button.
