const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
	color: { type: String, required: true },
	size: { type: String, required: true },
	stock: { type: Number, required: true, min: 0 }
},{ _id: false });

const productSchema = new mongoose.Schema({
	name: { type: String, required: true, trim: true },
	price: { type: Number, required: true, min: 0 },
	category: { type: String, required: true, index: true },
	variants: { type: [variantSchema], default: [] }
},{ timestamps: true });

const ProductModel = mongoose.model('product', productSchema);

module.exports = ProductModel;