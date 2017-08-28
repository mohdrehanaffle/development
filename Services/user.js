'use strict'

let dbs= require('../Models/user'),
	utilities= require('../Utilities/util');

let model= dbs.model;


/*Description: Save User Details.
  Method: signup.
  Parameter: DataFromUser, Required Key.
  return-type: json*/
let signup= (dataFromUser, requiredKey, dbs, callback)=> {
	
	var requiredKey= ['firstName', 'password', 'email', 'phoneNumber'];
	let keyArray= utilities.isKeyExist(dataFromUser, requiredKey);
	if(!keyArray.status) {
		return callback({'statusCode': 0, 'statusMessage': "Required field "+keyArray.key+" is missing"});
	}

	keyArray= utilities.isValueExistForKey(dataFromUser);
	if(!keyArray.status) {
		return callback({'statusCode': 0, 'statusMessage': "Value is missing for "+keyArray.key+" key"});
	}

	dataFromUser= utilities.trim(dataFromUser);

	let phoneDigit= 10;
	let validate= utilities.checkValidate(dataFromUser, phoneDigit);
	if(!validate.status) {
		return callback({'statusCode': 0, 'statusMessage': "Please enter a valid "+validate.value});
	}

	let finalObject= {
		'firstName': dataFromUser.firstName,
		'email': dataFromUser.email,
		'password': dataFromUser.password,
		'phoneNumber': dataFromUser.phoneNumber
	}

	if(dataFromUser.lastName){
		finalObject.lastName= dataFromUser.lastName;
	}
	if(dataFromUser.dateOfBirth){
		finalObject.dateOfBirth= dataFromUser.dateOfBirth;
	}
	if(dataFromUser.gender){
		finalObject.gender= dataFromUser.gender;
	}

	let checkDbs= utilities.checkDbs.dbs;
	if(checkDbs== 'mongodb') {
		var userData= new model(finalObject);
		userData.save((err) => {
			if(err) {
				callback({'statusCode': 0, 'statusMessage': err});
			}
			else {
				callback({'statusCode': 1, 'statusMessage': "Signup successfully"})
			}
		})
	}

}

module.exports= {
	signup: signup 
}