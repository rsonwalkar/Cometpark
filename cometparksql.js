var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mysql = require('mysql'),
    connection;

var cometpark = express();

// Database - Using the felixge/node-mysql library to interact with the mysql server
connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'mysql',
	database: 'cometpark'
});
	
connection.connect(function(err) {
	if(err) {
		console.log('Error connecting to the database: ', err);
	} else {
		console.log('Successfully opened a connection with the cometpark database.');
	}
});


// Configuring cometpark app using the Express library

cometpark.configure(function () {
  //cometpark.set('view engine', 'ejs');
  //cometpark.set('views', path.join(__dirname, '/views'));
  //cometpark.engine('.html', require('ejs').renderFile);
  cometpark.use(express.bodyParser());
  cometpark.use(express.methodOverride());
  cometpark.use(cometpark.router);
  //cometpark.use(express.static(path.join(application_root, "public")));
  cometpark.use(express.static(path.join(__dirname + '/public')));
  cometpark.use(express.static(path.join(__dirname + '/files')));
  cometpark.use(express.favicon(path.join(__dirname, '/public/images/favicon.ico')));
  cometpark.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

cometpark.get('/api', function (req, res) {
	res.statusCode = 200;  
	res.type('text/plain'); // set content-type
  	res.send('Success. Cometpark API is up and running :)');
});

cometpark.get('/forgotpassword', function (req, res) {
	console.log('Request query: ', req.query);
	if(Object.keys(req.query).length == 0) {
		res.sendfile(__dirname + '/public/forgotpassword.html');
	} else {
		console.log('Forgot password get request query: ', req.query);
		connection.query('SELECT password from auth where uname="' + req.query.uname + '" and squestion="' + req.query.squestion + '" and sanswer="' + req.query.sanswer + '"', function(err, success) {
			if(!err && Object.keys(success).length != 0) {
				console.log('Retreived password: ', success);
				return res.send(success);
			} else {
				return res.send(success);
			}
		});
	}
});

// Render a response html page
cometpark.get('/adminlogin', function (req, res) {
	if(Object.keys(req.query).length == 0) {
		res.sendfile(__dirname + '/public/adminlogin.html');
	} else {
		//var uname = req.body.username;
		//var password = req.body.password;
		console.log('Admin panel get request query: ', req.query);
		//console.log('Uname: '+req.body.uname.value);
		//console.log('uname: ', uname, ' pwd: ', password);
		//res.json('uname: ' + uname + ' pwd: ' + password);
		connection.query('SELECT * FROM auth where uname="' + req.query.uname + '" and password="' + req.query.password + '"', function(err, success) {
			if(!err && Object.keys(success).length != 0) {
				console.log('Here is what we got from the auth table: ', success);
				console.log('Returning admin panel');
				//console.log(__dirname+'/public/adminpanel');
				//res.sendfile(__dirname + '/public/adminpanel.html');
				res.statusCode = 302;
				res.setHeader('Location', '/adminpanel');
				//res.redirect('/adminpanel');
				res.end();
				//return res.send(success);
			} else {
				//res.type('text/plain');
				//res.statusCode = 200;
				console.log('In the else part of the post');
				return res.send(success);
			}
		});
	}
});

// Render a response html page
/*cometpark.get('/adminlogin', function (req, res) {
	//if(Object.keys(req.query).length == 0) {
		res.sendfile(__dirname + '/public/adminlogin.html');	
	} else {
		var uname = req.query.username;
		var password = req.query.password;
		console.log('uname: ', uname, ' pwd: ', password);
		res.json('uname: ' + uname + ' pwd: ' + password);
	}
	console.log('Get request on Admin Panel: ', req.query);
	//res.type('text/plain');
	//res.send('Dir name: ' + __dirname + '/public/adminpanel.html');
	
	//res.render('adminpanel.html');
});*/

// Render a response html page for the admin panel
cometpark.get('/adminpanel', function (req, res) {
	res.sendfile(__dirname + '/public/adminpanel.html');	
});

// Render a response html page for deleting a parking spot
cometpark.get('/deletespot', function (req, res) {
	res.sendfile(__dirname + '/public/deletespot.html');	
});

// Render a response html page for modifying the permit of a parking spot
cometpark.get('/modifyspot', function (req, res) {
	res.sendfile(__dirname + '/public/modifyspot.html');	
});



// Render a response html page for a specific lot A permit
cometpark.get('/lotA/green', function (req, res) {
	res.sendfile(__dirname + '/public/lotA/green.html');
});

cometpark.get('/lotA/orange', function (req, res) {
	res.sendfile(__dirname + '/public/lotA/orange.html');
});

cometpark.get('/lotA/purple', function (req, res) {
	res.sendfile(__dirname + '/public/lotA/purple.html');
});

cometpark.get('/lotA/gold', function (req, res) {
	res.sendfile(__dirname + '/public/lotA/gold.html');
});

cometpark.get('/lotA/handicap', function (req, res) {
	res.sendfile(__dirname + '/public/lotA/handicap.html');
});

// Render a response html page for a specific lot B permit
cometpark.get('/lotB/green', function (req, res) {
	res.sendfile(__dirname + '/public/lotB/green.html');
});

cometpark.get('/lotB/orange', function (req, res) {
	res.sendfile(__dirname + '/public/lotB/orange.html');
});

cometpark.get('/lotB/purple', function (req, res) {
	res.sendfile(__dirname + '/public/lotB/purple.html');
});

cometpark.get('/lotB/gold', function (req, res) {
	res.sendfile(__dirname + '/public/lotB/gold.html');
});

cometpark.get('/lotB/handicap', function (req, res) {
	res.sendfile(__dirname + '/public/lotB/handicap.html');
});

// Render a response html page for a specific lot C permit
cometpark.get('/lotC/green', function (req, res) {
	res.sendfile(__dirname + '/public/lotC/green.html');
});

cometpark.get('/lotC/orange', function (req, res) {
	res.sendfile(__dirname + '/public/lotC/orange.html');
});

cometpark.get('/lotC/purple', function (req, res) {
	res.sendfile(__dirname + '/public/lotC/purple.html');
});

cometpark.get('/lotC/gold', function (req, res) {
	res.sendfile(__dirname + '/public/lotC/gold.html');
});

cometpark.get('/lotC/handicap', function (req, res) {
	res.sendfile(__dirname + '/public/lotC/handicap.html');
});

// Render a response html page for a specific lot B permit
cometpark.get('/lotD/green', function (req, res) {
	res.sendfile(__dirname + '/public/lotD/green.html');
});

cometpark.get('/lotD/orange', function (req, res) {
	res.sendfile(__dirname + '/public/lotD/orange.html');
});

cometpark.get('/lotD/purple', function (req, res) {
	res.sendfile(__dirname + '/public/lotD/purple.html');
});

cometpark.get('/lotD/gold', function (req, res) {
	res.sendfile(__dirname + '/public/lotD/gold.html');
});

cometpark.get('/lotD/handicap', function (req, res) {
	res.sendfile(__dirname + '/public/lotD/handicap.html');
});

// Render a response html page for a specific lot G permit
cometpark.get('/lotG/green', function (req, res) {
	res.sendfile(__dirname + '/public/lotG/green.html');
});

cometpark.get('/lotG/orange', function (req, res) {
	res.sendfile(__dirname + '/public/lotG/orange.html');
});

cometpark.get('/lotG/purple', function (req, res) {
	res.sendfile(__dirname + '/public/lotG/purple.html');
});

cometpark.get('/lotG/gold', function (req, res) {
	res.sendfile(__dirname + '/public/lotG/gold.html');
});

cometpark.get('/lotG/handicap', function (req, res) {
	res.sendfile(__dirname + '/public/lotG/handicap.html');
});

// Render a response html page for a specific lot H permit
cometpark.get('/lotH/green', function (req, res) {
	res.sendfile(__dirname + '/public/lotH/green.html');
});

cometpark.get('/lotH/orange', function (req, res) {
	res.sendfile(__dirname + '/public/lotH/orange.html');
});

cometpark.get('/lotH/purple', function (req, res) {
	res.sendfile(__dirname + '/public/lotH/purple.html');
});

cometpark.get('/lotH/gold', function (req, res) {
	res.sendfile(__dirname + '/public/lotH/gold.html');
});

cometpark.get('/lotH/handicap', function (req, res) {
	res.sendfile(__dirname + '/public/lotH/handicap.html');
});

// Render a response html page for a specific lot I permit
cometpark.get('/lotI/green', function (req, res) {
	res.sendfile(__dirname + '/public/lotI/green.html');
});

cometpark.get('/lotI/orange', function (req, res) {
	res.sendfile(__dirname + '/public/lotI/orange.html');
});

cometpark.get('/lotI/purple', function (req, res) {
	res.sendfile(__dirname + '/public/lotI/purple.html');
});

cometpark.get('/lotI/gold', function (req, res) {
	res.sendfile(__dirname + '/public/lotI/gold.html');
});

cometpark.get('/lotI/handicap', function (req, res) {
	res.sendfile(__dirname + '/public/lotI/handicap.html');
});

/*cometpark.get('/lotA/:permit', function (req, res) {
	
	if(req.params.permit == 'green') {
		console.log('Getting you the lot A green permit page.');
		console.log('Lot A green get request: ' , req);
		res.sendfile(__dirname + '/public/lotA/green.html');
	} else if(req.params.permit == 'orange') {
		res.sendfile(__dirname + '/public/lotAorangestatus.html');
	} else if(req.params.permit == 'purple') {
		res.sendfile(__dirname + '/public/lotApurplestatus.html');
	} else if(req.params.permit == 'gold') {
		res.sendfile(__dirname + '/public/lotAgoldstatus.html');
	}
});*/

/*cometpark.get('/lotAstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotAstatus.html');
});*/

cometpark.get('/lotAstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotAstatus.html');
});


cometpark.get('/lotBstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotBstatus.html');
});

cometpark.get('/lotCstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotCstatus.html');
});

cometpark.get('/lotDstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotDstatus.html');
});

cometpark.get('/lotHstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotHstatus.html');
});

cometpark.get('/lotGstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotGstatus.html');
});

cometpark.get('/lotIstatus', function (req, res) {
	res.sendfile(__dirname + '/public/lotIstatus.html');
});

/*cometpark.get('/images/:status', function (req, res) {
	if(req.params.status == 'vacant') {
		console.log('vacant');
		res.sendfile(__dirname + '/public/images/marker_green');	
	} else if (req.params.status == 'occupied') {
		res.sendfile(__dirname + '/public/images/marker_red');
	}
});*/

/*cometpark.get('/getstatus/:id', function (req, res) {
	console.log('Called the getstatus route.');
	  connection.query('SELECT pstatus FROM parkinglot where pid="' + req.params.id + '"', function(err, success) {
	if(!err) {
		res.statusCode = 200;
		console.log('Heres the data from parkinglot: ', success);
		return res.send(success);
	} else {
		res.statusCode = 404;
		console.log('Could not select data from parking lot table and heres why: ', err);
		return res.send('Could not pull data for that parking spot :(');
	}
  });
});*/



cometpark.get('/getstatus/:lot/:permit', function (req, res) {
	console.log('Called the getstatus route with lot and permit. Req param is: ', req.params.lot);
	  connection.query('SELECT pid, permit, pstatus, lat, longitude FROM parkinglot where plot="' + req.params.lot + '" and permit="' + req.params.permit +'"', function(err, success) {
	if(!err) {
		res.statusCode = 200;
		console.log('Heres the data from parkinglot: ', success);
		return res.send(success);
	} else {
		res.statusCode = 404;
		console.log('Could not select data from parking lot table and heres why: ', err);
		return res.send('Could not pull data for that parking spot :(');
	}
  });
});

cometpark.get('/getstatus/:lot', function (req, res) {
	console.log('Called the getstatus route with lot. Req param is: ', req.params.lot);
	  connection.query('SELECT pid, pstatus, permit, lat, longitude FROM parkinglot where plot="' + req.params.lot + '"', function(err, success) {
	if(!err) {
		res.statusCode = 200;
		console.log('Heres the data from parkinglot: ', success);
		return res.send(success);
	} else {
		res.statusCode = 404;
		console.log('Could not select data from parking lot table and heres why: ', err);
		return res.send('Could not pull data for that parking spot :(');
	}
  });
});

cometpark.post('/adminpanel/addparkingspot', function(req, res) {
	console.log('POST body: ', req.body);
	if(!req.body.hasOwnProperty('lot') || !req.body.hasOwnProperty('permit') || !req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('latitude') || !req.body.hasOwnProperty('longitude')) {
		res.statusCode = 400;
		res.type('text/plain');
		res.send('Error 400 : Cometpark api Admin Panel POST syntax incorrect');
	} else {
		connection.query('SELECT * from parkinglot where pid="' + req.body.id + '"', function(err, success) {
			console.log('Here is what we got from the parkinglot table: ', success);
			if(!err && Object.keys(success).length == 0) {
				connection.query('INSERT into parkinglot values ("'+ req.body.lot + '","' + req.body.id + '","vacant","' + req.body.permit + '","' + req.body.latitude + '","' + req.body.longitude +'")', function(err, success) {
					if(!err) {
					res.statusCode = 200;
					console.log('Entry successfully inserted into the parking lot table');
					res.send('Entry successfully inserted into the system :)');
					} else {
						res.statusCode = 404;
						res.send('Could not insert an entry into the system :(');
						console.log('Could not insert an entry into the parking lot table and heres why: ', err);
					}
  				});
			} else {
				res.statusCode = 200;
				return res.json(success);
				// commenting res.send() as of now
				//res.send('A record for this parking spot already exists in the database. Please consider modifying it.');
			}
		});
	}
});

cometpark.del('/adminpanel/deleteparkingspot', function(req, res) {
	if(!req.body.hasOwnProperty('id')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api DELETE syntax incorrect');
	} else {
		//console.log('ID: ', req.body.uname, ' password: ', req.body.password);
			connection.query('DELETE from parkinglot where pid="' + req.body.id + '"', function(err, success) {
					if(!err && success.affectedRows != 0) {
						console.log('Here is what I got in success: ' + JSON.stringify(success));
						console.log('Parking spot deleted');
						res.statusCode = 200;
						res.send('Parking spot deleted as per your request :)');
					} else {
						console.log('Could not delete the parking spot and here is why: ', err);
						res.statusCode = 200;
						res.send('Could not delete the parking spot from the system :(');
					}
			});
	}
});

cometpark.put('/adminpanel/modifyparkingspot', function(req, res) {
	if(!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('permit')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api PUT syntax incorrect');
	} else {
		connection.query('SELECT * from parkinglot where pid="' + req.body.id + '"', function(err, success) {
					if(!err && Object.keys(success).length != 0) {
						console.log('Such an entry exists in the parking lot table. Now updating as per your request');
						connection.query('UPDATE parkinglot set permit="' + req.body.permit + '" where pid="' + req.body.id + '"', function(err, success) {
							if(!err) {
								res.statusCode = 200;
								console.log('Parking lot status updated');
								res.send('Parking lot status has been updated into the system as per your request :)');
							} else {
								res.statusCode = 404;
								res.send('Could not update the parking spot permit type.');
								console.log('Could not update the parking spot status and here is why: ', err);
							}
						});
					} else {
						res.statusCode = 200;
						res.send('No such entry exists in the system. Have you considered adding it?');
						console.log('No such entry exists in the parking lot database so cannot update');
					}
  				});
	}
});

// retreive current parking status of a specific parking spot
// Example: curl http://localhost:4242/api/parkingstatus/P02 -X GET
cometpark.get('/api/parkingstatus/:id', function (req, res) {
  console.log('Get request looks like this: ', req);
  connection.query('SELECT * FROM parkinglot where pid="' + req.params.id + '"', function(err, success) {
	if(!err) {
		res.statusCode = 200;
		return res.send(success);
		console.log('Heres the data from parkinglot: ', success);
	} else {
		res.statusCode = 404;
		console.log('Could not select data from parking lot table and heres why: ', err);
		return res.send('Could not pull data for that parking spot :(');
	}
  });
});

// retreive current parking status of parking spots based on the lot and permit selection
cometpark.get('/api/parkingstatus/:lot/:permit', function (req, res) {
  console.log('Get request looks like this: ', req);
  connection.query("SELECT * FROM parkinglot where plot='" + req.params.lot + "' and " + "permit='" + req.params.permit + "' and pstatus='vacant'", function(err, success) {
	if(!err) {
		res.statusCode = 200;
		return res.send(success);
		console.log('Heres the data from parkinglot: ', success);
	} else {
		res.statusCode = 404;
		console.log('Could not select data from parking lot table and heres why: ', err);
		return res.send('Could not pull data for that parking spot :(');
	}
  });
});

// retreiving current parking status of the cometpark system
// Example: curl http://localhost:4242/api/parkingstatus -X GET
cometpark.get('/api/parkingstatus', function (req, res) {
  connection.query('SELECT * FROM parkinglot where pstatus="vacant"', function(err, success) {
	if(!err) {
		res.statusCode = 200; 
		return res.json(success);
		console.log('Heres the data from parkinglot: ', success);
	} else {
		res.statusCode = 404;
		res.type('text/plain');
		res.send('Could not oull out parking lot data for you :(');
		console.log('Could not select data from parking lot table and heres why: ', err);
	}
  });
});

// Receive a POST request from the controller and update the same in the database.
// POST is for creating a new entry into the database
// Example: curl --data "uname=swapnil&password=swapnil&lot=A&id=A01&status=occupied&permit=green" http://localhost:4242/api/parkingstatus -X POST
cometpark.post('/api/parkingstatus', function(req, res) {
	console.log('POST: ', req.body);
	if(!req.body.hasOwnProperty('uname') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('lot') || !req.body.hasOwnProperty('permit') || !req.body.hasOwnProperty('id')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api POST syntax incorrect');
	} else {
		connection.query('SELECT * from auth where uname="' + req.body.uname + '" and password="' + req.body.password + '"', function(err, success) {
			if(!err && Object.keys(success).length != 0) {
				console.log('Here is what we got from the auth table: ', success);
				connection.query('INSERT into parkinglot values ("'+ req.body.lot + '","' + req.body.id + '","vacant","' + req.body.permit + '")', function(err, success) {
					if(!err) {
					res.statusCode = 200;
					console.log('Entry successfully inserted into the parking lot table');
					return res.send('Entry successfully inserted into the system :)');
					} else {
						res.statusCode = 404;
						res.send('Could not insert an entry into the system :(');
						console.log('Could not insert an entry into the parking lot table and heres why: ', err);
					}
  				});
			} else {
				res.statusCode = 404;
				res.send('No such entry exists in the system so cannot update');
				console.log('No such entry exists in the parking lot database so cannot update');
			}
		});
	}
});

// Updating a parking lot status using a PUT request. This API call would be made from the controller to update the server.
// Example: curl http://localhost:4242/api/parkingstatus/A01/occupied -X PUT
cometpark.post('/api/parkingstatus/:id/:status', function(req, res) {
	connection.query('UPDATE parkinglot set pstatus="' + req.params.status + '" where pid="' + req.params.id + '"', function(err, success) {
			if(!err) {
				res.statusCode = 200;
				console.log('Parking lot status updated');
				res.send('Parking lot status has been updated into the system as per your request :)');
			} else {
			res.statusCode = 404;
			res.send('Could not update the parking spot status.' + 
			'Check your REST call for all the required information.');
			console.log('Could not update the parking spot status and here is why: ', err);
		}
	});
}); 

// Updating a parking lot status using a PUT request
// Example: curl --data "uname=swapnil&password=swapnil&id=A03&status=occupied" http://localhost:4242/api/parkingstatus -X PUT
cometpark.put('/api/parkingstatus', function(req, res) {
	if(!req.body.hasOwnProperty('uname') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('status')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api PUT syntax incorrect');
	} else {
		connection.query('SELECT * from auth where uname="' + req.body.uname + '" and password="' + req.body.password + '"', function(err, success) {
			if(!err && Object.keys(success).length != 0) {
				console.log('Here is what we got from the auth table: ', success);
				connection.query('SELECT * from parkinglot where pid="' + req.body.id + '"', function(err, success) {
					if(!err) {
						console.log('Such an entry exists in the parking lot table. Now updating as per your request');
						connection.query('UPDATE parkinglot set pstatus="' + req.body.status + '" where pid="' + req.body.id + '"', function(err, success) {
							if(!err) {
								res.statusCode = 200;
								console.log('Parking lot status updated');
								res.send('Parking lot status has been updated into the system as per your request :)');
							} else {
								res.statusCode = 404;
								res.send('Could not update the parking spot status.' + 
								'Check your REST call for all the required information.');
								console.log('Could not update the parking spot status and here is why: ', err);
							}
						});
					} else {
						res.statusCode = 404;
						res.send('No such entry exists in the system so cannot update');
						console.log('No such entry exists in the parking lot database so cannot update');
					}
  				});
			} else {
				console.log('There was problem authorizing you as a user and here is why: ', err);
				res.statusCode = 404;
				res.send('There was a problem authorizing you as a user into the system :(');
			}
		}); 
	}
});




// Deleting a parking lot. DELETE request. Note, this is only to be used by the admin
// Example: curl --data "uname=swapnil&password=swapnil&id=A01" http://localhost:4242/api/parkingstatus -X DELETE
cometpark.del('/api/parkingstatus', function(req, res) {
	if(!req.body.hasOwnProperty('uname') || !req.body.hasOwnProperty('password') || !req.body.hasOwnProperty('id')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api DELETE syntax incorrect');
	} else {
		//console.log('ID: ', req.body.uname, ' password: ', req.body.password);
		connection.query('SELECT * from auth where uname="' + req.body.uname + '" and password="' + req.body.password + '"', function(err, success) {
			if(!err && Object.keys(success).length != 0) {
				console.log('Here is what we got from the auth table: ', success);
				connection.query('DELETE from parkinglot where pid="' + req.body.id + '"', function(err, success) {
					if(!err) {
						console.log('Parking spot deleted');
						res.statusCode = 200;
						res.send('Parking spot deleted as per your request :)');
					} else {
						console.log('Could not delete the parking spot and here is why: ', err);
						res.statusCode = 404;
						res.send('Could not delete the parking spot from the system :(');
					}
				});
			} else {
				console.log('There was problem authorizing you as a user and here is why: ', err);
				res.statusCode = 404;
				res.send('There was a problem authorizing you as a user into the system :(');
			}
		});

	}
}); 

// Launch cometpark server

cometpark.listen(process.env.PORT || 80);	