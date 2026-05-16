// server.js
import http from 'http';
import express from 'express';
import cors from 'cors';
import productsRouter from './routes/productsRoutes.js';
import productRepo from './repositories/productRepository.js';

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());


app.use(express.static('../frontend/public'));


app.use('/api/products', productsRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", message: "server error" });
});


console.log("initializing...");
await productRepo.loadProducts();

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 MES system started!`);
    console.log(`📡 Listening on local port: http://localhost:${PORT}`);
    console.log(`====================================================`);
});