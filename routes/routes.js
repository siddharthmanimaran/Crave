


// const Schema = {
//     Product: require('../schema/product.schema'),
//     Category: require('../schema/category.schema'),
//     Seller: require('../schema/seller.schema'),
// }

module.exports = (app) => {
    try {
        const controller = require('../controller/index')(app);

        app.get('/api/products', controller.getProducts);
        app.get('/api/products/:id', controller.getProductById);
        app.get('/api/products/category/:category', controller.getProductsByCategory);
    } catch (error) {
    console.log("🚀 ~ error:", error)

    }
}