// server.js
import http from 'http';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';


import productsRouter from './routes/productsRoutes.js';
import productRepo from './repositories/productRepository.js';

const app = express();
const PORT = 5000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let clients = [];

export const broadcastRefresh=()=>{
    clients.forEach(client => {
        if (client.readyState === 1) {
            client.send('REFRESH_DASHBOARD');
        }
    });
};

app.set('broadcast', broadcastRefresh); // Store the broadcast function in app locals for access in controllers



wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.push(ws);
    console.log(`Total clients: ${clients.length}`);

    ws.on('close', () => {
        clients = clients.filter(client => client !== ws);
        console.log('Client disconnected');
        console.log(`Total clients: ${clients.length}`);
    });
});





app.use(cors());
app.use(express.json());


app.use(express.static('../frontend'));


app.use('/api/products', productsRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", message: "server error" });
});


console.log("initializing...");
await productRepo.loadProducts();

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 MES system started!`);
    console.log(`📡 Listening on local port: http://localhost:${PORT}`);
    console.log(`====================================================`);
});