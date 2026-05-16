import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('./data/products.json');
let products = [];


async function loadProducts() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        products = JSON.parse(data);
    } catch (error) {
        products = []; 
    }
}

//save the data to the file
async function saveProducts() {
    await fs.writeFile(filePath, JSON.stringify(products, null, 2), 'utf-8');
}

async function getAll() {
    return products;
}

async function add(product) {
    products.push(product);
    await saveProducts();
    return product;
}

async function update(id, updatedFields) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;
    
    // Merge the existing product with the updated fields
    products[index] = { ...products[index], ...updatedFields };
    await saveProducts();
    return products[index];
}

async function remove(id) {
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;
    
    const removed = products.splice(index, 1)[0];
    await saveProducts();
    return removed;
}

export default { 
    loadProducts, 
    getAll, 
    add, 
    update, 
    remove 
};