const express = require('express');
const { registerController, loginController, currentUserController } = require('../controllers/authController.jsx');
const authMiddleware = require('../middlewares/authMiddleware.jsx');

//router object
const router = express.Router();

//routes
//Register || post
router.post('/register', registerController);

//Login || post
router.post('/login', loginController);

//get current user || get
router.get('/current-user', authMiddleware, currentUserController)

//exports
module.exports = router;