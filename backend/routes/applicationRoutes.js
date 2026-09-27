const express = require("express");

const router = express.Router();

const {
    applyForJob,
    getMyApplicationsController,
    getJobApplicantsController,
    updateApplicationStatusController
} = require("../controllers/applicationControllers");

const authMiddleware = require("../middleware/jwtToken");

const roleMiddleware = require("../middleware/roleToken");


router.post(
    "/jobs/:id/apply",
    authMiddleware,
    roleMiddleware("student"),
    applyForJob
);
router.get(
    "/applications/my",
    authMiddleware,
    roleMiddleware("student"),
    getMyApplicationsController
);
router.get(
    "/jobs/:id/applicants",
    authMiddleware,
    roleMiddleware("recruiter"),
    getJobApplicantsController
);
router.put(
    "/applications/:id/status",
    authMiddleware,
    roleMiddleware("recruiter"),
    updateApplicationStatusController
);
module.exports = router;