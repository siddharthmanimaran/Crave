require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();




// Security middleware
app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});
// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));


// Routes
require('./routes/routes')(app);

// app.use('/api/users', userRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});













// const { faker } = require('@faker-js/faker');
// const mongoose = require('mongoose');

// // Connect to MongoDB (remove useNewUrlParser)
// mongoose.connect('mongodb://localhost:27017/crave')
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('Connection error:', err));

// // Import models after connection is established
// const Product = require('./schema/product.schema');
// const Category = require('./schema/category.schema');
// const Seller = require('./schema/seller.schema');

// // Sample data
// const categories = [
//     "Electronics", "Clothing", "Home & Kitchen",
//     "Books", "Toys & Games", "Beauty",
//     "Sports", "Automotive", "Grocery"
// ];

// const subCategories = {
//     "Electronics": ["Smartphones", "Laptops", "TVs", "Headphones", "Cameras"],
//     "Clothing": ["Men's Fashion", "Women's Fashion", "Kids' Fashion", "Footwear"],
//     "Home & Kitchen": ["Furniture", "Appliances", "Cookware", "Home Decor"]
// };

// const brands = {
//     "Electronics": ["Samsung", "Apple", "Sony", "LG", "OnePlus"],
//     "Clothing": ["Nike", "Adidas", "Puma", "Levi's", "Zara"],
//     "Home & Kitchen": ["Prestige", "Bajaj", "Milton", "Hilton"]
// };

// async function generateData() {
//     // First create categories and subcategories
//     const createdCategories = {};
//     for (const cat of categories) {
//         // Check if category exists first
//         let category = await Category.findOne({ name: cat });
//         if (!category) {
//             category = await Category.create({ name: cat });
//         }
//         createdCategories[cat] = category._id;
//         // Handle subcategories
//         if (subCategories[cat]) {
//             for (const subCat of subCategories[cat]) {
//                 // Check if subcategory exists
//                 const existingSubCat = await Category.findOne({
//                     name: subCat,
//                     parentCategory: category._id
//                 });
//                 if (!existingSubCat) {
//                     await Category.create({
//                         name: subCat,
//                         parentCategory: category._id
//                     });
//                 }
//             }
//         }
//     }

//     // Create some sellers
//     const sellers = [];
//     for (let i = 0; i < 50; i++) {
//         sellers.push(await Seller.create({
//             name: faker.company.name(),
//             email: faker.internet.email(),
//             rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
//             address: faker.location.streetAddress(),
//             contactNumber: faker.phone.number()
//         }));
//     }

//     // Generate 1 million products
//     const batchSize = 5000;
//     const totalProducts = 1000000;

//     for (let i = 0; i < totalProducts; i += batchSize) {
//         const products = [];

//         for (let j = 0; j < batchSize; j++) {
//             const categoryName = faker.helpers.arrayElement(categories);
//             const categorySubset = subCategories[categoryName] || [];
//             const brandSubset = brands[categoryName] || ["Generic"];

//             products.push({
//                 productId: `PID${faker.string.alphanumeric(10).toUpperCase()}`,
//                 name: `${faker.helpers.arrayElement(brandSubset)} ${faker.commerce.productName()}`,
//                 description: faker.commerce.productDescription(),
//                 price: faker.number.float({ min: 100, max: 50000, precision: 0.01 }),
//                 discountedPrice: faker.number.float({ min: 50, max: 45000, precision: 0.01 }),
//                 stockQuantity: faker.number.int({ min: 0, max: 1000 }),
//                 seller: faker.helpers.arrayElement(sellers)._id,
//                 brand: faker.helpers.arrayElement(brandSubset),
//                 category: createdCategories[categoryName],
//                 subCategory: categorySubset.length > 0 ?
//                     await Category.findOne({ name: faker.helpers.arrayElement(categorySubset) }) : null,
//                 images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
//                     faker.image.urlLoremFlickr({ category: 'product' })),
//                 specifications: generateSpecifications(categoryName),
//                 ratings: {
//                     average: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
//                     count: faker.number.int({ min: 0, max: 10000 })
//                 },
//                 tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
//                     faker.commerce.productAdjective()),
//                 shippingInfo: {
//                     weight: faker.number.float({ min: 0.1, max: 20, precision: 0.1 }),
//                     dimensions: {
//                         length: faker.number.float({ min: 5, max: 100, precision: 0.1 }),
//                         width: faker.number.float({ min: 5, max: 100, precision: 0.1 }),
//                         height: faker.number.float({ min: 5, max: 100, precision: 0.1 })
//                     },
//                     isFreeShipping: faker.datatype.boolean()
//                 }
//             });
//         }

//         await Product.insertMany(products);
//         console.log(`Inserted ${i + batchSize} products`);
//     }

//     console.log('Data generation complete');
// }

// function generateSpecifications(category) {
//     const specs = {};

//     switch (category) {
//         case "Electronics":
//             specs["Screen Size"] = `${faker.number.float({ min: 4, max: 85, precision: 0.1 })} inches`;
//             specs["Processor"] = faker.helpers.arrayElement(["Snapdragon", "Exynos", "A-series", "MediaTek"]);
//             specs["RAM"] = `${faker.helpers.arrayElement([2, 4, 6, 8, 12, 16])} GB`;
//             break;
//         case "Clothing":
//             specs["Material"] = faker.helpers.arrayElement(["Cotton", "Polyester", "Wool", "Silk"]);
//             specs["Size"] = faker.helpers.arrayElement(["S", "M", "L", "XL", "XXL"]);
//             break;
//         case "Home & Kitchen":
//             specs["Material"] = faker.helpers.arrayElement(["Stainless Steel", "Plastic", "Wood", "Ceramic"]);
//             specs["Warranty"] = `${faker.number.int({ min: 1, max: 5 })} years`;
//             break;
//         default:
//             specs["Feature"] = faker.commerce.productAdjective();
//     }

//     return specs;
// }

// generateData().catch(console.error);