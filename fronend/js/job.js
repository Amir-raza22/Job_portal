const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


// Check login
let currentPage = 1;

const limit = 6;
if (!token) {

    window.location.href = "login.html";
}


// Fetch jobs

const fetchJobs = async () => {

    const search =
        document.getElementById("searchInput").value;

    const location =
        document.getElementById("locationInput").value;

    const sort =
        document.getElementById("sortSelect").value;


    try {

        const url =
            `${API_URL}/jobs` +
            `?search=${encodeURIComponent(search)}` +
            `&location=${encodeURIComponent(location)}` +
            `&page=${currentPage}` +
            `&limit=${limit}` +
            `&sort=${sort}`;


        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });


        if (response.status === 401) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;
        }


        const data = await response.json();


        if (!response.ok) {

            document.getElementById(
                "jobsList"
            ).innerHTML =
                `<p>${data.message}</p>`;

            return;
        }


        displayJobs(data.jobs);

        displayPagination(
            data.totalPages
        );


    } catch (error) {

        console.error(error);

        document.getElementById(
            "jobsList"
        ).innerHTML =
            "<p>Unable to load jobs.</p>";
    }
};

function displayPagination(totalPages) {

    const pagination =
        document.getElementById("pagination");


    pagination.innerHTML = "";


    if (totalPages <= 1) {
        return;
    }


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement("button");


        button.textContent = page;


        if (page === currentPage) {
            button.disabled = true;
        }


        button.addEventListener(
            "click",
            () => {

                currentPage = page;

                fetchJobs();

            }
        );


        pagination.appendChild(button);
    }
}
// Display jobs

const displayJobs = (jobs) => {

    const jobsList =
        document.getElementById("jobsList");


    if (jobs.length === 0) {

        jobsList.innerHTML =
            "<p>No jobs found.</p>";

        return;
    }


    jobsList.innerHTML = "";


    jobs.forEach((job) => {

        const jobCard =
            document.createElement("div");

        jobCard.classList.add("job-card");


        jobCard.innerHTML = `
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

            <p>
                <strong>Recruiter:</strong>
                ${job.recruiter_name}
            </p>

            <button onclick="viewJob(${job.id})">
                View Job
            </button>
        `;


        jobsList.appendChild(jobCard);
    });
};


// View individual job

const viewJob = (jobId) => {

    window.location.href =
        `job-details.html?id=${jobId}`;
};


// Logout

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.href = "login.html";

    });

document
    .getElementById("searchBtn")
    .addEventListener("click", () => {

        currentPage = 1;

        fetchJobs();

    });


document
    .getElementById("sortSelect")
    .addEventListener("change", () => {

        currentPage = 1;

        fetchJobs();

    });
// Start
document
    .getElementById("dashboardBtn")
    .addEventListener("click", async () => {

        try {

            const response = await fetch(
                `${API_URL}/profile`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data =
                await response.json();


            if (
                response.ok &&
                data.user.role === "recruiter"
            ) {

                window.location.href =
                    "recruiter-dashboard.html";

            } else {

                window.location.href =
                    "dashboard.html";

            }

        } catch (error) {

            console.error(error);

        }

    });
document
    .getElementById("homeBtn")
    .addEventListener("click", () => {

        window.location.href = "index.html";

    });
fetchJobs();