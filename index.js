const express = require("express");
const cookieParser = require("cookie-parser");

const RoleRoutes = require("./src/routes/RoleRoutes");
const AuthRoutes = require("./src/routes/AuthRoutes.js");
const UserRoutes = require("./src/routes/UserRoutes.js");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

//initialisation des routes
app.use("/role", RoleRoutes);
app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);

//initialisation de la racine /
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
