import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
const app = express();
app.use(cors({ origin: "*" }));
const PORT = 4000;
const MONGO_URL =
  "mongodb+srv://rubynathan:ruby999@cluster0.abcwmtd.mongodb.net";

const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏 🎊✨🤩");
});

app.get("/products", async function (request, response) {
  const products = await client
    .db("karmadev")
    .collection("products")
    .find({})
    .toArray();
  response.send(products);
  console.log(products);
});
app.get("/product/:id", async function (request, response) {
  const { id } = request.params;
  const result = await client
    .db("karmadev")
    .collection("products")
    .findOne({ _id: new ObjectId(id) });
  response.send(result);
});
app.post("/add", express.json(), async function (request, response) {
  const data = request.body;
  const result = await client
    .db("karmadev")
    .collection("products")
    .insertMany(data);
  response.send(result);
  console.log(result);
});

//SIGNUP
app.post("/signup", express.json(), async function (request, response) {
  const { name, email, password } = request.body;
  const UserFromDb = await client
    .db("karmadev")
    .collection("signup")
    .findOne({ email: email });
  if (UserFromDb) {
    response.status(400).send({ message: "user already exists" });
  } else if (password.length < 8) {
    response
      .status(400)
      .send({ message: "password must be atleast 8 charecters" });
  } else {
    const result = await client.db("karmadev").collection("signup").insertOne({
      name: name,
      email: email,
      password: password,
    });

    response.send(result);

    console.log(result);
  }
});

//LOGIN
app.post("/", express.json(), async function (request, response) {
  try {
    const { email, password } = request.body;
    const UserFromDb = await client
      .db("karmadev")
      .collection("signup")
      .findOne({ email: email });
    const UserFromDb1 = await client
      .db("karmadev")
      .collection("signup")
      .findOne({ password: password });

    if (!UserFromDb) {
      response.status(401).json({ message: "invalid mail credentials" });
    } else if (!UserFromDb1) {
      response.status(401).json({ message: "invalid password credentials" });
    } else {
      response.json({ message: "login successful" });
    }
  } catch (err) {
    response.json({
      message: err.message,
    });
  }
});

app.put("/product/:id", express.json(), async function (request, response) {
  const { id } = request.params;
  const data = request.body;
  const result = await client
    .db("karmadev")
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  response.send(result);
});
app.delete("/product/:id", async function (request, response) {
  const { id } = request.params;
  const result = await client
    .db("karmadev")
    .collection("products")
    .deleteOne({ _id: new ObjectId(id) });
  response.send(result);
});

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
