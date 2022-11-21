import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Joi from "joi";
dotenv.config();

import usersRouters from "./routes/users.routes.js";
import walletRoutes from "./routes/wallet.routes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(usersRouters);
app.use(walletRoutes);

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

app.listen(5000, () => console.log("Running in Port 5000"));