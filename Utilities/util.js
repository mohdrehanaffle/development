'use strict'

let crypto= require('crypto');

let encryption= {
	algorithm: 'aes-256-ctr',
	password: 'node@crypto123#-encryption'
}

/*Description: Check Key exist in data Object.
  Method: isKeyExist.
  Parameter: dataObject, required Key.*/
let isKeyExist= (obj, keyArray)=> {
	//console.log("obj",obj)
	for(var key in keyArray) {
		if(!(keyArray[key] in obj)) {
			return {'status': false, 'key': keyArray[key]};
		}
		else {
			return {'status': true};
		}
	}
}

/*Description: Check value exist in data Object.
  Method: isValueExistForKey.
  Parameter: dataObject.*/
let isValueExistForKey= (obj)=> {
  	for(var key in obj) {
  		if(obj[key]==""){
  			return {'status': false, 'key': key};
  		}
  		else {
  			return {'status': true};
  		}
  	}
  }

 /*Description: Check Database
   Method: checkDbs.*/
let checkDbs= {
	'1': 'mongodb',
	'2': 'mysql'
};

/*Description: Check Validation.
  Method: checkValidate
  Parameter: dataObject*/
let checkValidate= (obj, phoneDigit)=> {
	if(obj.email) {
		var email= obj.email;
		var emailPettern= /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
		if(!emailPettern.test(email)) {
			return {'status': false, 'value': 'email'};
		}
	}
	if(obj.phoneNumber){
		var phoneNumber= obj.phoneNumber.toString();
		if(phoneNumber.length!=phoneDigit)
		return {'status': false, 'value': 'phoneNumber'};
	}
	if(obj.password){
		var password= obj.password;
		var passwordPattern= /^(?=.*[a-z])(?=.*[A-Z])(?=.{6,})/;
		if(!passwordPattern.test(password)){
			return {'status': false, 'value': 'password'};
		}
		else {
		return {'status': true};
		}
	}
}

/*Description: Trim the value of data Object.
  Method: trim
  Parameter: dataObject*/
let trim= (obj)=> {
	var data= obj;
	for(var key in obj) {
		var value= obj[key].trim();
		obj[key]= value;
	}
	return obj;
}

/*Description: Encrypted password.
  Method: encryptString.
  Parameter: password*/
let encryptString= (text)=> {
	var cipher= crypto.createCipher(encryption.algorithm, encryption.password);
	var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

/*Description: Generate OTP.
  Method: generateOtp.*/
let generateOtp= ()=> {
	return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

/*Description: Send an OTP.
  Method: sendSMS.
  Parameter: phoneNumber, OTP*/
let sendSMS = (to, OTP, cb) => {
    to.length > 10 ? to = to.replace("+65", "+91") : true;
    client.messages.create({
        to: to,
        messagingServiceSid: config.TWILIO_CONFIG.phone,
        body: `Your OTP is ${OTP}`,
    });
}

module.exports= {
	isKeyExist: isKeyExist,
	isValueExistForKey: isValueExistForKey,
	checkDbs: checkDbs,
	checkValidate: checkValidate,
	trim: trim,
	encryptString: encryptString,
	generateOtp: generateOtp,
	sendSMS, sendSMS
}
