const express = require("express");
const cors = require("cors");
const RoleRoutes = require("./src/routes/RoleRoutes");
const UserRoutes = require("./src/routes/UserRoute");
const authRoutes = require("./src/routes/AuthRoute");
const carCategoryRoutes = require("./src/routes/CarCategoryRoutes");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:4200" // Optionnel pour le local
];

var corsOptions = {
  origin: allowedOrigins ,
  credentials: true,
  exposedHeaders: ['Authorization']
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
