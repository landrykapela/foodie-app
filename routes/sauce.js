const express = require('express');
const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');
const router = express.Router();

//post sauce endpoint
router.post('/', auth,sauceController.addNewSauce);

//get single sauce endpoint
router.get('/:id', auth, sauceController.getSauceById);

//edit single sauce endpoint
router.put('/:id', auth, sauceController.modifySauce);

//delete single sauce item endpoint
router.delete('/:id', auth, sauceController.deleteSauce);

//post a like/dislike endpoint
router.post('/:id/like', auth, sauceController.captureLikes);


//get all saurces endpoint
router.get('/', auth, sauceController.getAllSauces);


module.exports = router;