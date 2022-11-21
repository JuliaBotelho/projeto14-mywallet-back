import { userSchema } from "../index.js";
import { usersCollection, sessionsCollection } from "../database/db.js";

import bcrypt from "bcrypt";
import { v4 as uuidV4 } from "uuid";

export async function signUp(req, res) {
    const body = req.body;

    const { error } = userSchema.validate(body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    if (body.password !== body.confirmpassword) {
        return res.status(422).send("Por favor preencha novamente os campos de senhas.");
    }

    const hashPassword = bcrypt.hashSync(body.password, 10);

    try {
        await usersCollection.insertOne({
            name: body.name,
            email: body.email,
            password: hashPassword
        });
        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
    }
}

export async function signIn(req, res) {
    const { email, password } = req.body;
    const token = uuidV4();

    try {
        const userExists = await usersCollection.findOne({ email });
        if (!userExists) {
            return res.status(401).send("Email não encontrado no cadastro.");
        }

        const passwordCheck = bcrypt.compareSync(password, userExists.password);
        if (!passwordCheck) {
            return res.status(401).send("A senha está incorreta.");
        }

        await sessionsCollection.insertOne({ token, userId: userExists._id });

        console.log(userExists.name)

        res.send({ token:token, name: userExists.name});
    } catch (err) {
        res.sendStatus(500);
    }
}