import productService from '../services/productService.js';

export default async function updateProductController(req, res) {
    try {
        const { id } = req.params;
       
        const { stations, inspection, title, description, productCode } = req.body;
        
       
        const updatedFields = {};
        if (stations) updatedFields.stations = stations;
        if (inspection) updatedFields.inspection = inspection;
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (productCode) updatedFields.productCode = productCode;

        const updated = await productService.updateProductStatus(id, updatedFields);
        
        if (!updated) {
            return res.status(404).json({ error: "Not Found", message: "could not find product" });
        }
        
        res.json({
            message: "📢 successful in real time!",
            updatedProduct: updated
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: "could not update product" });
    }
}