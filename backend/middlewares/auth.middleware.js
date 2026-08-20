const jwt = require("jsonwebtoken");
const User = require("../models/user");
const user = require("../models/user");

const userAuth = async (req, res, next) => {
    let token;

    const authHeader = req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        try{
            token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            if (!req.user) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            return next();
        } catch(err){
            res.status(401).send("ERROR: "+ err.message);
        }

        if(!token){
            res.status(401).send("Please Login!");
        }
        else {
            return res.status(401).json({ message: "No token provided" });
        }
    }
}

module.exports = userAuth;