const express = require('express');
const RoleRoutes = require('./src/routes/RoleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

//initialisation des routes
app.use('/role', RoleRoutes);

//initialisation de la racine /
app.get('/', (req, res) => {
  res.send("hello world"); 
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
