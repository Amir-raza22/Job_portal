const express = require("express");

const router = express.Router();

const {
    createJobController,
    getJobsController,
    getJobByIdController,
    updateJobController,
    deleteJobController,
    getMyJobsController
} = require("../controllers/jobControllers");
const authMiddleware = require("../middleware/jwtToken");
const roleMiddleware = require("../middleware/roleToken");

// Recruiter only
router.post(
    "/jobs",
    authMiddleware,
    roleMiddleware("recruiter"),
    createJobController
);
// Any authenticated user
router.get(
    "/jobs",
    authMiddleware,
    getJobsController
);
router.get(
    "/jobs/:id",
    authMiddleware,
    getJobByIdController
);
router.put(
    "/jobs/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateJobController
);
router.delete(
    "/jobs/:id",
    authMiddleware,
    roleMiddleware("recruiter"),
    deleteJobController
);
router.get(
    "/recruiter/jobs",
    authMiddleware,
    roleMiddleware("recruiter"),
    getMyJobsController
);
module.exports = router;