let mongo= require('mongoose'),
	schema= mongo.Schema;
let url= 'mongodb://127.0.0.1:27017/module';

//create a connection to mongodb
mongo.connect(url, (err)=> {
	if(err) {
		console.log(err);
	}
	else {
		console.log("Database connected successfully");
	}
})

let userSchema= new schema({
	socialId: {type: String},
	loginType: {type: String},
	token: {type: Number},
	fN: {type: String},
	lN: {type: String},
	email: {type: String, unique: true},
	pwd: {type: String},
	pNo: {type: Number, unique: true},
	gender: {type: String},
	DOB: {type: String},
	img: {type: String},
	otp: {type: String}
}, {collection: 'userInfo'});

let model= mongo.model('userInfo', userSchema);

module.exports= {
	model: model
}