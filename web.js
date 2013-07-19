var express = require('express');
var fileName = 'index.html'
var fs= require('fs');
var msgBuff = new Buffer(fs.readFileSync(fileName),'utf8');
var msg = msgBuff.toString('utf8',0,msgBuff.length);
var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(msg);
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
