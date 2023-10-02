const userModel = require('../models/userModel.jsx');

module.exports = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.body.userId);
        //check admin
        if (user?.role !== "admin") {
            return res.status(401).send({
                success: false,
                message: "Auth Failed",
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({
            success: false,
            message: "Auth Failed, Admin Api",
            error,
        });
    }
}