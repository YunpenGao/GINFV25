
export default function validateProduct(req, res, next) {
    const { title } = req.body;
    
    // empty name 400 Bad Request
    if (!title || title.trim() === "") {
        return res.status(400).json({ 
            error: "Bad Request", 
            message: "Product title is required)" 
        });
    }
    
   
    next();
}