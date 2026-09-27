const API_URL = "http://localhost:5000";

const token = localStorage.getItem("token");


if (!token) {
    window.location.href = "login.html";
}


// Get job ID

const params = new URLSearchParams(
    window.location.search
);

const jobId = params.get("jobId");


if (!jobId) {

    document.getElementById(
        "applicantsList"
    ).innerHTML =
        "<p>Invalid job.</p>";

} else {

    fetchApplicants();
}


// Fetch applicants

async function fetchApplicants() {

    try {

        const response = await fetch(
            `${API_URL}/jobs/${jobId}/applicants`,
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
                "applicantsList"
            ).innerHTML =
                `<p>${data.message}</p>`;

            return;
        }


        displayApplicants(data.applicants);


    } catch (error) {

        console.error(error);

        document.getElementById(
            "applicantsList"
        ).innerHTML =
            "<p>Unable to load applicants.</p>";
    }
}


// Display applicants

function displayApplicants(applicants) {

    const container =
        document.getElementById(
            "applicantsList"
        );


    if (applicants.length === 0) {

        container.innerHTML =
            "<p>No applicants yet.</p>";

        return;
    }


    container.innerHTML = "";


    applicants.forEach((applicant) => {

        const card =
            document.createElement("div");

        card.classList.add(
            "application-card"
        );


        card.innerHTML = `

            <h2>
                ${applicant.student_name}
            </h2>

            <p>
                <strong>Email:</strong>
                ${applicant.student_email}
            </p>

            <p>
                <strong>Applied:</strong>
                ${new Date(
                    applicant.applied_at
                ).toLocaleString()}
            </p>

            <p>
                <strong>Current Status:</strong>
                ${applicant.status}
            </p>

            <select
                id="status-${applicant.application_id}"
            >

                <option value="applied">
                    Applied
                </option>

                <option value="shortlisted">
                    Shortlisted
                </option>

                <option value="interview">
                    Interview
                </option>

                <option value="selected">
                    Selected
                </option>

                <option value="rejected">
                    Rejected
                </option>

            </select>


            <button
                onclick="
                    updateStatus(
                        ${applicant.application_id}
                    )
                "
            >
                Update Status
            </button>

        `;


        container.appendChild(card);


        // Set current status

        document.getElementById(
            `status-${applicant.application_id}`
        ).value = applicant.status;

    });
}


// Update application status

async function updateStatus(applicationId) {

    const select =
        document.getElementById(
            `status-${applicationId}`
        );


    const status = select.value;


    try {

        const response = await fetch(
            `${API_URL}/applications/${applicationId}/status`,
            {
                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    status
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            alert(data.message);

            return;
        }


        alert(
            "Application status updated successfully."
        );


        fetchApplicants();


    } catch (error) {

        console.error(error);

        alert(
            "Unable to update application status."
        );
    }
}


// Dashboard

document
    .getElementById("backBtn")
    .addEventListener("click", () => {

        window.location.href =
            "recruiter-dashboard.html";

    });


// Logout

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.removeItem("token");

        window.location.href =
            "login.html";

    });