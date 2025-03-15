const express = require("express");
const RoleRoutes = require("./src/routes/RoleRoutes");
const UserRoutes = require("./src/routes/UserRoute");
const authRoutes = require("./src/routes/AuthRoute");
const carCategoryRoutes = require("./src/routes/CarCategoryRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");

app.use(express.json());
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
