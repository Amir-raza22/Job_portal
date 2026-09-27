const {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobsByRecruiter
} = require("../models/jobModel");
// CREATE JOB
const createJobController = (req, res) => {

    const {
        title,
        description,
        company,
        location,
        salary
    } = req.body;

    if (
        !title ||
        !description ||
        !company ||
        !location
    ) {
        return res.status(400).json({
            message: "Title, description, company and location are required"
        });
    }
    const recruiterId = req.user.id;
    createJob(
        title,
        description,
        company,
        location,
        salary || null,
        recruiterId,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    message: "Failed to create job",
                    error: err.message
                });
            }
            return res.status(201).json({
                message: "Job created successfully",
                jobId: result.insertId
            });
        }
    );
};
// GET ALL JOBS
const getJobsController = (req, res) => {

    const search = req.query.search || "";

    const location = req.query.location || "";

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const sort = req.query.sort || "newest";


    // Prevent invalid page
    if (page < 1) {
        return res.status(400).json({
            message: "Page must be greater than 0"
        });
    }


    // Maximum 50 jobs per request
    const safeLimit = Math.min(
        Math.max(limit, 1),
        50
    );

    const offset = (page - 1) * safeLimit;


    getJobs(
        search,
        location,
        safeLimit,
        offset,
        sort,
        (err, jobs, total) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to fetch jobs",
                    error: err.message
                });
            }


            const totalPages = Math.ceil(
                total / safeLimit
            );


            return res.status(200).json({

                page,

                limit: safeLimit,

                totalJobs: total,

                totalPages,

                sort,

                jobs
            });
        }
    );
};
const getJobByIdController = (req, res) => {

    const jobId = req.params.id;

    getJobById(jobId, (err, job) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch job",
                error: err.message
            });
        }

        if (job.length === 0) {
            return res.status(404).json({
                message: "Job not found"
            });
        }

        return res.status(200).json({
            job: job[0]
        });
    });
};
const updateJobController = (req, res) => {

    const jobId = req.params.id;

    const {
        title,
        description,
        company,
        location,
        salary
    } = req.body;

    // Validate required fields
    if (
        !title ||
        !description ||
        !company ||
        !location
    ) {
        return res.status(400).json({
            message: "Title, description, company and location are required"
        });
    }

    // Get logged-in recruiter ID from JWT
    const recruiterId = req.user.id;

    updateJob(
        jobId,
        title,
        description,
        company,
        location,
        salary || null,
        recruiterId,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to update job",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Job not found or you don't own this job"
                });
            }

            return res.status(200).json({
                message: "Job updated successfully"
            });
        }
    );
};
const deleteJobController = (req, res) => {

    const jobId = req.params.id;

    // Logged-in recruiter
    const recruiterId = req.user.id;

    deleteJob(
        jobId,
        recruiterId,
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to delete job",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Job not found or you don't own this job"
                });
            }

            return res.status(200).json({
                message: "Job deleted successfully"
            });
        }
    );
};
const getMyJobsController = (req, res) => {

    const recruiterId = req.user.id;

    getJobsByRecruiter(
        recruiterId,
        (err, jobs) => {

            if (err) {

                return res.status(500).json({
                    message: "Failed to fetch your jobs",
                    error: err.message
                });
            }

            return res.status(200).json({
                totalJobs: jobs.length,
                jobs
            });
        }
    );
};
module.exports = {
    createJobController,
    getJobsController,
    getJobByIdController,
    updateJobController,
    deleteJobController,
    getMyJobsController
};