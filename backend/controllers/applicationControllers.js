const {
    findJobById,
    findApplication,
    createApplication,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
} = require("../models/applicationModel");


const applyForJob = (req, res) => {

    const jobId = req.params.id;

    // Get student ID from JWT
    const studentId = req.user.id;


    // 1. Check if job exists

    findJobById(jobId, (err, jobs) => {

        if (err) {
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }


        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }


        // 2. Check duplicate application

        findApplication(
            jobId,
            studentId,
            (err, applications) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });
                }


                if (applications.length > 0) {
                    return res.status(409).json({
                        message: "You have already applied for this job"
                    });
                }


                // 3. Create application

                createApplication(
                    jobId,
                    studentId,
                    (err, result) => {

                        if (err) {

                            return res.status(500).json({
                                message: "Failed to apply for job",
                                error: err.message
                            });

                        }


                        return res.status(201).json({
                            message: "Application submitted successfully",
                            applicationId: result.insertId
                        });

                    }
                );
            }
        );
    });
};
const getMyApplicationsController = (req, res) => {

    const studentId = req.user.id;

    getMyApplications(studentId, (err, applications) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch applications",
                error: err.message
            });
        }

        return res.status(200).json({
            count: applications.length,
            applications
        });
    });
};
const getJobApplicantsController = (req, res) => {

    const jobId = req.params.id;

    // Logged-in recruiter
    const recruiterId = req.user.id;

    getJobApplicants(
        jobId,
        recruiterId,
        (err, applicants) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to fetch applicants",
                    error: err.message
                });
            }

            return res.status(200).json({
                count: applicants.length,
                applicants
            });
        }
    );
};
const updateApplicationStatusController = (req, res) => {

    const applicationId = req.params.id;

    const { status } = req.body;

    const recruiterId = req.user.id;


    // Validate status

    const allowedStatuses = [
        "applied",
        "shortlisted",
        "interview",
        "selected",
        "rejected"
    ];

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            message: "Invalid application status"
        });
    }


    updateApplicationStatus(
        applicationId,
        recruiterId,
        status,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to update application status",
                    error: err.message
                });
            }


            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message:
                        "Application not found or you don't have permission"
                });
            }


            return res.status(200).json({
                message: "Application status updated successfully",
                status
            });
        }
    );
};
module.exports = {
    applyForJob,
    getMyApplicationsController,
    getJobApplicantsController,
    updateApplicationStatusController
};