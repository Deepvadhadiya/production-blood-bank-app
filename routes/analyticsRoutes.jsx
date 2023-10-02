const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware.jsx');
const { bloodGroupDetailsController } = require('../controllers/analyticsController.jsx');


const router = express.Router();

//get blood data || get
router.get('/bloodGroups-data', authMiddleware, bloodGroupDetailsController);

module.exports = router;