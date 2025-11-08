const { Router } = require('express');
const {
	seed,
	createProduct,
	getAllProducts,
	getByCategory,
	getVariantProjection,
	searchByVariant
} = require('../controllers/product.controller');

const router = Router();

router.post('/seed', seed);
router.post('/products', createProduct);
router.get('/products', getAllProducts);
router.get('/products/category/:category', getByCategory);
router.get('/products/variants/projection', getVariantProjection);
router.get('/products/variants/search', searchByVariant);

module.exports = router; 