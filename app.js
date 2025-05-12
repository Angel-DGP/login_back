const express = require("express");
const app = express();
const puerto = 3001;
const ip = "172.16.0.26";
const cors = require('cors');
app.use(cors());
const { Client } = require("pg");
app.use(express.json());

const client = new Client({
  user: "postgres",
  host: ip,
  database: "data_login",
  password: "admin",
  port: 5432,
});
app.listen(puerto, () => {
  console.log("Servidor listo en puerto " + puerto);
    client.connect(); 
  
});
app.get("/users", (request, response) => {
  client
    .query("select * from users")
    .then((responseQuery) => {
      console.log(responseQuery.rows);
      response.send(responseQuery.rows);
    })
    .catch((err) => {
      console.log(err);

    });
});

app.post("/postUser", (req, res) => {
  const { name_user, password_user, email_user } = req.body;
  console.log(req.body)
  client
    .query(
      "INSERT INTO users (name_user, password_user, email_user) VALUES ($1, $2, $3) RETURNING *",
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
