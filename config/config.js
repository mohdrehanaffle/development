/*Description: Check allKey for signup
   Method: field.*/
let field= ['fN', 'socialId', 'loginType', 'token', 'lN', 'email', 'pwd', 'pNo', 'DOB', 'gender', 'img', 'otp'];

/*Description: Check reqKey for signup
   Method: requiredKey.*/
let requiredKey= ['fN', 'pwd', 'email', 'pNo'];

/*Description: Check optnlKey for signup
   Method: optnlKey.*/
let optnlKey= ['socialId', 'loginType', 'token', 'lN', 'DOB', 'gender', 'img', 'otp'];

/*Description: Check reqKey for login
   Method: reqKey.*/
let reqKey= ['email', 'pNo', 'uId', 'pwd']

/*Description: Check reqKey for otp
   Method: otpRequiredKey.*/
let otpRequiredKey= [['email', 'otp'], ['pNo', 'otp']];


/*Description: Send only resValue for login
   1->All fields
   Method: resValue.*/
let resValue= ['gender'];

/*Description: Check Database
   Method: checkDbs.*/
let checkDbs= {
	'1': 'mongodb',
	'2': 'mysql'
};

/*Description: Check reqKey to verify forget
   Method: reqKeyForPwd.*/
let reqKeyForPwd= ['pwd', 'cpwd'];

//Number of phone digit
let phoneDigit = 10;


module.exports= {
	checkDbs: checkDbs,
	resValue: resValue,
	phoneDigit: phoneDigit,
	reqKey :reqKey,
	field: field,
	requiredKey: requiredKey,
	optnlKey: optnlKey,
	otpRequiredKey: otpRequiredKey,
	reqKeyForPwd: reqKeyForPwd

}