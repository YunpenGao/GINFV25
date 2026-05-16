import productService from '../services/productService.js';

export default async function addProductController(req, res) {
    const { title, description, lines } = req.body;
    const newProduct = await productService.createProduct(title, description, lines);
    res.status(201).json(newProduct); // 201 Created 
}

