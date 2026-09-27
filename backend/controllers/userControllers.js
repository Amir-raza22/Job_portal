const { createUser, findUserByEmail } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = (req, res) => {

    const { name, email, password,role } = req.body;
    

    // 1. Validate required fields
    if (!name || !email || !password || !role) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    // 2. Check if email already exists
    findUserByEmail(email, async (err, user) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }
        if (user) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }
        // 3. Create user
        const hashPassword = await bcrypt.hash(password,10);
        createUser(name, email, hashPassword,role, (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Registration failed",
                    error: err.message
                });
            }
            // 4. Send success response
            return res.status(201).json({
                message: "User registered successfully",
                userId: result.insertId
            });
        });
    });

};

const loginUser = (req, res) => {
    const { email, password } = req.body;
    // 1. Validate fields
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }
    // 2. Find user
    findUserByEmail(email, async (err, user) => {
        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }
        // 3. User not found
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        // 4. Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );
        // 5. Wrong password
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 6. Successful login
        const payload = {
                id: user.id,
                email: user.email,
                role : user.role
            }
        const token = jwt.sign(payload,process.env.JWT_SECRET,);
        return res.status(200).json({
            message: "Login successful",
            userId: user.id,
            token
        });
    });
};
module.exports = {
    registerUser,loginUser
}