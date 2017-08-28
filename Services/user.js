'use strict'

let dbs= require('./Models/user'),
	utilities= require('./Utilities/util');

let model= dbs.model;


/*Description: Save User Details.
  Method: signup.
  Parameter: DataFromUser, Required Key.
  return-type: json*/
let signup= (dataFromUser, requiredKey, dbs, callback)=> {
	
	var requiredKey= ['firstName', 'password', 'email', 'phoneNumber'];
	let keyArray= utilities.isKeyExist(dataFromUser, requiredKey);
	if(!keyArray.status) {
		return callback("Required field "+keyArray.key+" is missing");
	}

	keyArray= utilities.isValueExistForKey(dataFromUser);
	if(!keyArray.status) {
		return callback("Value is missing for "+keyArray.key+" key");
	}

	let dataFromUser= utilities.trim(dataFromUser);

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
				callback(err);
			}
			else {
				callback("")
			}
		})
	}

}

module.exports= {
	signup: signup 
}