const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    discountedPrice: Number,
    currency: { type: String, default: "INR" },
    stockQuantity: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
    brand: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory' },
    images: [String],
    specifications: mongoose.Schema.Types.Mixed, // Key-value pairs
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    tags: [String],
    shippingInfo: {
        weight: Number,
        dimensions: {
            length: Number,
            width: Number,
            height: Number
        },
        isFreeShipping: Boolean
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;