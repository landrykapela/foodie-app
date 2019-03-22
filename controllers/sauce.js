const Sauce = require('../models/sauce');
const multiparty = require('multiparty');
const image2Base64 = require('image-to-base64');

exports.addNewSauce = (req,res,next) =>{
	console.log("creating sauce...");
	const form = new multiparty.Form();
	form.parse(req, (err,fields,files)=>{
		let sauceObject = JSON.parse(fields.sauce);
	    let imageObject = {...files.image[0]};
		
		let contentType = imageObject.headers['content-type'];
		let imagePath = "data:" + contentType + ";base64,";
		
		image2Base64(imageObject.path)
		.then((imageData)=>{
			imagePath += imageData;
			
			//defining the sauce
			const sauce = new Sauce({
				userId: sauceObject.userId,
				manufacturer: sauceObject.manufacturer,
				description: sauceObject.description,
				mainPepper: sauceObject.mainPepper,
				imageUrl: imagePath,
				heat: sauceObject.heat,
				name: sauceObject.name,
				likes: 0,
				dislikes: 0,
				usersLiked: [],
				usersDisliked: []
			});
			
			//saving to sauce to mongoDB
			sauce.save()
			.then(()=>{
				let msg = "Sauce saved successfully";
				console.log(msg);
				res.status(201).json({message:msg});
			})
			.catch((error)=>{
				console.error(error);
				res.status(400).json({error:error});
			});
		})
		.catch((error)=>{
			console.error(error);
			res.status(400).json({error:error});
		});
		

		
	});

};
exports.getAllSauces =  (req,res,next) => {
	console.log("Getting all sauces...");
	Sauce.find()
	.then((sauces) =>{
		console.log("Successful");
		res.status(200).json(sauces);
	})
	.catch((error)=>{
		console.error(error);
		res.status(400).json({error:error});
	});
};
//get sauce by id
exports.getSauceById =  (req,res,next)=>{
	Sauce.findOne({_id:req.params.id})
		.then((sauce) =>{
			res.status(200).json(sauce);
		})
		.catch((error) =>{
			console.error(error);
			res.status(400).json({error:error});
		});
};

//modify a sauce
exports.modifySauce = (req,res,next) =>{
	console.log("req.params.id: "+req.params.id);
	const form = new multiparty.Form();
	form.parse(req,(err,fields,files)=>{
		// let sauceObject = JSON.parse(fields.sauce);
		// let imageObject = {...files.image[0]};
		// //get content type for encoding to base64
		// let contentType = imageObject.headers['content-type'];
		// let imagePath = "data:" + contentType +";base64,";
		if(files){
		console.log(files.image[0].headers['content-type']);
			let sauceObject = JSON.parse(fields.sauce);
			let imageObject = files.image[0];
			//get content type for encoding to base64
			let contentType = imageObject.headers['content-type'];
			let imagePath = "data:" + contentType +";base64,";
			
			image2Base64(imageObject.path)
			.then((imageData) =>{
				imagePath += imageData;
				const sauce = new Sauce({
					_id: req.params.id,
					userId: sauceObject.userId,
					manufacturer: sauceObject.manufacturer,
					description: sauceObject.description,
					mainPepper: sauceObject.mainPepper,
					imageUrl: imagePath,
					heat: sauceObject.heat,
					name: sauceObject.name,
					likes: sauceObject.likes,
					dislikes: sauceObject.dislikes,
					usersLiked: sauceObject.usersLiked,
					usersDisliked: sauceObject.usersDisliked
				});
				Sauce.updateOne({_id:req.params.id}, sauce)
					.then(() =>{
						let msg = "Sauce updated successfully";
						console.log(msg);
						res.status(201).json({message:msg});
					})
					.catch((error)=>{
						console.error(error);
						res.status(400).json({error:error});
					});

			})
			.catch((error) =>{
				console.error(error);
				res.status(400).json({error:error});
			});
		}
		else{
			const sauce = new Sauce({
					_id: req.params.id,
				userId: req.body.userId,
				manufacturer: req.body.manufacturer,
				description: req.body.description,
				mainPepper: req.body.mainPepper,
				imageUrl: req.body.imageUrl,
				heat: req.body.heat,
				name: req.body.name,
				likes: req.body.likes,
				dislikes: req.body.dislikes,
				usersLiked: req.body.usersLiked,
				usersDisliked: req.body.usersDisliked
			});
			//update database
			Sauce.updateOne({_id:req.params.id}, sauce)
					.then(() =>{
						let msg = "Sauce updated successfully";
						console.log(msg);
						res.status(201).json({message:msg});
					})
					.catch((error)=>{
						console.error(error);
						res.status(400).json({error:error});
					});

	
	}
		});
}
//delete sauce
exports.deleteSauce =  (req,res,next)=>{
	Sauce.deleteOne({_id : req.params.id})
	.then(()=>{
		let msg = "Deleted item with id: "+ req.params.id;
		console.log(msg);
		res.status(201).json({message: msg});
	})
	.catch((error)=>{
		console.error(error);
		res.status(400).json({error:error});
	});
};

//capture likes and dislikes
exports.captureLikes =  (req,res,next)=>{

	Sauce.findOne({_id : req.params.id})
		.then((mySauce)=>{
			let likes = mySauce.likes;
			let dislikes = mySauce.dislikes;
			let like = req.body.like;
			let user = req.body.userId;
			let usersLiked = mySauce.usersLiked;
			let usersDisliked = mySauce.usersDisliked;
			switch(like){
				case -1:
					dislikes += 1;
					usersDisliked.push(user);
					break;
				case 0:
					if(usersLiked.includes(user)){
						likes -= 1;
						usersLiked.splice(usersLiked.indexOf(user));
					}
					else{
						if(usersDisliked.includes(user)){
							dislikes -= 1;
							usersDisliked.splice(usersDisliked.indexOf(user));
						}
					}
					break;
				case 1:
					likes += 1;
					usersLiked.push(user);
					break;
			}
			const sauceToEdit = new Sauce({
				_id : req.params.id,
				userId: mySauce.userId,
				manufacturer: mySauce.manufacturer,
				description: mySauce.description,
				mainPepper: mySauce.mainPepper,
				imageUrl: mySauce.imageUrl,
				heat: mySauce.heat,
				name: mySauce.name,
				likes: likes,
				dislikes: dislikes,
				usersLiked: usersLiked,
				usersDisliked: usersDisliked
			});
			//save to database
			Sauce.updateOne({_id : req.params.id}, sauceToEdit)
				.then(()=>{
					let msg = "Sauce updated successfully";
					console.log(msg);
					res.status(201).json({message:msg});
				})
				.catch((error)=>{
					console.error(error);
					res.status(400).json({error:error});
				});
		})
		.catch((error)=>{
			console.error(error);
			res.status(200).json({error:error});
		});
	
};