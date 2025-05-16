const Product = require('../schema/product.schema');
const Category = require('../schema/category.schema');
const Seller = require('../schema/seller.schema');


module.exports = () => {
    let router = {};

    // Get all products with filters
    router.getProducts = async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                category,
                minPrice,
                maxPrice,
                sortBy,
                search
            } = req.query;

            // Build query
            const query = {};

            if (category) {
                const categoryDoc = await Category.findOne({ name: category });
                if (categoryDoc) {
                    query.category = categoryDoc._id;
                }
            }

            if (minPrice || maxPrice) {
                query.price = {};
                if (minPrice) query.price.$gte = Number(minPrice);
                if (maxPrice) query.price.$lte = Number(maxPrice);
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $regex: search, $options: 'i' } }
                ];
            }

            // Build sort
            let sort = {};
            if (sortBy) {
                const sortFields = sortBy.split(',');
                sortFields.forEach(field => {
                    const [key, order] = field.split(':');
                    sort[key] = order === 'desc' ? -1 : 1;
                });
            } else {
                sort = { createdAt: -1 }; // Default sort by newest
            }

            // Execute query with pagination
            const products = await Product.find(query)
                .populate('category', 'name')
                .populate('seller', 'name rating')
                .sort(sort)
                .limit(Number(limit))
                .skip((Number(page) - 1) * Number(limit));

            const total = await Product.countDocuments(query);

            res.json({
                success: true,
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
                data: products
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    };

    // Get single product by ID
    router.getProductById = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id)
                .populate('category', 'name')
                .populate('seller', 'name rating email contactNumber')
                .populate('reviews');

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            res.json({ success: true, data: product });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    };

    // Get products by category
    router.getProductsByCategory = async (req, res) => {
        try {
            const category = await Category.findOne({ name: req.params.category });
            if (!category) {
                return res.status(404).json({ success: false, message: 'Category not found' });
            }

            // Find all subcategories if they exist
            const subcategories = await Category.find({ parentCategory: category._id });
            const categoryIds = [category._id, ...subcategories.map(sub => sub._id)];

            const products = await Product.find({ category: { $in: categoryIds } })
                .populate('category', 'name')
                .limit(10);

            res.json({ success: true, data: products });
        } catch (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    };
    return router;
}