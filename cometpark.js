var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose'),
    car;

var cometpark = express();

// Database - Using the mongoose library to interact with the cometpark mongo database

//mongoose.connect('mongodb://localhost/ecomm_database');
mongoose.connect('mongodb://localhost/cometpark');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
		console.log('Connected to the cometpark database');
		// This is the cometpark database schema. As of now, I have only included pid (parking id)
		// and pstatus (parking status). 
		// This link has info on how to use mongoose - http://mongoosejs.com/docs/index.html
		// We can also add any methods to this schema.
		// This link has more information on the allowed schema datatypes - http://mongoosejs.com/docs/guide.html
		var cometparkDatabaseSchema = mongoose.Schema({
			pid: {type: String,  required: true,  unique: true},
			pstatus: {type: String,  required: true}
		});
		// A model is a class with which we construct documents. Be sure to add methods (if any)
		// to the schema before model function is initiated
		car = mongoose.model('cometpark', cometparkDatabaseSchema);
		/*var firstCar = new car({pid : 'P01', pstatus : 'occupied'});
		console.log('firstCar parking status. Parking lot: ', firstCar.pid, ' and Status: ', firstCar.pstatus); 
		// Now, let us store this firstCar instance into the cometpark MongoDB
		firstCar.save(function(err, firstCar) {
			if (err) {
				return console.error(err);
			} else {
				console.log('Entry saved into the database');
			}
		});
		// Finding the firstCar entry from the database
		/*car.find(function(err, firstCar) {
			if (err) {
				return console.error(err);
			} else {
				console.log(firstCar);
			}
		});*/
		// Querying specific data from the database
		/*car.find({name: /^P01/}, function(err, somecar) {
			if (err) {
				return console.error(err);
			} else {
				console.log(somecar);
			}
		});*/
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
  res.send('cometpark API is running');
});

// retreiving current parking status of the cometpark system
cometpark.get('/api/parkingstatus', function (req, res) {
  //res.send('cometpark API is running');
  return car.find(function(err, status) {
  	if(err) {
  		return console.log(err);
  	} else {
  		return res.send(status);
  	}
  });
});

// retreive current parking status of a specific parking spot
// Example: curl http://localhost:4242/api/parkingstatus/P02 -X GET
cometpark.get('/api/parkingstatus/:id', function (req, res) {
  //res.send('cometpark API is running');
  console.log('Get request looks like this: ', req);
  return car.find({'pid' :req.params.id}, function(err, status) {
  	if(err) {
  		return console.log(err);
  	} else {
  		return res.send(status);
  	}
  });
});

// Receive a POST request from the controller and update the same in the database.
// POST is for creating a new entry into the database
// Example: curl --data "id=P01&status=occupied" http://localhost:4242/api/parkingstatus -X POST
cometpark.post('/api/parkingstatus', function(req, res) {
	var newCar;
	console.log('POST: ', req.body);
	newCar = new car({
		// Find a way to extract pid and pstatus from the request
		pid: req.body.id,
		pstatus: req.body.status
	});
	newCar.save(function(err) {
		if(err) {
			return console.log(err);
		} else {
			console.log('New car entry saved into the database');
		}
	});
	return res.send(newCar);
});

// Updating a parking lot status using a PUT request
cometpark.put('/api/parkingstatus/:id', function(req, res) {
	return car.find({pid: req.body.id}, function(err, car) {
		// new parking status. Find a way to send the new parking status over and how 
		// to extract it here
		car.pstatus = req.body.status;
		return car.save(function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log('Parking status updated');
			}
			return res.send(car);
		});
	});
}); 

// Deleting a parking lot DELETE request. Note, this is only to be used by the admin
// Example: curl --data "id=P01" http://localhost:4242/api/parkingstatus -X DELETE
cometpark.delete('/api/parkingstatus', function(req, res) {
	/*return car.find({'pid': req.body.id}, function(err, parkinglot) {
		if(!err) {
		console.log('parking lot to be deleted: ', parkinglot);*/
		// deleting the parking lot entry from the database
		return car.remove({'pid': req.body.id}, function(err) {
			if(err) {
				console.log(err);
			} else {
				console.log('Parking lot removed');
				return res.send('');
			}
		});
		/*} else {
			console.log('Error finding parking lot');
		}
	});*/
}); 

// Launch server

cometpark.listen(4242);
