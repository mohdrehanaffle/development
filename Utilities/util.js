'use strict'

let crypto= require('crypto');
	//client = require('twilio')(config.TWILIO_CONFIG.sid, config.TWILIO_CONFIG.auth_token);

let encryption= {
	algorithm: 'aes-256-ctr',
	pwd: 'node@crypto123#-encryption'
}

/*Description: Check Key exist in data Object.
  Method: isKeyExist.
  Parameter: dataObject, required Key.*/
let isKeyExist= (obj, keyArray)=> {

	for(let key in keyArray) {
		
		if(!(keyArray[key] in obj)) {
			return {'status': false, 'key': keyArray[key]};
		}		
	}
	return {'status': true};
}

/*Description: Check value exist in data Object.
  Method: isValueExistForKey.
  Parameter: dataObject.*/
let isValueExistForKey= (obj)=> {
  	for(let key in obj) {
  		if(obj[key]==""){
  			return {'status': false, 'key': key};
  		}
  		else {
  			return {'status': true};
  		}
  	}
  }

/*Description: Check Validation.
  Method: checkValidate
  Parameter: dataObject*/
let checkValidate= (obj, phoneDigit)=> {
	if(obj.email) {
		let email= obj.email;
		let emailPettern= /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
		if(!emailPettern.test(email)) {
			return {'status': false, 'value': 'email'};
		}
	}
	if(obj.pNo){
		let pNo= obj.pNo.toString();
		if(pNo.length!=phoneDigit)
		return {'status': false, 'value': 'pNo'};
	}
	if(obj.pwd){
		let pwd= obj.pwd;
		if(pwd.length< 6){
			return {'status': false, 'value': 'pwd'};
		}
		else {
		return {'status': true};
		}
	}
	else {
		return {'status': true};
	}

}

/*Description: Trim the value of data Object.
  Method: trim
  Parameter: dataObject*/
let trim =(obj) => {
  if (!Array.isArray(obj) && typeof obj != 'object') return obj;
  return Object.keys(obj).reduce(function(acc, key) {
    acc[key.trim()] = typeof obj[key] == 'string'? obj[key].trim() : trim(obj[key]);
    return acc;
  }, Array.isArray(obj)? []:{});
}

/*Description: Encrypted data.
  Method: encryptString.
  Parameter: pwd*/
let encryptString= (text)=> {
	let cipher= crypto.createCipher(encryption.algorithm, encryption.pwd);
	let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

/*Description: Decrypted data.
  Method: decryptString.
  Parameter: pwd*/
var decryptString = function decrypt(text) {
    var decipher = crypto.createDecipher(encryption.algorithm, encryption.pwd)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

/*Description: Checking user entered key.
  Method: loginKey.
  Parameter: dataObject*/
let loginKey=(data)=>{
	if(data.email) {
        return 'email';
    } 
    else if(data.pNo) {
        return 'pNo';
    }

}

/*Description: Generate OTP.
  Method: generateOtp.*/
let generateOtp= ()=> {
	return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

/*Description: Send an OTP.
  Method: sendSMS.
  Parameter: pNo, OTP*/
let sendSMS = (to, OTP, cb) => {
    to.length > 10 ? to = to.replace("+65", "+91") : true;
    client.messages.create({
        to: to,
        messagingServiceSid: config.TWILIO_CONFIG.phone,
        body: `Your OTP is ${OTP}`,
    });
}

/*Description: Find info.
  Method: findKey.
  Parameter: dbsObject, keyArray*/
let findKey= (info, keyArray) => {
	let obj= {};
	for(let key of keyArray) {
		if(info[key]) {
			obj[key]= info[key];
		}
	}
	return obj;
}


/*Description: Find All Field of User.
  Method: findAll.
  Parameter: dbsObject, dataObject*/
let findAll= (obj, dbsObject)=> {
	let allField= dbsObject;
	for(let key of obj) {
		if(!dbsObject[key]) {
			allField[key]= "";
		}
	}
	return allField;
}

/*Description: Find login type.
  Method: loginType.
  Parameter: dataObject, reqkey*/
let loginType = (obj,reqkey) =>{
for(let key of reqkey) {
	
	if(obj.hasOwnProperty(key)){
 return key;
	}

}
}

module.exports= {
	isKeyExist: isKeyExist,
	isValueExistForKey: isValueExistForKey,
	checkValidate: checkValidate,
	trim: trim,
	encryptString: encryptString,
	decryptString: decryptString,
	generateOtp: generateOtp,
	sendSMS, sendSMS,
	loginType: loginType,
	findKey: findKey,
	findAll: findAll
}
