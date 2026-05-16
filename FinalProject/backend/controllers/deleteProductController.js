import productService from '../services/productService.js';

export default async function deleteProductController(req, res) {
    const { id } = req.params;
    const removed = await productService.deleteProduct(id);

    if (!removed) {
        return res.status(404).json({ error: "Not Found", message: "could not find the product" });
    }
    res.json({ message: "Product deleted successfully", removed });
}