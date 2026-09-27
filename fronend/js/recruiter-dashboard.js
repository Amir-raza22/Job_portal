const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


if (!token) {
    window.location.href = "login.html";
}


// Create Job

document
    .getElementById("jobForm")
    .addEventListener("submit", async (event) => {

        event.preventDefault();


        const title =
            document.getElementById("title").value;

        const company =
            document.getElementById("company").value;

        const location =
            document.getElementById("location").value;

        const salary =
            document.getElementById("salary").value;

        const description =
            document.getElementById("description").value;


        try {

            const response = await fetch(
                `${API_URL}/jobs`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title,
                        company,
                        location,
                        salary,
                        description
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                document.getElementById(
                    "message"
                ).textContent = data.message;

                return;
            }


            document.getElementById(
                "message"
            ).textContent =
                "Job created successfully!";


            document
                .getElementById("jobForm")
                .reset();


            fetchMyJobs();


        } catch (error) {

            console.error(error);

            document.getElementById(
                "message"
            ).textContent =
                "Unable to create job.";

        }

    });


// Fetch jobs

async function fetchMyJobs() {

    try {

        const response = await fetch(
            `${API_URL}/recruiter/jobs`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );


        const data = await response.json();


        if (!response.ok) {

            document.getElementById(
                "jobsList"
            ).innerHTML =
                `<p>${data.message}</p>`;

            return;
        }


        displayJobs(data.jobs);


    } catch (error) {

        console.error(error);

        document.getElementById(
            "jobsList"
        ).innerHTML =
            "<p>Unable to load jobs.</p>";
    }
}


// Display jobs

function displayJobs(jobs) {

    const container =
        document.getElementById("jobsList");


    if (jobs.length === 0) {

        container.innerHTML =
            "<p>No jobs found.</p>";

        return;
    }


    container.innerHTML = "";


    jobs.forEach((job) => {

        const card =
            document.createElement("div");

        card.classList.add("job-card");


        card.innerHTML = `

            <h2>${job.title}</h2>

            <p>
                <strong>Company:</strong>
                ${job.company}
            </p>

            <p>
                <strong>Location:</strong>
                ${job.location}
            </p>

            <p>
                <strong>Salary:</strong>
                ₹${job.salary || "Not specified"}
            </p>

            <p>
                ${job.description}
            </p>

            <button
                onclick="editJob(${job.id})"
            >
                Edit
            </button>

            <button
                onclick="deleteJob(${job.id})"
            >
                Delete
            </button>

            <button
                onclick="viewApplicants(${job.id})"
            >
                View Applicants
            </button>

        `;


        container.appendChild(card);

    });
}
async function editJob(jobId) {

    const title =
        prompt("Enter new job title:");

    if (!title) return;


    const company =
        prompt("Enter company name:");

    if (!company) return;


    const location =
        prompt("Enter location:");

    if (!location) return;


    const salary =
        prompt("Enter salary:");


    const description =
        prompt("Enter job description:");

    if (!description) return;


    try {

        const response = await fetch(
            `${API_URL}/jobs/${jobId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    title,
                    company,
                    location,
                    salary,
                    description
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        alert("Job updated successfully.");


        fetchMyJobs();


    } catch (error) {

        console.error(error);

        alert("Unable to update job.");
    }
}

async function deleteJob(jobId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this job?"
        );


    if (!confirmed) return;


    try {

        const response = await fetch(
            `${API_URL}/jobs/${jobId}`,
            {
                method: "DELETE",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        alert("Job deleted successfully.");


        fetchMyJobs();


    } catch (error) {

        console.error(error);

        alert("Unable to delete job.");
    }
}
// Applicants

function viewApplicants(jobId) {

    window.location.href =
        `applicants.html?jobId=${jobId}`;

}


// Logout

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.href = "login.html";

    });
document
    .getElementById("homeBtn")
    .addEventListener("click", () => {

        window.location.href = "index.html";

    });
document
    .getElementById("homeBtn")
    .addEventListener("click", () => {

        window.location.href = "index.html";

    });
fetchMyJobs();