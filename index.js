var express = require('express');

var app = express();

app.use(express.static('public'));

var server = app.listen(1337, function() {
	var port = server.address().port
	console.log('Listening on port %s...', port)
});