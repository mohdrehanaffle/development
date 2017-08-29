'use strict'

let dbs= require('../Models/user'),
	utilities= require('../Utilities/util');

let model= dbs.model;


/*Description: Save User Details.
  Method: signup.
  Parameter: DataFromUser, Required Key.
  return-type: json*/
let signup= (dataFromUser, dbs, callback)=> {
	
	var requiredKey= ['firstName', 'password', 'email', 'phoneNumber'];
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

	dataFromUser.password= utilities.encryptString(dataFromUser.password);

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

	if(dataFromUser.image){
		finalObject.image= dataFromUser.image;
	}

	let checkDbs= utilities.checkDbs[dbs];
		console.log("finalObject",finalObject)
	if(checkDbs== 'mongodb') {
		var userData= new model(finalObject);
		userData.save((err) => {
			if(err) {
				callback({'statusCode': 500, 'statusMessage': err});
			}
			else {
				callback({'statusCode': 200, 'statusMessage': "Signup successfully"})
			}
		})
	}

}

module.exports= {
	signup: signup 
}