'use strict'

let express= require('express'),
	app= express(),
	bodyParser= require('body-parser');

let routes= require('./Routes/user');

app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Method', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
	res.setHeader('Access-Control-Allow-credentials', true);
	next();
})

app.use('/user', routes);

//First api to check if server is running
app.get('/', function(req, res) {
	res.send("hello world");
})

app.listen(3000, function(req, res) {
	console.log("server is running at 3000 port");
})