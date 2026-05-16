import { Router } from 'express';
import validateProduct from '../middleware/validateProduct.js';
import getProductsController from '../controllers/getProductsController.js';
import addProductController from '../controllers/addProductController.js';
import updateProductController from '../controllers/updateProductController.js';
import deleteProductController from '../controllers/deleteProductController.js';

const productsRouter = Router();

// GET /products 
productsRouter.get('/', getProductsController);


// POST /products
productsRouter.post('/', validateProduct, addProductController);

// PUT /products/:id
productsRouter.put('/:id', updateProductController);

// DELETE /products/:id
productsRouter.delete('/:id', deleteProductController);

export default productsRouter;
