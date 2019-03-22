const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema(
	{
		userId: {type:String, required: true},
		name: {type:String, required: true},
		manufacturer: {type:String, required: true},
		description: {type:String},
		mainPepper: {type:String, required: true},
		imageUrl: {type:String},
		heat: {type:Number, default:1,required: true},
		likes: {type: Number, default:0, required: true},
		dislikes: {type: Number, default:0, required: true},
		usersLiked: {type: Array, default: []},
		usersDisliked: {type: Array, default: []},
	}
);
module.exports = mongoose.model('Sauce',sauceSchema);