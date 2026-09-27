require("dotenv").config();
const cors = require("cors");
const db = require("./config/db");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);
app.use("/", jobRoutes);
app.use("/", applicationRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});