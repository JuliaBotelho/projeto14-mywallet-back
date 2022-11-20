import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Joi from "joi";
import { MongoClient } from "mongodb";
import { signUp, signIn } from "./controllers/users.controller.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.required(),
    confirmpassword: Joi.required(),
})

export const valueSchema = Joi.object({
    description : Joi.string().required(),
    ammount: Joi.number().precision(2),
    type: Joi.string().required().valid("minus" , "plus")
}) 

const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
    await mongoClient.connect();
    console.log("MongoDB connection success");
} catch (err) {
    console.log(err);
}

const db = mongoClient.db("mywallet");
export const usersCollection = db.collection("users");
export const sessionsCollection = db.collection("sessions");
export const walletCollection = db.collection("wallet"); 


app.post("/sign-up", signUp);
app.post("/sign-in", signIn);
/* app.post("/mywallet", postAmmount);
app.get("/mywallet", getAmmounts); */


app.listen(5000, () => console.log("Running in Port 5000"));