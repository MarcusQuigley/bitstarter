var express = require('express');
var fileName = 'index.html'
var fs= require('fs');
var msg = new Buffer(fs.readFileSync(fileName),'utf8');
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(msg);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
