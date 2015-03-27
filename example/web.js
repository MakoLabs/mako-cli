/* Example application that can be deployed */
var http = require('http');
var util = require('util');
var os = require("os");
var hostname = os.hostname();
var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(util.format('Running - %s:%s - %s\n', hostname, port, process.pid));
}).listen(port, function() {
    console.log("Listening on " + port);
});
