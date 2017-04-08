var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
connections = [];

server.listen(process.env.PORT || 8084);
console.log('Server running...');

app.get('/',function(req,res){
       res.sendFile(__dirname + '/index.html');
});

var b = require('bonescript');
var led = "P8_13";
var state = 0;
var motion_info = [0,0,0];     //motion_info format is [Motions Detected, Long Motions, Short Motions]
var accumulate = 0;
var printmotion = 1;
b.pinMode(led, 'out');

io.sockets.on('connection',function(socket){
       connections.push(socket);
       console.log('Connected: %s sockets connected', connections.length);
       socket.on('led on', function(data){
               if(data==1){
                       console.log("LED ON");
                       b.digitalWrite(led, 1);
               }else{
                       console.log("LED OFF");
                       b.digitalWrite(led, 0);
               }
       });

       //run all the step when the PIR motion sensor On, check every second
       socket.on('motion on', function(data){
	       console.log(data);
               if(data==1){
                       console.log("PIR motion ON.");
                       b.pinMode('P8_19', b.INPUT);
                       interval = setInterval(checkPIR, 2000);
               }else{
		       console.log("PIR motion OFF.");
                       clearInterval(interval);
               }
       });

       function checkPIR(){
               b.digitalRead('P8_19', printStatus);
       }

       toggleLED = function(){
               state = state ? 0 : 1;
               b.digitalWrite(led, state);
       };

       stopTimer = function(){
               clearInterval(timer);      
       };

       //check if the motion detected and blink the LED light
       //check if the motion is more than 7 seconds, let it be long motion
       function printStatus(x) {
               if(x.value === 0){
                       b.digitalWrite(led, 0);
                       console.log("No Motion Detected");
               if(accumulate >= 4){
                       motion_info[1] += 1;
                       motion_info[0] += 1;
               }else if(accumulate != 0){
                       motion_info[2] += 1;
                       motion_info[0] += 1;
               }
               accumulate = 0;
               }
               else{
                       console.log("Motion Detected");
                       accumulate += 1;
		       printmotion = 1;
                       timer = setInterval(toggleLED, 100);
                       setTimeout(stopTimer,400);
               }
               if(accumulate == 0 && printmotion == 1){
                       console.log("Total: ", motion_info[0]);
                       console.log("Long: ", motion_info[1]);
                       console.log("Short: ", motion_info[2]);
		       printmotion = -1;
		       io.sockets.emit('send data',motion_info);

               }
       }

});
