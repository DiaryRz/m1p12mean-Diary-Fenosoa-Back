const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AppointmentRoutes = require("./src/routes/AppointmentRoutes.js");
const ServiceRoutes = require("./src/routes/ServiceRoutes");
const RoleRoutes = require("./src/routes/RoleRoutes");
const UserRoutes = require("./src/routes/UserRoute");
const AuthRoutes = require("./src/routes/AuthRoute");
const CarCategoryRoutes = require("./src/routes/CarCategoryRoutes");
const CarRoutes = require("./src/routes/CarRoutes");
const ConfigRoutes = require("./src/routes/configRoutes");

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
app.use("/auth", AuthRoutes);
app.use("/users", UserRoutes);
app.use("/services", ServiceRoutes);
app.use("/car_category", CarCategoryRoutes);
app.use("/car", CarRoutes);
app.use("/service", ServiceRoutes);
app.use("/appointment", AppointmentRoutes);
app.use("/config", ConfigRoutes);

//initialisation de la racine /
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
