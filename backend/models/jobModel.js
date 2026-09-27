const db = require("../config/db");
// CREATE JOB
const createJob = (
    title,
    description,
    company,
    location,
    salary,
    recruiterId,
    callback
) => {
    const sql = `
        INSERT INTO jobs
        (title, description, company, location, salary, recruiter_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
        sql,
        [
            title,
            description,
            company,
            location,
            salary,
            recruiterId
        ],
        callback
    );
};
// GET ALL JOBS
const getJobs = (
    search,
    location,
    limit,
    offset,
    sort,
    callback
) => {

    let whereClause = `WHERE 1 = 1`;

    const params = [];

    // Search
    if (search) {

        whereClause += `
            AND (
                jobs.title LIKE ?
                OR jobs.company LIKE ?
                OR jobs.description LIKE ?
            )
        `;

        const searchValue = `%${search}%`;

        params.push(
            searchValue,
            searchValue,
            searchValue
        );
    }

    // Location
    if (location) {

        whereClause += `
            AND jobs.location LIKE ?
        `;

        params.push(`%${location}%`);
    }


    // Sorting
    let orderBy = `jobs.created_at DESC`;

    if (sort === "oldest") {
        orderBy = `jobs.created_at ASC`;
    }

    if (sort === "salary_high") {
        orderBy = `jobs.salary DESC`;
    }

    if (sort === "salary_low") {
        orderBy = `jobs.salary ASC`;
    }


    // Main query
    const jobsSql = `
        SELECT
            jobs.id,
            jobs.title,
            jobs.description,
            jobs.company,
            jobs.location,
            jobs.salary,
            jobs.recruiter_id,
            jobs.created_at,
            users.name AS recruiter_name

        FROM jobs

        JOIN users
            ON jobs.recruiter_id = users.id

        ${whereClause}

        ORDER BY ${orderBy}

        LIMIT ? OFFSET ?
    `;

    const jobParams = [
        ...params,
        limit,
        offset
    ];


    // Count query
    const countSql = `
        SELECT COUNT(*) AS total
        FROM jobs
        ${whereClause}
    `;


    db.query(countSql, params, (err, countResult) => {

        if (err) {
            return callback(err, null, null);
        }

        const total = countResult[0].total;


        db.query(
            jobsSql,
            jobParams,
            (err, jobs) => {

                if (err) {
                    return callback(err, null, null);
                }

                callback(
                    null,
                    jobs,
                    total
                );
            }
        );
    });
};

const getJobById = (jobId, callback) => {
    const sql = `
        SELECT
            jobs.id,
            jobs.title,
            jobs.description,
            jobs.company,
            jobs.location,
            jobs.salary,
            jobs.recruiter_id,
            jobs.created_at,
            users.name AS recruiter_name
        FROM jobs
        JOIN users
            ON jobs.recruiter_id = users.id
        WHERE jobs.id = ?
    `;

    db.query(sql, [jobId], callback);
};
const updateJob = (
    jobId,
    title,
    description,
    company,
    location,
    salary,
    recruiterId,
    callback
) => {

    const sql = `
        UPDATE jobs
        SET
            title = ?,
            description = ?,
            company = ?,
            location = ?,
            salary = ?
        WHERE id = ?
        AND recruiter_id = ?
    `;

    db.query(
        sql,
        [
            title,
            description,
            company,
            location,
            salary,
            jobId,
            recruiterId
        ],
        callback
    );
};
const deleteJob = (jobId, recruiterId, callback) => {

    const sql = `
        DELETE FROM jobs
        WHERE id = ?
        AND recruiter_id = ?
    `;

    db.query(
        sql,
        [jobId, recruiterId],
        callback
    );
};
const getJobsByRecruiter = (recruiterId, callback) => {

    const sql = `
        SELECT
            jobs.id,
            jobs.title,
            jobs.description,
            jobs.company,
            jobs.location,
            jobs.salary,
            jobs.recruiter_id,
            jobs.created_at
        FROM jobs
        WHERE jobs.recruiter_id = ?
        ORDER BY jobs.created_at DESC
    `;

    db.query(sql, [recruiterId], callback);
};
module.exports = {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobsByRecruiter
};