import express from "express";

import cors from "cors";
import bodyParser from "body-parser";

import { LowSync, JSONFileSync } from "lowdb";

const adapter = new JSONFileSync("file.json");
const db = new LowSync(adapter);
db.read();
db.data ||= { users: [] };

const app = express();
const port = 3000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/createUser", (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const email = req.body.email;
  const photoUrl = req.body.photoUrl;
  const role = req.body.role;
  console.log(id, name, email, photoUrl, role);
  db.data.users.push({
    id: id,
    name: name,
    email: email,
    photoUrl: photoUrl,
    role: role,
  });
  db.write();
  res.status(200).send("User created successfully");
});

app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;
  let record = db.data.users.find((p) => p.id == id);
  if (!record) {
    console.log("No data found!");
  } else {
    console.log("== Record found ==");
    console.log(record);
    res.status(200).send(record);
  }
});

app.listen(port, () =>
  console.log(`Sever up and running at http://localhost:${port}`)
);
