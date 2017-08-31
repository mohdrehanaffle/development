'use strict'

let express= require('express'),
	router= express.Router(),
	bodyParser= require('body-parser'),
	multer= require('multer');

let service= require('../Services/user'),
	utilities= require('../Utilities/util'),
	config= require('../config/config');

let store= multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, __dirname+'/../upload')
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname)
	}
});

let upload= multer({storage: store});

router.use(bodyParser.urlencoded({
	extended: true
}));
router.use(bodyParser.json());

/* user Signup.
consumes: Appilication/json.
required: fN, userName, pwd, email, pNo.
optional: lN, Date_Of_Birth, gender, img.
produce: Appilication/json.*/
router.post('/signUp', upload.any(), (req, res) => {
	let dbs= 1;
	let body= req.body;
	if(req.files.length >0) {
		let img= req.files[0].originalname;
		body.img= img;
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


/* User Login. 
 Consumes: application/json
Required: email,userName,pNo
Produces: application/json
DB : mysql/mongodb
loginKey : 1(email),2(userName),3(pNo)
*/
router.post('/login', (req, res) => {
	let dbs = config.checkDbs[1];
	let reqKey= config.reqKey;
	let loginType =utilities.loginType(req.body,reqKey);
	let resValue= config.resValue;

	service.login(req.body, loginType, dbs, reqKey, resValue, (data) => {
        res.send(data);
    });
});


/* user Forget.
consumes: Appilication/json.
required: email.
produce: Appilication/json.*/
router.post('/forget', (req,res) => {
	let dbs= 1;
	let body= req.body;

	service.forget(body, dbs, (data) => {
		res.send(data);
	})
})


/*user verify Forget.
consumes: Appilication/json.
required: pwd, cpwd
produce: Appilication/json.*/
router.post('/verifyForget', (req,res) => {
	let dbs= 1;
	let body= req.body;

	service.verifyForget(req.query, body, dbs, (data) => {
		res.send(data);
	})
})


/*user verify OTP.
consumes: Appilication/json.
required: email, pNo, otp
produce: Appilication/json.*/
router.post('/verifyOTP', (req,res) => {
	let dbs= 1;
	let body= req.body;

	service.verifyOTP(body, dbs, (data) => {
		res.send(data);
	})
})


module.exports= router;