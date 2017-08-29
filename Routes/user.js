'use strict'

let express= require('express'),
	router= express.Router(),
	bodyParser= require('body-parser'),
	multer= require('multer');

let service= require('../Services/user'),
	utilities= require('../Utilities/util');

let store= multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, __dirname+'/../upload')
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname)
	}
});

var upload= multer({storage: store});

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

/* user signup.
consumes: Appilication/json.
required: firstName, userName, password, email, phoneNumber.
optional: lastName, Date_Of_Birth, gender, image.
produce: Appilication/json.*/
router.post('/signUp', upload.any(), (req, res) => {
	var dbs= 1;
	var body= req.body;
	if(req.files.length >0) {
		var image= req.files[0].originalname;
		body.image= image;
		service.signup(body, dbs, (data)=> {
			res.send(data);
		})
	}
	else {
		service.signup(body, dbs, (data)=> {
			res.send(data);
		})
	}
})

module.exports= router;