const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.jsx');
const { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrganisationController, getOrganisationForHospitalController, getInventoryForHospitalController, getRecentInventoryController } = require('../controllers/inventoryController.jsx');

const router = express.Router();

//routes
//add inventory || post
router.post('/create-inventory', authMiddleware, createInventoryController);

//get all inventory || get
router.get('/get-inventory', authMiddleware, getInventoryController);

//get recent inventory || get
router.get('/get-recent-inventory', authMiddleware, getRecentInventoryController);

//get donar || get
router.get('/get-donars', authMiddleware, getDonarsController);

//get hospital || get
router.get('/get-hospitals', authMiddleware, getHospitalController);

//get organisation || get
router.get('/get-organisations', authMiddleware, getOrganisationController);

//get organisation || get
router.get('/get-organisations-for-hospital', authMiddleware, getOrganisationForHospitalController);

//get hospital blood || get
router.post('/get-inventory-hospital', authMiddleware, getInventoryForHospitalController);

module.exports = router;