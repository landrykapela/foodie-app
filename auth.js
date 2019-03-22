const jwt = require('jsonwebtoken');

module.exports = (req,res,next)=>{

	try{
		let token = req.headers.authorization.split(" ")[1];
		let decodedToken = jwt.verify(token, 'random_secret');
		let userId = decodedToken.userId;
		let uid = req.body.userId;
		if(userId){
			if(uid !== userId){
				let error = new Error("Invalid User ID");
				console.error(error);
				throw error;
			}
			else{
				next();
			}
		}
	}
	catch{
		res.status(401).json({
			error: new Error("Invalid User ID")
		});
	}
}