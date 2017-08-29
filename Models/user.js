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
	firstName: {type: String},
	lastName: {type: String},
	email: {type: String, unique: true},
	password: {type: String},
	phoneNumber: {type: Number, unique: true},
	gender: {type: String},
	dateOfBirth: {type: String},
	image: {type: String}
}, {collection: 'userInfo'});

let model= mongo.model('userInfo', userSchema);

module.exports= {
	model: model
}