const express = require("express");
const cors = require("cors");
const RoleRoutes = require("./src/routes/RoleRoutes");
const UserRoutes = require("./src/routes/UserRoute");
const authRoutes = require("./src/routes/AuthRoute");
const carCategoryRoutes = require("./src/routes/CarCategoryRoutes");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
const env = process.env.NODE_ENV;
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:4200", // Add this if you test locally
];
console.log(process.env.CORS_ORIGIN);
console.log(process.env.MONGODB_URI);

app.use(express.json());

var corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl requests)
    if (!origin) return callback(null, true);

    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

//initialisation des routes
app.use("/role", RoleRoutes);
app.use("/auth", authRoutes);
app.use("/users", UserRoutes);
app.use("/car_category", carCategoryRoutes);

//initialisation de la racine /
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
