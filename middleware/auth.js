import jwt from "jsonwebtoken"
import User from "../models/user.js";
export const authenticate= (req, res, next) => {
    const token=req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Access Denied no token found" });
    } 
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }

}

