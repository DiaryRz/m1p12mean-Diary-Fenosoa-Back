const express = require("express");
const cors = require("cors");
const RoleRoutes = require("./src/routes/RoleRoutes");
const UserRoutes = require("./src/routes/UserRoute");
const authRoutes = require("./src/routes/AuthRoute");
const carCategoryRoutes = require("./src/routes/CarCategoryRoutes");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 3000;

console.log(process.env.CORS_ACCEPT);
console.log(process.env.MONGODB_URI);

app.use(express.json());

var corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  exposedHeaders: ["Authorization"],
};
app.use(cors({ origin: process.env.CORS_ACCEPT }));

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
