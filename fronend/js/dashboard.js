const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


if (!token) {
    window.location.href = "login.html";
}


// Fetch applications

async function fetchApplications() {

    try {

        const response = await fetch(
            `${API_URL}/applications/my`,
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

            document.getElementById(
                "applicationsList"
            ).innerHTML = `<p>${data.message}</p>`;

            return;
        }


        displayApplications(data.applications);


    } catch (error) {

        console.error(error);

        document.getElementById(
            "applicationsList"
        ).innerHTML =
            "<p>Unable to load applications.</p>";
    }
}


// Display applications

function displayApplications(applications) {

    const container =
        document.getElementById("applicationsList");


    if (applications.length === 0) {

        container.innerHTML = `
            <p>
                You haven't applied for any jobs yet.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    applications.forEach((application) => {

        const card =
            document.createElement("div");

        card.classList.add("application-card");


        card.innerHTML = `

            <h2>${application.title}</h2>

            <p>
                <strong>Company:</strong>
                ${application.company}
            </p>

            <p>
                <strong>Location:</strong>
                ${application.location}
            </p>

            <p>
                <strong>Salary:</strong>
                ₹${application.salary || "Not specified"}
            </p>

            <p>
                <strong>Status:</strong>
                ${application.status}
            </p>

            <p>
                <strong>Applied At:</strong>
                ${new Date(
                    application.applied_at
                ).toLocaleString()}
            </p>

        `;


        container.appendChild(card);

    });
}


// Browse jobs

document
    .getElementById("jobsBtn")
    .addEventListener("click", () => {

        window.location.href = "job.html";

    });


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
fetchApplications();