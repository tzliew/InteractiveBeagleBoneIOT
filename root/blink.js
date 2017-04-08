var b = require('bonescript'); 
var led = "P8_13"; 
var state = 0; 
b.pinMode(led, 'out'); 
toggleLED = function() {
 state = state ? 0 : 1;
 b.digitalWrite(led, state);
};
timer = setInterval(toggleLED, 100); 
stopTimer = function() {
 clearInterval(timer);
};
setTimeout(stopTimer, 30000);
