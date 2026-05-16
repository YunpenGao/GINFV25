import productService from '../services/productService.js';

export default async function getProductsController(req, res) {
    try {
        const list = await productService.getProducts();
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: "无法获取产品列表" });
    }
}