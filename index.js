const express = require("express");
const app = express();
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const blogRoutes = require('./routes/Blog');

const databasee = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;

// databasee connection
databasee.connect();
// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        // origin: ["http://localhost:5173", "https://learnify-01-gourab-bistus-projects.vercel.app"],
        origin:"*",
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    }
));
app.use(express.static("public"))

// routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use('/api/v1/blogs', blogRoutes);
// defalut route
app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));