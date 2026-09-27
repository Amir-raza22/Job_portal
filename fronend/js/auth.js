const API_URL = "http://localhost:5000";

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const name = document.getElementById("name").value;

        const email = document.getElementById("email").value;

        const password = document.getElementById("password").value;

        const role = document.getElementById("role").value;


        try {

            const response = await fetch(
                `${API_URL}/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        role
                    })
                }
            );


            const data = await response.json();


            const message =
                document.getElementById("message");


            if (!response.ok) {

                message.textContent = data.message;

                return;
            }


            message.textContent =
                "Registration successful!";

            registerForm.reset();

        } catch (error) {

            console.error(error);

            document.getElementById("message").textContent =
                "Unable to connect to server.";

        }

    });

}
const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;


        try {

            const response = await fetch(
                `${API_URL}/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data = await response.json();


            const message =
                document.getElementById("message");


            if (!response.ok) {

                message.textContent = data.message;

                return;
            }


            // Store JWT
            localStorage.setItem(
                "token",
                data.token
            );


            message.textContent =
                "Login successful!";


            // Go to jobs page
            setTimeout(async () => {

                try {
                
                    const profileResponse =
                        await fetch(`${API_URL}/profile`, {
                            headers: {
                                Authorization: `Bearer ${data.token}`
                            }
                        });
                    
                    
                    const profileData =
                        await profileResponse.json();
                    
                    
                    if (
                        profileResponse.ok &&
                        profileData.user.role === "recruiter"
                    ) {
                    
                        window.location.href =
                            "recruiter-dashboard.html";
                    
                    } else {
                    
                        window.location.href =
                            "dashboard.html";
                    
                    }
                
                } catch (error) {
                
                    console.error(error);
                
                    window.location.href =
                        "job.html";
                }

            }, 500);


        } catch (error) {

            console.error(error);

            document.getElementById("message").textContent =
                "Unable to connect to server.";

        }

    });

}