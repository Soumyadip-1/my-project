const ProductModel = require('../models/product.model');

function buildSampleProducts(){
	return [
		{ name: 'Classic T-Shirt', price: 19.99, category: 'Apparel', variants: [
			{ color: 'Red', size: 'S', stock: 15 },
			{ color: 'Red', size: 'M', stock: 8 },
			{ color: 'Blue', size: 'L', stock: 20 }
		] },
		{ name: 'Running Shoes', price: 59.5, category: 'Footwear', variants: [
			{ color: 'Black', size: '8', stock: 10 },
			{ color: 'Black', size: '9', stock: 6 },
			{ color: 'White', size: '8', stock: 12 }
		] },
		{ name: 'Wireless Mouse', price: 24.0, category: 'Electronics', variants: [
			{ color: 'Black', size: 'Standard', stock: 30 },
			{ color: 'Grey', size: 'Compact', stock: 18 }
		] }
	];
}

async function seedIfEmpty(){
	const count = await ProductModel.countDocuments();
	if(count === 0){
		await ProductModel.insertMany(buildSampleProducts());
		return { seeded: true };
	}
	return { seeded: false };
}

async function seed(req, res){
	try {
		await ProductModel.deleteMany({});
		const inserted = await ProductModel.insertMany(buildSampleProducts());
		res.status(201).json({ insertedCount: inserted.length, products: inserted });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function createProduct(req, res){
	try {
		const product = new ProductModel(req.body);
		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

async function getAllProducts(req, res){
	try {
		const products = await ProductModel.find();
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function getByCategory(req, res){
	try {
		const { category } = req.params;
		const products = await ProductModel.find({ category });
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function getVariantProjection(req, res){
	try {
		const products = await ProductModel.find({}, { name: 1, category: 1, 'variants.color': 1, 'variants.stock': 1 });
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

async function searchByVariant(req, res){
	try {
		const { color, size } = req.query;
		const query = {};
		if (color || size) {
			query.variants = { $elemMatch: { ...(color ? { color } : {}), ...(size ? { size } : {}) } };
		}
		const products = await ProductModel.find(query);
		res.json(products);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

module.exports = {
	seed,
	createProduct,
	getAllProducts,
	getByCategory,
	getVariantProjection,
	searchByVariant,
	seedIfEmpty
};