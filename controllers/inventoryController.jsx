const mongoose = require('mongoose');
const inventoryModel = require('../models/inventoryModel.jsx');
const userModel = require('../models/userModel.jsx');

//create inventory
const createInventoryController = async (req, res) => {
    try {
        const { email } = req.body

        //validation
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error('User Not Found')
        }
        // if (inventoryType === "in" && user.role !== "donar") {
        //     throw new Error('Not a Donar Account')
        // }
        // if (inventoryType === "out" && user.role !== 'hospital') {
        //     throw new Error('Not a Hospital')
        // }

        if (req.body.inventoryType === "out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId);

            //calculate in blood quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate(
                [
                    {
                        $match: {
                            organisation,
                            inventoryType: 'in',
                            bloodGroup: requestedBloodGroup
                        },
                    }, {
                        $group: {
                            _id: '$bloodGroup',
                            total: { $sum: '$quantity' }
                        },
                    },
                ]
            );
            // console.log("Total in", totalInOfRequestedBlood);

            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

            //calculate out blood quantity
            const totalOutOfRequestedBlood = await inventoryModel.aggregate(
                [
                    {
                        $match: {
                            organisation,
                            inventoryType: "out",
                            bloodGroup: requestedBloodGroup
                        },
                    },
                    {
                        $group: {
                            _id: '$bloodGroup',
                            total: { $sum: '$quantity' }
                        },
                    },
                ]
            );
            const totalOut = totalOutOfRequestedBlood[0]?.total || 0;

            //in & out calculation
            const availableQuantityOfBloodGroup = totalIn - totalOut;

            //validation quantity
            if (availableQuantityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuantityOfBloodGroup} ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id
        }

        //save record
        const inventory = new inventoryModel(req.body)
        await inventory.save();
        return res.status(200).send({
            success: true,
            message: 'New Blood Record Added',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Create Inventory Api',
            error,
        });
    }
};

//get inventory
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({ organisation: req.body.userId }).populate('hospital').populate('donar').sort({ createdAt: -1 });
        //.populate('hospital') add this after create hospital
        return res.status(200).send({
            success: true,
            message: 'Get all Records Successfully',
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Get All Inventory',
            error,
        });
    }
}

//get donar records
const getDonarsController = async (req, res) => {
    try {
        const organisation = req.body.userId;

        //find donar
        const donarId = await inventoryModel.distinct("donar", {
            organisation
        });
        // console.log(donorId);
        const donars = await userModel.find({ _id: { $in: donarId } });

        return res.status(200).send({
            success: true,
            message: 'Donar Record Fetched Successfully',
            donars,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Donar Record',
            error,
        });
    }
}

//get hospitals recoard
const getHospitalController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //get hospital id
        const hospitalId = await inventoryModel.distinct("hospital", {
            organisation
        });
        //hospital find
        const hospitals = await userModel.find({ _id: { $in: hospitalId } });
        return res.status(200).send({
            success: true,
            message: "Hospital fetched successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Hospital Record',
            error,
        });
    }
}

//get organisation records
const getOrganisationController = async (req, res) => {
    try {
        const donar = req.body.userId;
        const orgId = await inventoryModel.distinct('organisation', { donar });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId }
        });
        return res.status(200).send({
            success: true,
            message: 'Organisation data fetch successfully',
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Organisation Record',
            error,
        });
    }
};

//get organisation for hospital
const getOrganisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId;
        const orgId = await inventoryModel.distinct('organisation', { hospital });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId }
        });
        return res.status(200).send({
            success: true,
            message: 'Hospital Organisation data fetch successfully',
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Hospital Organisation Record',
            error,
        });
    }
};

//get inventory for hospital
const getInventoryForHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find(req.body.filters).populate('hospital').populate('donar').populate('organisation').sort({ createdAt: -1 });
        //.populate('hospital') add this after create hospital
        return res.status(200).send({
            success: true,
            message: 'Get Hospital Consumer Records Successfully',
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Get Consumer Inventory',
            error,
        });
    }
};

//get blood record of 3
const getRecentInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel.find({
            organisation: req.body.userId
        }).limit(3).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "Recent Inventory Fetch Successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Get recent Inventory',
            error,
        });
    }
};


module.exports = { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrganisationController, getOrganisationForHospitalController, getInventoryForHospitalController, getRecentInventoryController };