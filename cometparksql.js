var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mysql = require('mysql'),
    connection;

var cometpark = express();

// Database - Using the felixge/node-mysql library to interact with the mysql server
connection = mysql.createConnection({
	host: 'rohitsonwalkar.com',
	user: 'root',
	password: 'root',
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
  cometpark.use(express.bodyParser());
  cometpark.use(express.methodOverride());
  cometpark.use(cometpark.router);
  cometpark.use(express.static(path.join(application_root, "public")));
  cometpark.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

cometpark.get('/api', function (req, res) {
	res.statusCode = 200;  
	res.type('text/plain'); // set content-type
  	res.send('Success. Cometpark API is up and running :)');
});

// retreiving current parking status of the cometpark system
// Example: curl http://localhost:4242/api/parkingstatus -X GET
cometpark.get('/api/parkingstatus', function (req, res) {
  connection.query('SELECT * FROM parkinglot', function(err, success) {
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

// Receive a POST request from the controller and update the same in the database.
// POST is for creating a new entry into the database
// Example: curl --data "lot=A&id=A01&status=occupied&permit=green" http://localhost:4242/api/parkingstatus -X POST
cometpark.post('/api/parkingstatus', function(req, res) {
	console.log('POST: ', req.body);
	if(!req.body.hasOwnProperty('lot') || !req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('status') || !req.body.hasOwnProperty('permit')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api POST syntax incorrect');
	} else {
		connection.query('INSERT into parkinglot values ("'+ req.body.lot + '","' + req.body.id + '","' + req.body.status + '","' + req.body.permit + '")', function(err, success) {
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
	}
});

// Updating a parking lot status using a PUT request
// Example: curl --data "id=A03&status=occupied" http://localhost:4242/api/parkingstatus -X PUT
cometpark.put('/api/parkingstatus', function(req, res) {
	if(!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('status')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api PUT syntax incorrect');
	} else {
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
	}
}); 

// Deleting a parking lot. DELETE request. Note, this is only to be used by the admin
// Example: curl --data "id=A01" http://localhost:4242/api/parkingstatus -X DELETE
cometpark.delete('/api/parkingstatus', function(req, res) {
	if(!req.body.hasOwnProperty('id')) {
		res.statusCode = 400;
		res.type('text/plain');
		return res.send('Error 400 : Cometpark api DELETE syntax incorrect');
	} else {
		connection.query('DELETE from parkinglot where pid="', req.body.id, '"', function(err, success) {
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
	}
}); 

// Launch cometpark server

cometpark.listen(process.env.PORT || 4242);	