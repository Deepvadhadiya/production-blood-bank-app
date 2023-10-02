const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    inventoryType: {
        type: String,
        required: [true, 'inventory type required'],
        enum: ['in', 'out'],
    },
    bloodGroup: {
        type: String,
        required: [true, 'blood group is required'],
        enum: ['O+', 'O-', 'AB+', 'AB-', 'A+', 'A-', 'B+', 'B-'],
    },
    quantity: {
        type: Number,
        required: [true, 'blood quantity required'],
    },
    email: {
        type: String,
        required: [true, 'Donar Email is Required'],
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'organisation is required'],
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            return this.inventoryType === "out"
        },
    },
    donar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            return this.inventoryType === "in"
        },
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);