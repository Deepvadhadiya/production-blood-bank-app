const userModel = require("../models/userModel.jsx");

//get donar-list
const getDonarListController = async (req, res) => {
    try {
        const donarData = await userModel.find({ role: 'donar' }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: donarData.length,
            message: "Donar List Fetch Successfully",
            donarData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Fetch Donar List API",
            error,
        });
    }
};

//get hospital-list
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel.find({ role: 'hospital' }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: hospitalData.length,
            message: "Hospital List Fetch Successfully",
            hospitalData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Fetch Hospital List API",
            error,
        });
    }
};

//get organisation-list
const getOrganisationListController = async (req, res) => {
    try {
        const organisationData = await userModel.find({ role: 'organisation' }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: organisationData.length,
            message: "Organisation List Fetch Successfully",
            organisationData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Fetch Organisation List API",
            error,
        });
    }
};

// =========================
//delete donar
const deleteDonarController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            error,
            success: false,
            message: "error while deleting",
        });
    }
}


module.exports = { getDonarListController, getHospitalListController, getOrganisationListController, deleteDonarController };