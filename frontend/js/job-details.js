const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


// Check authentication

if (!token) {

    window.location.href = "login.html";
}


// Get job ID from URL

const params = new URLSearchParams(
    window.location.search
);

const jobId = params.get("id");


// If job ID doesn't exist

if (!jobId) {

    document.getElementById("jobDetails").innerHTML =
        "<p>Invalid job.</p>";

} else {

    fetchJob();
}


// Fetch job

async function fetchJob() {

    try {

        const response = await fetch(
            `${API_URL}/jobs/${jobId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "login.html";

            return;
        }


        const data = await response.json();


        if (!response.ok) {

            document.getElementById("jobDetails").innerHTML =
                `<p>${data.message}</p>`;

            return;
        }


        displayJob(data.job);

    } catch (error) {

        console.error(error);

        document.getElementById("jobDetails").innerHTML =
            "<p>Unable to load job.</p>";
    }
}


// Display job

function displayJob(job) {

    document.getElementById("jobDetails").innerHTML = `

        <h1>${job.title}</h1>

        <h2>${job.company}</h2>

        <p>
            <strong>Location:</strong>
            ${job.location}
        </p>

        <p>
            <strong>Salary:</strong>
            ₹${job.salary || "Not specified"}
        </p>

        <p>
            <strong>Recruiter:</strong>
            ${job.recruiter_name}
        </p>

        <hr>

        <h3>Job Description</h3>

        <p>
            ${job.description}
        </p>

        <button id="applyBtn">
            Apply for Job
        </button>
    `;


    document
        .getElementById("applyBtn")
        .addEventListener(
            "click",
            applyForJob
        );
}


// Apply

async function applyForJob() {

    const message =
        document.getElementById("message");


    try {

        const response = await fetch(
            `${API_URL}/jobs/${jobId}/apply`,
            {
                method: "POST",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            message.textContent =
                data.message;

            return;
        }


        message.textContent =
            "Application submitted successfully!";


        document.getElementById("applyBtn").disabled = true;


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to apply for job.";
    }
}


// Back button

document
    .getElementById("backBtn")
    .addEventListener("click", () => {

        window.location.href = "jobs.html";

    });
document
    .getElementById("homeBtn")
    .addEventListener("click", () => {

        window.location.href = "index.html";

    });