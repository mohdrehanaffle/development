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







//Method to authenticate user
/**
DB : mysql/mongodb
loginKey : email/mobile
**/
let login = (data,DB,loginkey,callback)=>{
	data=utilities.trim(data)
    var DB=1;
    var phoneDigit = 10;
	var requiredKey=[];
	if(data.email) {
 	requiredKey.push('email')
    }
    if(data.phoneNumber) {
 	requiredKey.push('phoneNumber')
    }
    var iskeyExists = utilities.isKeyExist(data,requiredKey);
    console.log(iskeyExists)
    if(!iskeyExists.status) {
 	return callback({"statusCode":404, "statusMessage" : "required field"+iskeyExists.key +"is missing"})
    }
    var isValueExistsForkey    = utilities.isValueExistForKey(data,requiredKey);
    if(isValueExistsForkey.status!=true) {
 	return callback({"statusCode":404, "statusMessage" :"required value"+iskeyExists.key +"is missing"});
    }
   
  	let validate= utilities.checkValidate(data, phoneDigit);
	if(validate.status!=true) {
		return callback({'statusCode': 404, 'statusMessage': "Please enter a valid "+validate.value});
	}
	/*encrypt the password for match */
   	data.password=utilities.encryptString(data.password);
			
  /*check loginKey Exists in database */ 
	model.findOne ({loginkey:data.loginkey,password:data.password},function(err,data){
		if(err ) {
			callback({'statusCode': 500, 'statusMessage': "Internal Server Error"})
		}
		
		if(data==null) {
			console.log(data)
			callback({'statusCode': 404, 'statusMessage': "Email or Password is not valid"})
			
		}
		 callback({'statusCode': 200, 'statusMessage': "Login successfully","result":data})
	})

}


module.exports= {
	signup: signup,
	login: login 
}