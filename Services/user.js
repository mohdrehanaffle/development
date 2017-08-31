'use strict'

let mail= require('nodemailer'),
	queryString= require('queryString');
let dbs= require('../Models/user'),
	utilities= require('../Utilities/util'),
	config= require('../config/config');

let model= dbs.model;

let sendMail= mail.createTransport({
	"host": 'smtp.gmail.com',
	"port": 465,
	"secure": true,
	"auth": {
		"user": 'rehanrizvi355@gmail.com',
		"pass": '9690102007'
	}
});


/*Description: Save User Details.
  Method: signup.
  Parameter: DataFromUser, Required Key.
  return-type: json*/
let signup= (dataFromUser, dbs, callback)=> {
	
	let field= config.field;
	let requiredKey= config.requiredKey;
	let keyArray= utilities.isKeyExist(dataFromUser, requiredKey);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Required field "+keyArray.key+" is missing"});
	}

	keyArray= utilities.isValueExistForKey(dataFromUser);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Value is missing for "+keyArray.key+" key"});
	}

	dataFromUser= utilities.trim(dataFromUser);

	let phoneDigit= 10;
	let validate= utilities.checkValidate(dataFromUser, phoneDigit);
	if(!validate.status) {
		return callback({'statusCode': 404, 'statusMessage': "Please enter a valid "+validate.value});
	}

	dataFromUser.pwd= utilities.encryptString(dataFromUser.pwd);

	let reqArray= config.requiredKey;
	let optnlKey= config.optnlKey;
	let finalObject= {};
	for(let key of reqArray) {
		finalObject[key]= dataFromUser[key];
	} 

	for(let key of optnlKey) {
		if(dataFromUser[key]) {
			finalObject[key]= dataFromUser[key];
		}
	} 

	// let finalObject= {
	// 	'fN': dataFromUser.fN,
	// 	'email': dataFromUser.email,
	// 	'pwd': dataFromUser.pwd,
	// 	'pNo': dataFromUser.pNo
	// }

	// if(dataFromUser.lN){
	// 	finalObject.lN= dataFromUser.lN;
	// }
	// if(dataFromUser.uId){
	// 	finalObject.uId= dataFromUser.uId;
	// }
	// if(dataFromUser.DOB){
	// 	finalObject.DOB= dataFromUser.DOB;
	// }
	// if(dataFromUser.gender){
	// 	finalObject.gender= dataFromUser.gender;
	// }

	// if(dataFromUser.img){
	// 	finalObject.img= 'http://192.168.1.233:3000/'+dataFromUser.img;
	// }

	// if(dataFromUser.userId){
	// 	finalObject.userId= dataFromUser.userId;
	// }

	finalObject.otp= utilities.generateOtp();

	let checkDbs= config.checkDbs[dbs];
	if(checkDbs== 'mongodb') {
		let userData= new model(finalObject);
		userData.save((err) => {
			if(err) {
				callback({'statusCode': 500, 'statusMessage': err});
			}
			else {
				model.findOne({"email": finalObject.email}, {"__v": 0}, function(err, data) {
					if(err) {
						callback({'statusCode': 500, 'statusMessage': "Internal Server Error"})
					}
					else {
						let allField= utilities.findAll(field, data);
						callback({'statusCode': 200, 'statusMessage': "signup successfully", "result":allField})
					}
				})
			}
		})
	}

}


//Method to authenticate user
/**
DB : mysql/mongodb
loginKey : email/mobile
**/
let login = (data, loginType, dbs, reqKey, resValue, callback)=>{


	if(loginType==undefined){
	return callback({"statusCode":404, "statusMessage" : "email or phone number is missing"})	
	}
	data=utilities.trim(data)
    let phoneDigit = config.phoneDigit;
    var loginArr = [];
    loginArr.push('pwd',loginType);
    
    let iskeyExists = utilities.isKeyExist(data,loginArr);
    if(!iskeyExists.status) {
 	return callback({"statusCode":404, "statusMessage" : "required field "+iskeyExists.key +" is missing"})
    }
    let isValueExistsForkey = utilities.isValueExistForKey(data,loginArr);
    if(isValueExistsForkey.status!=true) {
 	return callback({"statusCode":404, "statusMessage" :"required value "+isValueExistsForkey.key +" is missing"});
    }
   
  	let validate= utilities.checkValidate(data, phoneDigit);
	if(validate.status!=true) {
		return callback({'statusCode': 404, 'statusMessage': "Please enter a valid "+validate.value});
	}
	/*encrypt the pwd for match */
	   data.pwd=utilities.encryptString(data.pwd);
			
  /*check loginKey Exists in database */ 
	model.findOne ({email:data.email,pwd:data.pwd},{"__v":0}, function(err,info){
		if(err ) {
			callback({'statusCode': 500, 'statusMessage': "Internal Server Error"})
		}
		
		if(info==null) {
			callback({'statusCode': 404, 'statusMessage': "Email or pwd is not valid"})
			
		}
	 	else {
	 		if(resValue.length== 0){
	 			callback({'statusCode': 200, 'statusMessage': "Login successfully"});
	 		}
	 		if(resValue.length== 1 && resValue[0]== 1){
	 			callback({'statusCode': 200, 'statusMessage': "Login successfully", "result": info});
	 		}
	 		if(resValue.length >= 1 && resValue[0]!=1){
	 			let findkey= utilities.findKey(info, resValue);	
	 			callback({'statusCode': 200, 'statusMessage': "Login successfully", "result": findkey});
	 		}
	 	}
		
		
	})

}


/*Description: Forget pwd.
  Method: forget.
  Parameter: DataFromUser.
  return-type: json*/
let forget= (dataFromUser, dbs, callback) => {

	let reqKey= ['email'];
	let keyArray= utilities.isKeyExist(dataFromUser, reqKey);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Required field "+keyArray.key+" is missing"});
	}

	keyArray= utilities.isValueExistForKey(dataFromUser);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Value is missing for "+keyArray.key+" key"});
	}

	dataFromUser= utilities.trim(dataFromUser);

	//Check email validation
	let validate= utilities.checkValidate(dataFromUser);
	if(!validate.status) {
		return callback({'statusCode': 404, 'statusMessage': "Please enter a valid "+validate.value});
	}
	let email= dataFromUser.email;

	let checkDbs= config.checkDbs[dbs];
	if(checkDbs== 'mongodb') {
		model.findOne({email: email}, function(err, data) {
			if(err ){
				callback({'statusCode': 500, 'statusMessage': "Internal Server Error"})
			}
		
			if(data==null){
				callback({'statusCode': 404, 'statusMessage': "Please Enter a valid email"})			
			}
			else {
				var encryptedData = utilities.encryptString(`userId=${data["email"]}`);
				let mailOpts= {
					from: 'rehanrizvi355@gmail.com',
					to: email,
					subject: 'Link to forget pwd',
					text: 'http://192.168.1.233:3000/user/verifyForget?data='+encryptedData
				}
				sendMail.sendMail(mailOpts, (err) => {
					if(err) {
						callback({'statusCode': 500, 'statusMessage': "Internal Server Error"})
					}
					else {
						callback({'statusCode': 200, 'statusMessage': "mail has been send to your email"});
					}
				})
			}
		})
	}

}

/*Description: verify Forget password.
  Method: verifyForget.
  Parameter: DataFromUser.
  return-type: json*/
let verifyForget= (query, dataFromUser, dbs, callback) => {

	let reqKey= config.reqKeyForPwd;
	//let email= query.data.userId;
	let keyArray= utilities.isKeyExist(dataFromUser, reqKey);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Required field "+keyArray.key+" is missing"});
	}

	keyArray= utilities.isValueExistForKey(dataFromUser);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Value is missing for "+keyArray.key+" key"});
	}


	dataFromUser= utilities.trim(dataFromUser);

	let email = utilities.decryptString(query.data);
    email = queryString.parse(email);
    email= email.userId;

	let validate= utilities.checkValidate(dataFromUser);
	if(!validate.status) {
		return callback({'statusCode': 404, 'statusMessage': "Please enter a valid "+validate.value});
	}

	let pwd= dataFromUser.pwd;
	let cpwd= dataFromUser.cpwd;

	if(pwd != cpwd) {
		callback({'statusCode': 404, 'statusMessage': "password does not match"});
	}

	pwd= utilities.encryptString(pwd);

	let checkDbs= config.checkDbs[dbs];
	if(checkDbs== 'mongodb') {
		model.findOneAndUpdate({"email": email}, {$set: {"pwd": pwd}}, (err, info) => {

			if(err) {
				callback({'statusCode': 500, 'statusMessage': "Internal Server Error"})
			}
			if(info== null) {
				callback({'statusCode': 404, 'statusMessage': "Please Enter a valid email"})
			}
			else {
				callback({'statusCode': 200, 'statusMessage': "password reset successfully", "result":info})
			}
		})
	}

}


/*Description: verify OTP.
  Method: verifyOTP.
  Parameter: DataFromUser.
  return-type: json*/
let verifyOTP= (dataFromUser, dbs, callback) => {

	let requiredKey= [];
	if(dataFromUser.email) {
		requiredKey= config.otpRequiredKey[0];
	}
	else if(dataFromUser.pNo) {
		requiredKey= config.otpRequiredKey[1];
	}
	else {
		callback({'statusCode': 404, 'statusMessage': "Please Enter either email or pNo"})
	}

	let keyArray= utilities.isKeyExist(dataFromUser, requiredKey);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Required field "+keyArray.key+" is missing"});
	}

	keyArray= utilities.isValueExistForKey(dataFromUser);
	if(!keyArray.status) {
		return callback({'statusCode': 404, 'statusMessage': "Value is missing for "+keyArray.key+" key"});
	}

	let key= requiredKey[0];
	let otp= dataFromUser.otp;

	let checkDbs= config.checkDbs[dbs];
	if(checkDbs== 'mongodb') {
		if(key== 'email') {
			var query = {"email": dataFromUser[key], "otp": otp};
		}
		if(key== 'pNo') {
						console.log("rehan")
			var query = {"pNo": dataFromUser[key], "otp": otp};
		}
		model.findOne(query, function(err, data) {
			if(err) {
				callback({'statusCode': 500, 'statusMessage': "Internal Server Error"});
			}
			if(data) {
				callback({'statusCode': 200, 'statusMessage': "otp send successfully"})
			}
			else{
				callback({'statusCode': 404, 'statusMessage': "Please Enter a valid email or pNo or otp"})
			}
			
		})
	}

}



module.exports= {
	signup: signup,
	login: login,
	forget: forget,
	verifyForget: verifyForget,
	verifyOTP: verifyOTP
}