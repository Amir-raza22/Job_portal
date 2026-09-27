const express = require("express");
const router = express.Router();
const authMiddleware  = require("../middleware/jwtToken");
const roleMiddleware = require("../middleware/roleToken");

const { registerUser,loginUser } = require("../controllers/userControllers");

router.route("/register")
    .post(registerUser)

router.route("/login")
    .post(loginUser);

router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        message: "You can access this protected route",
        user: req.user
    });
});

// Student only
router.get(
    "/student-dashboard",
    authMiddleware,
    roleMiddleware("student"),
    (req, res) => {

        res.json({
            message: "Welcome to Student Dashboard",
            user: req.user
        });

    }
);

// Recruiter only
router.get(
    "/recruiter-dashboard",
    authMiddleware,
    roleMiddleware("recruiter"),
    (req, res) => {

        res.json({
            message: "Welcome to Recruiter Dashboard",
            user: req.user
        });

    }
);
module.exports = router;