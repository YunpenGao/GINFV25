import productRepo from '../repositories/productRepository.js';

// 1. get all products
async function getProducts() {
    return await productRepo.getAll();
}

// 2. 
async function createProduct(title, description, productCode) {
    const newProduct = {
        id: Date.now(),
        productCode: productCode || `SN-${Date.now()}`,
        title,
        description,
       
        stations: {
            machiningStation: "Pending", 
            assemblyStation: "Pending",  
            sortingStation: "Pending"    
        },
        // detection results from camera
        inspection: {
            visualInspected: false,
            measuredValue: 0.00,
            isQualified: false,
            defectType: "None" // None, Scratch, Deformation, SizeError
        },
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    return await productRepo.add(newProduct);
}

// 3.
async function updateProductStatus(id, updatedFields) {
    //
    return await productRepo.update(id, updatedFields);
}

// 4. delete a product 
async function deleteProduct(id) {
    return await productRepo.remove(id);
}

export default { 
    getProducts, 
    createProduct, 
    updateProductStatus, 
    deleteProduct 
};