'use strict'

let express= require('express'),
	router= require.Router(),
	bodyParser= require('body-parser'),
	multer= require('multer');

let service= require('./Services/user'),
	utilities= require('./Utilities/util');

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

let storage= multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, __dirname+'/upload')
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname)
	}
});

var upload= multer({storage: storage});

/* user signup.
consumes: Appilication/json.
required: firstName, userName, password, email, phoneNumber.
optional: lastName, Date_Of_Birth, gender, image.
produce: Appilication/json.*/
router.post('/signUp', upload.any(), (req, res) => {
	var dbs= 1;
	if(req.file != undefined) {
		var body= req.body;
		var iamge= req.file;
		body.image= image[0].originalname;
		service.signup(body, requiredKey, dbs, (data)=> {
			res.send(data);
		})
	}
	else {
		service.signup(body, requiredKey, dbs, (data)=> {
			res.send(data);
		})
	}
})

module.exports= router;