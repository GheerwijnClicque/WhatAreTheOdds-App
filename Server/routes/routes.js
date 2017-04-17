var express = require('express');
var _ = require('lodash');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('odds_database.db');

//var io = require('socket.io');

var router = express.Router();

router.get('/', function(req, res) {
	res.status(200).send('What are the odds - The Game');
    //io.sockets.emit('test');
});

router.post('/user/add', function(req, res) {
    var userId = req.body.id;
    var userName = req.body.name;

    db.serialize(function() {
        db.each("SELECT COUNT(*) as count FROM users where name = $name or facebook_id = $id", {$name: userName, $id: userId}, function(error, row) {
            if(row.count === 0) {
                db.run("INSERT INTO users(facebook_id, name, score) VALUES ($id, $name, 0)", {$id: userId, $name: userName}, function() {
                    if(this.lastID) res.sendStatus(200);
                    console.log('user added to database!');
                });
            }
            else {
                console.log("already exists");
                res.sendStatus(409); // Conflict status code
            }
        });
    });
});

router.post('/user/friends/add', function(req, res) {
    var userId = req.body.user;
    var friendId = req.body.friend;

    var accepted = 0;
	console.log('user: ' + userId);
	console.log('friend: ' + friendId);
    db.serialize(function() {
        db.each("SELECT COUNT(*) as count FROM friends where user_id = $user and friend_id = $friend", {$user: userId, $friend: friendId}, function(error, row) {
            if(row.count === 0) {
                db.run("INSERT INTO friends(user_id, friend_id, accepted) VALUES ($user, $friend, $accepted)", {$user: userId, $friend: friendId, $accepted: accepted}, function() {
                    if(this.lastID) res.sendStatus(200);
                    console.log('friendship added to database!');
                });
            }
            else {
                console.log("already exists");
                res.sendStatus(409); // Conflict status code
            }
        });
    });
});

router.get('/:user_id/friends', function(req, res) {
    var userID = req.params.user_id;
    var getRow;
    db.serialize(function() {
        // Get all processes of specified user
        db.all("SELECT * from FRIENDS INNER JOIN USERS ON friends.friend_id=users.facebook_id WHERE friends.user_id = $id", {$id: userID},function(error, row) {
            getRow = row;
            //console.log(row);
            res.send(JSON.stringify(getRow));
        });
    });
});

/*
router.post('/challenge', function(req, res) {
    var challengerId = req.body.challengerId;
    var challengeeId = req.body.challengeeId;
    var challenge = req.body.challenge;

    console.log('user: ' + challengerId);
    console.log('friend: ' + challengeeId);
    console.log('challenge: ' + challenge);

    db.serialize(function() {
        db.each("SELECT COUNT(*) as count FROM challenges where challenger_id = $user and challengee_id = $friend and challenge = $challenge", {$user: challengerId, $friend: challengeeId, $challenge: challenge}, function(error, row) {

            if(row.count === 0) {
                console.log('insert!ç');

                db.run("INSERT INTO challenges(challenger_id, challengee_id, challenge, accepted, rejected, created_at, challenger_turn) VALUES ($user, $friend, $challenge, $accepted, $rejected, $created, 0)", {$user: challengerId, $friend: challengeeId, $challenge: challenge, $accepted: 0, $rejected: 0, $created: Math.floor(Date.now() / 1000)}, function() {
                    if(this.lastID) res.sendStatus(200);
                    if(this.lastID) {
                        console.log('challenge added to database!');


                    }
                });
            }
            else {
                console.log("already exists");
                res.sendStatus(409); // Conflict status code
            }
        });
    });
});
*/

router.get('/:user_id/challenges', function(req, res) {
    var userID = req.params.user_id;
	console.log('get challenges: ');
	console.log(userID);
    var getRow;
    db.serialize(function() {
        // Get all processes of specified user
        db.all("SELECT challenges.challenge_id, challenges.challenger_id, challenges.challengee_id, challenges.challenge, challenges.created_at, challenges.updated_at, challenger.name as challenger_name, challengee.name as challengee_name, challenges.challengee_id, challenges.range, challenges.accepted, challenges.rejected, challenges.challenger_guess, challenges.challengee_guess, challenges.challenger_turn, challenges.image_url, challenges.completed from CHALLENGES INNER JOIN USERS AS challenger ON (challenges.challenger_id=challenger.facebook_id) INNER JOIN USERS as challengee ON (challenges.challengee_id=challengee.facebook_id) WHERE challenges.challengee_id = $id OR challenges.challenger_id = $id", {$id: userID},function(error, row) {
            getRow = row;
            //console.log(row);
            res.send(JSON.stringify(getRow));
        });
    });
});

router.get('/users', function(req, res) {
	console.log('get users');
    var getRow;
    db.serialize(function() {
        // Get all processes of specified user
        db.all("SELECT * from USERS",function(error, row) {
            getRow = row;
            console.log(row);
            res.send(JSON.stringify(getRow));
        });
    });
});



/*
// Get all processes of user
router.get('/:id/processes', function(req, res) {
	var getRow;

	// User id from get request
	var userID = req.params.id;
	db.serialize(function() {
		// Get all processes of specified user
		db.all("SELECT * from PROCESSES WHERE userid = $id", {$id: userID},function(error, row) {
			getRow = row;
			res.send(JSON.stringify(getRow));
		});
	});
});

// Add new process
router.post('/addprocess', function(req, res) {
	var processName = req.body.name;
	var processDescription = req.body.description;
	var userID = req.body.id;

	db.serialize(function() {
		db.each("SELECT COUNT(*) as count FROM processes where process_name = $name and userid = $id", {$name: processName, $id: userID}, function(error, row) {
			if(row.count === 0) { // Insert if processname doesn't exist yet for current user
				db.run("INSERT INTO processes(userid, process_name, description, favorite) VALUES ($id, $name, $description, $favorite)", {$id: userID, $name: processName, $description: processDescription, $favorite: false}, function() {
					lastProcessId = this.lastID;
					if(this.lastID) res.sendStatus(200);
				});
			}
			else {
				console.log("already exists");
				res.sendStatus(409);
			}
		});
	});
});
*/


// Register a new user
router.post('/adduser', function(req, res) {
	var userName = req.body.name;
	var userPassword = passwordHash.generate(req.body.password);
	var userEmail = req.body.email;

	db.serialize(function() {
		db.each("SELECT COUNT(*) as count FROM users where username = $name or email = $email", {$name: userName, $email: userEmail}, function(error, row) {
			if(row.count === 0) {
				db.run("INSERT INTO users(username, password, email) VALUES ($username, $password, $email)", {$username: userName, $password: userPassword, $email: userEmail}, function() {
					if(this.lastID) res.sendStatus(200);
				});
			}
			else {
				console.log("already exists");
				res.sendStatus(409); // Conflict status code
			}
		});
	});
});

router.get('/highscores', function(req, res) {
	db.serialize(function() {
		db.all("SELECT * from USERS ORDER BY score DESC", function(error, row) {
			console.log('highscores');
			console.log(row);
			res.send(JSON.stringify(row));
		});
	});
});

/*
// Favorite/unfavorite a process
router.get('/:id/favorite/', function(req, res) {
	var processID = req.params.id;

	db.serialize(function() {
		db.run("UPDATE processes SET favorite = CASE WHEN favorite = 1 THEN 0 ELSE 1 END WHERE processid = $id", {$id: processID}, function(error, row) {
			if(this.changes) res.sendStatus(200);
		});
	});
});

// Get Favorite processes for specific user
router.get('/:id/favorites/', function(req, res) {
	var userID = req.params.id;
	var getRow;

	db.serialize(function() {
		db.all("SELECT * from PROCESSES WHERE userid = $id AND favorite = 1", {$id: userID},function(error, row) {
			getRow = row;
			res.send(JSON.stringify(getRow));
		});
	});
});

// Login
router.post('/login', function(req, res) {
	var userName = req.body.name;
	var userPassword = req.body.password;

	db.serialize(function() {
		db.all("SELECT user_id FROM USERS where username = $name", {$name: userName}, function(error, row) {
			console.log(row.length);

			if(row.length === 0) {
				console.log("jskfdmfjksdm");
				res.sendStatus(401).status('sdkfjld');
			}
			else if(row){
				db.each("SELECT password, user_id, username FROM USERS where username = $name", {$name: userName}, function(error, row) {
					if(passwordHash.verify(userPassword, row.password)) {
						res.send({id: row.user_id, username: row.username});
					}
				});
			}
		});
	});
});

// Add new step
router.post('/:id/addstep', function(req, res) {
	var step = req.body.data;
	var processId = req.body.processId;
	console.log(step);

	db.run("INSERT INTO steps (process_id, step_name, step_time, temp, interval, chemical, dilution) VALUES ($process_id, $name, $time, $temp, $interval, $chemical, $dilution)", {$process_id: processId, $name: step.name, $time: step.duration, $temp: step.temperature, $interval: step.interval, $chemical: step.chemical, $dilution: step.dilution }, function() {
		console.log("step id: " + this.lastID);
		if(this.lastID) res.sendStatus(200);
	});

});

// Delete step from process
router.get('/steps/:id/delete', function(req, res) {
	var stepid = req.params.id;

	db.run("DELETE FROM STEPS WHERE step_id = $id", {$id: stepid}, function() {
		if(this.changes) {
			res.sendStatus(200);
		}
	});
});

// Edit existing step
router.post('/steps/:id/edit', function(req, res) {
	var stepid = req.params.id;
	var step = req.body.data;

	console.log(stepid);
	console.log(step);
	db.run("UPDATE STEPS SET step_name = $name, step_time = $time, temp = $temp, interval = $interval, chemical = $chemical, dilution = $dilution WHERE step_id = $id",
		{$id: stepid,
			$name: step.name,
			$time: step.duration,
			$temp: step.temperature,
			$interval: step.interval,
			$chemical: step.chemical,
			$dilution: step.dilution},
		function() {
			if(this.changes) {
				res.sendStatus(200);
			}
		});
});

// Get all steps from specific process
router.get('/steps/:processid', function(req, res) {
	var processid = req.params.processid;
	var steps = [];

	db.serialize(function() {
		db.all("SELECT * FROM STEPS where process_id = $id", {$id: processid} ,function(error, row) {
			steps = row;
			res.send(steps);
		});
	});
});

// Delete a process
router.get('/processes/:id/delete', function(req, res) {
	var processid = req.params.id;
	var proc, steps = false;
	db.parallelize(function() {
		db.run("DELETE FROM STEPS WHERE process_id = $id", {$id: processid}, function(error, row) {

		});
		db.run("DELETE FROM PROCESSES WHERE processid = $id", {$id: processid}, function(error, row) {
			console.log(this.changes);
			if(this.changes) res.sendStatus(200);
		});
	});
});

// Start a process
router.get('/processes/:id/start', function(req, res) { // change to processes/:id/start
	var processid = req.params.id;
	var steps = [];

	db.serialize(function() {
		db.all("SELECT * FROM STEPS where process_id = $id", {$id: processid} ,function(error, row) {
			steps = row;

			// Start process on machine
			if(!machine.isStarted) {
				if(machine.start(JSON.stringify(steps))) {
					// res.sendStatus(200);
					db.each("SELECT sum(step_time) as duration, count(step_id) as steps FROM STEPS where process_id = $id", {$id: processid} ,function(error, row) {
						// ADD CLEANUP + PREPARATION TIME
						// * 5 = preparation time, * 3 = cleanup
						res.send(JSON.stringify({status: 200, completeDuration: (row.duration + (row.steps * 8)) }));
					});
					// res.status(200).json({'data': {status: 'OK', data: 'testDataFullTime'}});
				}
			} else {
				res.send(JSON.stringify(machine.getInfo()));
			}

		});
	});
});

// Stop a process
router.get('/processes/stop', function(req, res) { // change to processes/:id/stop
	console.log("stop: " + req.params.id);
	if(machine.stop()) {
		res.sendStatus(200);
	}
});

// Start or stop sending temperature sensor data
router.get('/temperatures/:state', function(req, res) {
	machine.getTemperatures(req.params.state);
	res.sendStatus(200);
});

// Get all film names corresponding with search
router.get('/devchart/:filmname', function(req, res) {
	var filmname = "%" + req.params.filmname.toLowerCase() + "%";
	devchartDB.serialize(function() {
		devchartDB.all("SELECT id, film FROM PRESETS where film LIKE $name GROUP BY film", {$name: filmname} ,function(error, row) {
			res.send(row);
		});
	});
});

// Get all processes from specific film stock
router.get('/devchart/:filmname/processes', function(req, res) {
	var filmname = "%" + req.params.filmname.toLowerCase() + "%";
	devchartDB.serialize(function() {
		devchartDB.all("SELECT * FROM PRESETS where film LIKE $name", {$name: filmname} ,function(error, row) {
			res.send(row);
		});
	});
});
*/


module.exports = router;
