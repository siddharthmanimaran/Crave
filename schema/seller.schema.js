const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rating: Number,
    address: String,
    contactNumber: String,
    isVerified: { type: Boolean, default: false }
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;