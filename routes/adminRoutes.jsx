const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.jsx');
const { getDonarListController, getHospitalListController, getOrganisationListController, deleteDonarController } = require('../controllers/adminController.jsx');
const adminMiddleware = require('../middlewares/adminMiddleware.jsx');

const router = express.Router();

//get donar list
router.get('/donar-list', authMiddleware, adminMiddleware, getDonarListController);

//get hospital list
router.get('/hospital-list', authMiddleware, adminMiddleware, getHospitalListController);

//get organisation list
router.get('/organisation-list', authMiddleware, adminMiddleware, getOrganisationListController);

//=======================
//delete donar list
router.delete('/delete-donar/:id', authMiddleware, adminMiddleware, deleteDonarController);

module.exports = router;