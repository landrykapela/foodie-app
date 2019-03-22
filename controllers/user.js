const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const BCRYPT_SALT_LENGTH = 12;

exports.registerUser = (req,res,next) =>{
	let userPassword = req.body.password;
	let userEmail = req.body.email;
	bcrypt.hash(userPassword, BCRYPT_SALT_LENGTH)
		.then((hashedPassword)=>{
			
			const user = new User({
			email : userEmail,
			password : hashedPassword
			});
			console.log(user);
			
			user.save().then(
				()=>{
					let msg = "User successfully registered";
					console.log(msg);
					res.status(201).json({message:msg});
			})
			.catch((error)=>{
				console.error(error);
				res.status(400).json({error:error});
			});
		})
		.catch((error)=>{
			return "hashing error";
		});
}

//sign in user with email and password
exports.signInUser =  (req,res,next) =>{
	console.log("This is user controller.signInUser");
	// let charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	// let length = 16;
	// var random_secret = "";
	// for(let i=0;i<length;i++){
	// 	random_secret += charSet.charAt(Math.floor(Math.random() * charSet.length));
	// }
	User.findOne({email:req.body.email})
	.then((user) =>{
		//compare user provided password with stored hash
		bcrypt.compare(req.body.password, user.password)
		.then((verified)=>{
			console.log("verified: "+verified+" userid: "+user._id);
			if(verified){
				const token = jwt.sign({userId : user._id}, 'random_secret', {expiresIn: '24h'});
				console.log("token: "+ token);
				//return response
				let result = {userId:user._id, token: token};
				console.log(result);
				res.status(200).json(result);
			}
			else{
				console.log("login failed");
				res.status(401).json({error: new Error("Invalid user or password")});
			}
	
		})
		.catch((error)=>{
			console.error(error);
			res.status(500).json({error:error});
		});
		
	})

	.catch((error)=>{
		console.error(error);
		res.status(500).json({error:error});
	 });
	
}