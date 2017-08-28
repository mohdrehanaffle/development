'use strict'

/*Description: Check Key exist in data Object.
  Method: isKeyExist.
  Parameter: dataObject, required Key.*/
let isKeyExist= (obj, keyArray)=> {
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
			return {'status': false, 'value': email};
		}
	}
	if(obj.phoneNumber){
		if(obj.phoneNumber.length!=phoneDigit)
		return {'status': false, 'value': obj.phoneNumber};
	}
	if(obj.password){
		var password= obj.password;
		var passwordPattern= /^[A-Za-z0-9 ]{6,20}$/;
		if(!passwordPattern.test(password)){
			return {'status': false, 'value': password};
		}
	}
	else {
		return {'status': true};
	}
}

/*Description: Trim the value of data Object.
  Method: trim
  Parameter: dataObject*/
let trim= (obj)=> {
	for(var key in obj) {
		var value= obj[key].trim();
		obj[key]= value;
	}
	return obj;
}

module.exports= {
	isKeyExist: isKeyExist,
	isValueExistForKey: isValueExistForKey,
	checkDbs: checkDbs,
	checkValidate: checkValidate,
	trim: trim
}
