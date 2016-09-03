var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;

app.get('/sort.js', function(req, res) {
	res.sendFile(path.join(__dirname + '/sort_test.html'));
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/sort_test.html'));
});

app.listen(port);
console.log('Magic happening at port ' + port);