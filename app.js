const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const { Client } = require("pg");
const puerto = 3001;
app.use(express.json());
require("dotenv").config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
app.listen(puerto, () => {
  console.log("Servidor listo ");
  client.connect();
});
app.post("/postUser", (req, res) => {
  const { name_user, password_user, email_user } = req.body;
  console.log(req.body);
  client
    .query(
      "INSERT INTO users (name_user, password_user, email_user) VALUES ($1, crypt($2, gen_salt('bf')), $3) RETURNING *",
      [name_user, password_user, email_user]
    )
    .then((result) => {
      console.log("Usuario insertado:", result.rows[0]);
      res.status(201).json(result.rows[0]);
    })
    .catch((err) => {
      console.error("Error al insertar usuario:", err);
      res.status(500).send("Error al insertar usuario");
    });
});


app.post("/getUserById", (req, res) => {
  const { name_user, password_user } = req.body;
  console.log(req.body);
  client
    .query(
      "SELECT * FROM users WHERE name_user = $1 AND password_user = crypt($2, password_user)",
      [name_user, password_user]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(401).json({ error: "Credenciales incorrectas" });
      } else {
        console.log("Usuario encontrado:", result.rows[0]);
        res.status(200).json(result.rows[0]);
      }
    })
    .catch((err) => {
      console.error("Error al encontrar usuario:", err);
      res.status(500).send("Error al encontrar usuario");
    });
});


