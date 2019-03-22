const express = require('express');
const mongoose= require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//connecting to mongo db atlas
//connect to mongo atlas

mongoose.connect('mongodb+srv://#####:******@Cluster0-dsv00.mongodb.net/test?retryWrites=true', {useNewUrlParser:true})
.then(()=>{
	console.log("Successfully connected to MongoDb Atlas");
})
.catch((error) => {
	console.log("Something went wrong while connecting to MongoDB Atlas");
	console.error(error);
});

//allow CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//encode body into json
app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json());


//register authentication routes
app.use('/api/auth', userRoutes);

//register sauces route
app.use('/api/sauces', sauceRoutes);
module.exports = app;