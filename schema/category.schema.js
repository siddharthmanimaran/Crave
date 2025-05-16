// schema/category.schema.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: String,
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    imageUrl: String,
    isActive: { type: Boolean, default: true }
});

// Important: Export the model properly
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;