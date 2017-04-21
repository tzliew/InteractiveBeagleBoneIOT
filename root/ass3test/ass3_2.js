var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
connections = [];

server.listen(process.env.PORT || 8088);
console.log('Server running...');

app.get('/',function(req,res){
       res.sendFile(__dirname + '/index2.html');
});


var b = require('bonescript');
var led = "P8_13";
var state = 0;
var motion_info = [0,0,0,0];     //motion_info format is [Motions Detected, Long Motions, Short Motions, intruders]
var motion_record = [];
var accumulate = 0;
var printmotion = 1;
b.pinMode(led, 'out');

io.sockets.on('connection',function(socket){
       connections.push(socket);
       io.sockets.emit('start', motion_info);
       socket.on('startback', function(data){
		motion_info = data;
		//io.sockets.emit('send data', motion_info);
	});

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
       
       socket.on('reset', function(){
		motion_info = [0,0,0,0];
		motion_record = [];
		io.sockets.emit('send data', motion_info);
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
                if(accumulate >= 3){
                        motion_info[1] += 1;
                        motion_info[0] += 1;
			motion_record.push("L");
                }else if(accumulate != 0){
                        motion_info[2] += 1;
                        motion_info[0] += 1;
			motion_record.push("S");
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
			motionlen = motion_record.length;
			console.log(motion_record);
			
			if(motionlen > 3){
				//console.log(motion_record.slice(motionlen-4, motionlen).equals(["L","L","S","L"]));
                                //console.log(motion_record.slice(motionlen-4, motionlen).equals(['L','L','S','L']));
				if(equal(motion_record)){
					var front = motion_record.slice(0,motionlen-4);
					var behind = ["Intruder"]; 
					motion_record = front.concat(behind);
					motion_info[3] += 1;			
				}
			}
			console.log("Total: ", motion_info[0]);
                        console.log("Long: ", motion_info[1]);
                        console.log("Short: ", motion_info[2]);
                        console.log("Intruder: ", motion_info[3]);
                        printmotion = -1;
			
			io.sockets.emit('send data', motion_info);
                }
       }

	function equal(array1){
		match = ["L","L","S","L"];
		a = 0;
		for (i = array1.length-4; i<= array1.length; i++){
			if(array1[i] != match[a]){
				return false;
			}
			a++;
		}
		return true;
	}
});
