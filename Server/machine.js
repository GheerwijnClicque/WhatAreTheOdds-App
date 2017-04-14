var util = require('util');
var ip = require('ip'); // IP address utility

// Johnny-Five
var five = require('johnny-five');
var board = new five.Board();

var EventEmitter = require('events').EventEmitter;
var machine = new EventEmitter();

var initialized = false;
machine.isStarted = false; // change to isRunning

var A, B, C, water, pump, cleanup, divider; // pin numbers for valves

var time; // Timer
var start; // Time off process start
var preparationTime = 5000;
var cleanupTime = 3000;

var tempA, tempB, tempC, tempWater;
var tempFrequency = 2000;
// Initialize the board
machine.init = function() {
	board.on('ready', function() {
		// lcd = new five.LCD({pins: [8, 9, 4, 5, 6, 7], rows: 2, cols: 16});
		// lcd = new five.LCD({pins: [24, 22, 32, 28, 30, 26], rows: 2, cols: 16});
		// I2C LCD, PCF8574A
		lcd = new five.LCD({
		  controller: "PCF8574A",
		  rows: 4,
		  cols: 20
		});

		// machine.emit('ready');
		A = new five.Relay(52);
		B = new five.Relay(50);
		C = new five.Relay(48);
		// water = new five.Relay(4);
		// cleanup = new five.Relay(8);
		// divider = new five.Relay(5);
		pump = new five.Relay(46);
		//
		// A.open();
		// B.open();
		// C.open();
		// // divider.open();
		// // cleanup.open();
		// // water.open();
		// pump.open();
		//

		 printLCD('READY', 0, true);
		 printLCD('IP: ' + ip.address(), 3, false);
		 console.log('IP: ' + ip.address());


		 // PUT IN MACHINE.START, here-> read each 2s
		// tempA = new five.Thermometer({
		// 	controller: "DS18B20",
		// 	pin: 40,
		// 	freq: tempFrequency,
		// 	address: 0x316568b03ff
		// });
		// tempB = new five.Thermometer({
		// 	controller: "DS18B20",
		// 	pin: 40,
		// 	freq: tempFrequency,
		// 	address: 0x800000268689
		// });
		// tempC = new five.Thermometer({
		// 	controller: "DS18B20",
		// 	pin: 40,
		// 	freq: tempFrequency,
		// 	address: 0x31674b2b1ff
		// });


	// 	tempA.on("data", function() {
	// 	   // console.log('A: ' + this.celsius);
	// 	   temperatures[0] = this.celsius;
	// 	   console.log("0x" + this.address.toString(16));
	//    });
	// 	tempB.on("data", function() {
	// 	   // console.log('B: ' + this.celsius);
	// 	   temperatures[1] = this.celsius;
	// 	   console.log("0x" + this.address.toString(16));
	// 	});
	// 	tempC.on("data", function() {
	// 	   // console.log('C: ' + this.celsius);
	// 	   temperatures[2] = this.celsius;
	// 	   console.log("0x" + this.address.toString(16));
	// 	});


		console.log('initialized');
		initialized = true;
	});
};

machine.getInfo = function() {
	if (machine.steps !== undefined) {
		return {
			start: start,
			time: Math.floor(((machine.steps[machine.stepNumber].step_time * 1000)- (Date.now() - start)) / 1000),
			desc: machine.steps[machine.stepNumber],
			duration: machine.steps[machine.stepNumber].step_time,
			interval: machine.steps[machine.stepNumber].interval,
		};
	}
};

// function to start the process
machine.start = function(steps) {
	if(initialized && !machine.isStarted) {
		machine.stepNumber = -1;
		machine.steps = JSON.parse(steps);

		machine.isStarted = true;

		// emit outside that it started
		// machine.emit('started');
		printLCD("process started", 0, true);
		machine.nextStep();
		console.log('process started');
		return true;
	}
	else {
		return false;
	}
};

machine.stop = function() {
	// clearTimeout(time);
	if(machine.isStarted) {
		time.stop();
		machine.isStarted = false;
		console.log('machine stop');
		printLCD('Process stopped', 0, true);
		return true;
	}
};

// Function to start next step
machine.nextStep = function() {
	if(machine.isStarted) {
		machine.stepNumber++;
		// check if stepnumber isn't to high
		if (machine.stepNumber < machine.steps.length) {
			console.log('=====');
			console.log('step: ' + (machine.stepNumber + 1) + '/' + machine.steps.length);
			console.log('=====');
			console.log('temp: ' + machine.steps[machine.stepNumber].temp);
			// machine.currentTemp = machine.steps[machine.stepNumber].temp;
			printLCD('Step ' + (machine.stepNumber + 1) + '/' + machine.steps.length, 0, true);
			machine.prepare();
		} else {
			// When all steps are done
			machine.emit('processDone');
			isStarted = false;
			machine.stepNumber = -1;
			printLCD('Done', 1, true);
			setTimeout(function() {
				lcd.clear();
				printLCD('  Start a process!  ', 0, false);
			}, 4000);
			console.log('process done');
		}
	}
};

machine.prepare = function() {
	console.log('preparing... (5 seconds)');
	printLCD("", 1, true);
	printLCD('Preparing...', 1, false);
	lcd.useChar("degree");
	printLCD('Temp: ' + machine.steps[machine.stepNumber].temp + ':degree:C', 3, false);

	machine.emit('prepare', machine.steps[machine.stepNumber].chemical);
	var relays = "";

	// select pins corresponding to chemical in step
	switch(machine.steps[machine.stepNumber].chemical) {
		case "A":
			relays = A;
			break;
		case "B":
			relays = B;
			break;
		case "C":
			relays = C;
			break;
		case "water":
			relays = water;
			break;
	}

	// relays.close();
	// // divider.open();
	// pump.close();

	// Wait x seconds for setup to complete, could be setTimeout
	board.wait(preparationTime, function() {
		// relays.open();
		// divider.close();
		// pump.open();

		// lcd.clear();
		// Start execution when setup is done
		machine.emit('setupDone');
	});
};

machine.on('setupDone', function() {
	if(machine.isStarted) {
		// set new start date/time
		start = Date.now();

		// Emit new step info
		machine.emit('change', machine.getInfo());

		// set interval to agitate
		// var interval = setInterval(function() {
		// 	console.log('agitate');
		// }, machine.steps[machine.stepNumber].interval.toMiliSeconds());

		printLCD("", 1, true);
		var lcdTime = setInterval(function() {
			// ee.emit('lcd');
			printLCD(milliToMinutes(time.getTimeLeft()), 1, false);
		}, 250);

		// set function to end step
		time = new timer(function() {
			if (machine.stepNumber < machine.steps.length) {
				console.log(machine.stepNumber);
				console.log('Executing step: ' + machine.steps[machine.stepNumber].step_name);

				clearInterval(lcdTime);

				printLCD('Step done', 1, true);
				// cleanup for x milliseconds
				machine.cleanUp(cleanupTime);
			}
		}, (machine.steps[machine.stepNumber].step_time * 1000)); // to milliseconds!

	}
});

machine.cleanUp = function(duration) {
	if(machine.isStarted) {
		console.log('cleaning up for ' + duration / 1000 + ' seconds');
		printLCD('Cleaning up', 1, true);

		// cleanup.open();
		// pump.close();

		// wait x seconds for cleaning to complete, could be setTimeout
		board.wait((duration), function() {
			console.log('cleaning done');

			// cleanup.close();
			// pump.open();

			machine.emit('stepDone', 'step ' + machine.stepNumber + ' is done');
		});
	}
};

var temperatures = [];
var tempInterval;
machine.getTemperatures = function(state) {
	if(state === 'true') {
		 tempA.on("data", function() {
			// console.log('A: ' + this.celsius);
			temperatures[0] = this.celsius;
			// console.log("0x" + this.address.toString(16));
		});
		 tempB.on("data", function() {
			// console.log('B: ' + this.celsius);
			temperatures[1] = this.celsius;
			// console.log("0x" + this.address.toString(16));
		 });
		 tempC.on("data", function() {
			// console.log('C: ' + this.celsius);
			temperatures[2] = this.celsius;
			// console.log("0x" + this.address.toString(16));
		 });
		tempInterval = setInterval(function() {
			// console.log(temperatures[0] + " - " + temperatures[1] + " - " + temperatures[2]);
			 machine.emit('temperature', temperatures);
		}, tempFrequency);
	}
	else {
		clearInterval(tempInterval);
		machine.removeListener('temperature', function() {});
	}
};

var printLCD = function(text, line, overwrite) {
	if(overwrite) {
		lcd.cursor(line, 0).print("                    "); // Clear entire line
		lcd.cursor(line, 0).print(text);
	}
	else {
		lcd.cursor(line, 0).print(text);
	}
};

// Convet milliseconds to minutes and seconds
var milliToMinutes = function(milliseconds) {
	var min = Math.floor(Math.ceil(milliseconds / 1000) / 60);
	var sec = Math.ceil((milliseconds / 1000) - (min * 60));
	if(sec < 10) {
		sec = "0" + sec;
	}
	if(min < 10) {
		min = "0" + min;
	}
	return min + ':' + sec;
};

// Timer function
function timer(callback, delay) {
    var id, started, remaining = delay, running;

    this.start = function() {
        running = true;
        started = new Date();
        id = setTimeout(function() {
			running = false;
			callback();
		}, remaining);
    };

    this.pause = function() {
        running = false;
        clearTimeout(id);
        remaining -= new Date() - started;
    };

	this.stop = function() {
		running = false;
		clearTimeout(id);
	};

    this.getTimeLeft = function() {
        if (running) {
            this.pause();
            this.start();
        }
        return remaining;
    };

    this.getStateRunning = function() {
        return running;
    };

    this.start();
}


module.exports = function() {
	return machine;
};
