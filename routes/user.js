const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');



//signup endpoint
router.post('/signup', userController.registerUser);

//login endpoint
router.post('/login',userController.signInUser);




module.exports = router;