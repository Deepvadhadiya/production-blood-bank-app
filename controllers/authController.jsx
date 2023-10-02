const userModel = require('../models/userModel.jsx');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register controller
const registerController = async (req, res) => {
    try {
        const exisitingUser = await userModel.findOne({ email: req.body.email })
        if (exisitingUser) {
            return res.status(200).send({
                success: false,
                message: 'User Already Exists',
            });
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        //rest data
        const user = new userModel(req.body);
        await user.save();
        return res.status(201).send({
            success: true,
            message: 'User Register Successfully!',
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Register Api',
            error,
        });
    }
};

//login controller
const loginController = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Invalid Credentials',
            });
        }

        //check role
        if (user.role !== req.body.role) {
            return res.status(500).send({
                success: false,
                message: 'Role Does not Match',
            });
        };

        //compare password
        const comparePassword = await bcrypt.compare(req.body.password, user.password);
        if (!comparePassword) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Credentials'
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).send({
            success: true,
            message: 'Login Successfully!',
            token,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login Api',
            error,
        });
    }
}

//current-user controller
const currentUserController = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId });
        return res.status(200).send({
            success: true,
            message: 'User Fetched Successfully!',
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Unable to get current user',
            error,
        });
    }
}

module.exports = { registerController, loginController, currentUserController };