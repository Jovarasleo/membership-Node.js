import express, { request } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import joi from "joi";
import shortuuid from "short-uuid";
dotenv.config();

const connect = process.env.MONGO_CONNECTION_STRING;
const mongoClient = new MongoClient(connect);
const port = process.env.port;

const app = express();
app.use(express.json());
app.use(cors());

const userValidation = joi.object({
  id: joi.required(),
  name: joi.string().max(50).required(),
  surname: joi.string().max(50).required(),
  email: joi.string().trim().email().required(),
  service_id: joi.required(),
  ip: joi.optional(),
});
const serviceValidation = joi.object({
  id: joi.required(),
  name: joi.string().max(20).required(),
  price: joi.number().required(),
  description: joi.string().max(1000).required(),
});
//GET get memberships
app.get("/memberships", async (req, res) => {
  const connection = await mongoClient.connect();
  const data = await connection
    .db("membershipdb")
    .collection("services")
    .find({})
    .toArray();
  res.send(data);
});
//POST create membership
app.post("/memberships", async (req, res) => {
  const connection = await mongoClient.connect();
  const id = shortuuid.generate();

  const { name, price, description } = req.body;
  const service = {
    id,
    name,
    price,
    description,
  };
  const doesExist = await connection
    .db("membershipdb")
    .collection("services")
    .find({ name: service.name })
    .toArray();
  const isvalid = serviceValidation.validate(service);
  if (isvalid.error) {
    return res.status(400).send(isvalid.error.details[0]?.message);
  }
  if (doesExist.length) {
    return res.status(400).send({ error: "service already exist" });
  } else {
    await connection
      .db("membershipdb")
      .collection("services")
      .insertOne(service);
    res.send({ success: true });
  }
  await connection.close();
});
//DELETE delete membership
app.delete("/memberships/:id", async (req, res) => {
  const id = req.params.id;
  const connection = await mongoClient.connect();
  const data = await connection
    .db("membershipdb")
    .collection("services")
    .findOneAndDelete({ id: id });
  res.send(data);
});
//GET get users/:order
app.get("/users", async (req, res) => {
  const connection = await mongoClient.connect();
  let order = 1;
  if (req.query.order) {
    order = req.query.order === "ASC" ? 1 : -1;
  }
  const findService = await connection
    .db("membershipdb")
    .collection("users")
    .aggregate([
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "id",
          as: "service",
        },
      },
    ])
    .sort({ name: order })
    .toArray();
  const cleanUser = findService.map((user) => {
    return {
      name: user.name,
      surname: user.surname,
      email: user.email,
      service: user.service[0]?.name,
      ip: user.ip,
    };
  });
  res.send(cleanUser);
});
//POST create user
app.post("/users", async (req, res) => {
  const connection = await mongoClient.connect();

  const id = shortuuid.generate();
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const { name, surname, email, service_id } = req.body;
  const newUser = {
    id,
    name,
    surname,
    email,
    service_id,
    ip,
  };
  const doesServiceExist = await connection
    .db("membershipdb")
    .collection("services")
    .find({ id: service_id })
    .toArray();
  const isvalid = userValidation.validate(newUser);
  if (isvalid.error) {
    res.status(400).send(isvalid.error.details[0]?.message);
  } else if (doesServiceExist.length == 0) {
    res.status(400).send({ error: "service doesn't exist" });
  } else {
    await connection.db("membershipdb").collection("users").insertOne(newUser);
    res.send({ success: true });
  }
  await connection.close();
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
