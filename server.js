var express = require('express');
var app = express();
var sort = require('./app/routes/sort')
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var assert = require('assert');
var path = require('path');
var port = process.env.PORT || 8080;

// load the config ====================================
var database = require('./config/database');
mongoose.connect(database.url, function(err) {
	if (err) throw err;
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(methodOverride());

/*
var forecast = new Forecast({
	key: '3fdb6a1db6e77e03ab524ab2931d0fde'
});
var lat = 34;
var long = -84;
var options = {
	exclude: 'daily,minutely',
	extend: 'hourly'
};

app.use(forecast.fetch);*/

// routes =========================================
require('./app/routes/routes')(app);


//start app with node =============================
app.listen(port);
console.log('Magic happening at port ' + port);
