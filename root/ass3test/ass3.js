var admin = require("firebase-admin");
// Fetch the service account key JSON file contents
var serviceAccount = require("./serviceAccountKey.json");
var b = require('bonescript');
var led = "P8_13";
var state = 0;
var motion_info = [0,0,0,0];     //motion_info format is [Motions Detected, Long Motions, Short Motions, intruders]
var motion_record = [];
var accumulate = 0;
var printmotion = 1;
b.pinMode(led, 'out');
var firerecords;
var dataRecord;
var i;
var refup;

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://project1-6d6ef.firebaseio.com"  
});

var db = admin.database();
var ref = db.ref("motion");
ref.on("value", function(snapshot) {   //this callback will be invoked with each new object
	firerecords = snapshot.val();
	if (firerecords != null){
		var keys = Object.keys(firerecords);
		i = keys[0];
		dataRecord = {
			Total: firerecords[i].Total,
			Long: firerecords[i].Long,
			Short: firerecords[i].Short,
			Intruder: firerecords[i].Intruder,
			LED: firerecords[i].LED,
			MOTION: firerecords[i].MOTION, 
		};
	}else{
		dataRecord = {
                       	Total: 0,
                        Long: 0,
                        Short: 0,
                        Intruder: 0,
                        LED: 0,
                        MOTION: 0,
                };
		ref.push(dataRecord);
		ref.off();
		// record new key in order to update the information next time
		ref.on('value', function(snapshot){
			firerecords = snapshot.val();
			var keys = Object.keys(firerecords);
			i = keys[0];
		});
	}
	if (dataRecord.LED == 1){
	        console.log("LED ON");
        	b.digitalWrite(led, 1);
	}else{
       		console.log("LED OFF");
        	b.digitalWrite(led, 0);
	}

	if (dataRecord.MOTION == 1){
        	console.log("PIR motion ON.");
        	b.pinMode('P8_19', b.INPUT);
        	interval = setInterval(checkPIR, 2000);
	}else{
        	console.log("PIR motion OFF.");
		if ( typeof interval !== 'undefined' ){
	        	clearInterval(interval);
		}
	}

}, function (errorObject) {             // if error
  console.log("The read failed: " + errorObject.code);
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
	refup = db.ref('motion/' + i);
	if(x.value === 0){
        	b.digitalWrite(led, 0);
                console.log("No Motion Detected");
        	if(accumulate >= 3){
			dataRecord.Long += 1;	
                	dataRecord.Total += 1;
			motion_record.push("L");
        	}else if(accumulate != 0){
			dataRecord.Short += 1;
                	dataRecord.Total += 1;
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
				dataRecord.Intruder += 1;			
			}
		}
		console.log("Total: ", dataRecord.Total);
                console.log("Long: ", dataRecord.Long);
                console.log("Short: ", dataRecord.Short);
                console.log("Intruder: ", dataRecord.Intruder);
                printmotion = -1;
			
		refup.update({
			Total: dataRecord.Total,
                       	Long: dataRecord.Long,
                       	Short: dataRecord.Short,
                       	Intruder: dataRecord.Intruder
		});
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


