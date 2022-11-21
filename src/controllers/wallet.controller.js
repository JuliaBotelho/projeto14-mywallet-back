import { usersCollection, sessionsCollection, valueSchema, walletCollection } from "../index.js";

export async function postAmmount(req, res) {
    const body = req.body;
    const { authorization } = req.headers;

    const { error } = valueSchema.validate(body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Sua sessão expirou");
    }

    try {
        const session = await sessionsCollection.findOne({ token });
        const user = await usersCollection.findOne({ _id: session.userId });

        console.log(user);

        await walletCollection.insertOne({
            email: user.email,
            description: body.description,
            ammount: body.ammount,
            type: body.type
        });
        res.sendStatus(201);
    } catch (err) {
        res.sendStatus(500);
    }
}

export async function getAmmounts(req,res){
    const { authorization } = req.headers;

    const token = authorization?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).send("Sua sessão expirou");
    }

    try{
        const session = await sessionsCollection.findOne({ token });
        const user = await usersCollection.findOne({ _id: session.userId });

        const ammounts = await walletCollection.find({email:user.email}).toArray();
        res.send(ammounts);
    }catch (err){
        res.sendStatus(500);
    }
}