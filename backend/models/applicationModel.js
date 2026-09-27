const db = require("../config/db");
// Check if job exists
const findJobById = (jobId, callback) => {
    const sql = `
        SELECT id
        FROM jobs
        WHERE id = ?
    `;
    db.query(sql, [jobId], callback);
};
// Check if student already applied
const findApplication = (
    jobId,
    studentId,
    callback
) => {
    const sql = `
        SELECT id
        FROM applications
        WHERE job_id = ?
        AND student_id = ?
    `;
    db.query(
        sql,
        [jobId, studentId],
        callback
    );
};
// Create application
const createApplication = (
    jobId,
    studentId,
    callback
) => {
    const sql = `
        INSERT INTO applications
        (job_id, student_id)
        VALUES (?, ?)
    `;
    db.query(
        sql,
        [jobId, studentId],
        callback
    );
};
const getMyApplications = (studentId, callback) => {

    const sql = `
        SELECT
            applications.id AS application_id,
            applications.status,
            applications.applied_at,

            jobs.id AS job_id,
            jobs.title,
            jobs.company,
            jobs.location,
            jobs.salary

        FROM applications

        JOIN jobs
            ON applications.job_id = jobs.id

        WHERE applications.student_id = ?

        ORDER BY applications.applied_at DESC
    `;

    db.query(
        sql,
        [studentId],
        callback
    );
};
const getJobApplicants = (jobId, recruiterId, callback) => {

    const sql = `
        SELECT
            applications.id AS application_id,
            applications.status,
            applications.applied_at,

            users.id AS student_id,
            users.name AS student_name,
            users.email AS student_email,

            jobs.id AS job_id,
            jobs.title AS job_title

        FROM applications

        JOIN users
            ON applications.student_id = users.id

        JOIN jobs
            ON applications.job_id = jobs.id

        WHERE applications.job_id = ?
        AND jobs.recruiter_id = ?

        ORDER BY applications.applied_at DESC
    `;

    db.query(
        sql,
        [jobId, recruiterId],
        callback
    );
};
const updateApplicationStatus = (
    applicationId,
    recruiterId,
    status,
    callback
) => {

    const sql = `
        UPDATE applications
        JOIN jobs
            ON applications.job_id = jobs.id
        SET applications.status = ?
        WHERE applications.id = ?
        AND jobs.recruiter_id = ?
    `;

    db.query(
        sql,
        [status, applicationId, recruiterId],
        callback
    );
};
module.exports = {
    findJobById,
    findApplication,
    createApplication,
    getMyApplications,
    getJobApplicants,
    updateApplicationStatus
};