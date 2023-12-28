const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = async (req, res, next)=>{

    const authHeader = req.headers.authorization;

 

    if(!authHeader){
        return res.status(401).json({ message: "Authorization token missing" });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Authorization token missing" });
    }

    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            req.body.userID = decoded.userID;
            req.body.email = decoded.email;
            next();
        }else {
            res.status(401).json({ message: "Invalid token" });
        }
        
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}


module.exports = {
    authMiddleware
}