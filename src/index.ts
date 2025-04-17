import { client, connectionDb } from "./connectionDB";
import express = require("express");
import { userEndPonit } from "./user";
import { ObjectId } from "mongodb"
export { express };
export const app: any = express();

const cors = require("cors");
let PORT: string | undefined = process.env.PORT;
if (PORT == undefined) PORT = "8080";
app.use(cors());
app.use(express.json());

connectionDb();
userEndPonit();

app.get("/get/namePizze", async (req: express.Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("typePizze");
    const products = await collection.find({}).toArray();

    res.status(200).json(products);
    // console.log("La GET funziona!");
});

app.get("/get/pizza/:id", async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const db = client.db("mall");
    const collection = db.collection("typePizze");
    const pizza = await collection.findOne({ _id: new ObjectId(id) });

    if (pizza) {
        res.status(200).json(pizza);
    } else {
        res.status(404).json({ message: "Pizza non trovata" });
    }
})



//order

app.get("/get/orders", async (req: express.Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("order");
    const orders = await collection.find({}).toArray();

    res.status(200).send(orders);
})





app.get("/get/order/:idUser", async (req: express.Request, res: express.Response) => {
    try {
        const idUser = req.params.idUser;
        const db = client.db("mall");
        const collection = db.collection("order");

        console.log("ID utente:", idUser);
        console.log("ID utente:", new ObjectId(idUser));

        const order = await collection.find({ userId: idUser }).toArray();

        console.log(order);
        if (order) {
            res.status(200).json(order);
        } else res.status(404).json({ message: false });
    } catch (err) {
        console.error("Errore durante il recupero della order:", err);
        res.status(500).send({ message: "Errore del server" });
    }
});

app.put("/put/order/:idorder", async (req: express.Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("order");
    const idOrder = req.params.idorder;
    const body = req.body;
    console.log("ID ordine:", idOrder);
    console.log("body quantita", body.quantita);
    try {
        const result = await collection.updateOne(
            { _id: new ObjectId(idOrder) },
            {
                $addToSet: {
                    idPizze: { $each: body.idPizze },
                    quantita: { $each: body.quantita }
                }
            }
        );
        console.log("Risultato dell'aggiornamento:", result);
        res.status(200).send({ message: "Ordine aggiornato con successo" });
    } catch (err) {
        console.error("Errore durante l'aggiornamento dell'ordine:", err);
        res.status(500).send({ message: "Errore del server" });
    }
})

app.post("/post/order", async (req: express.Request, res: express.Response) => {
    const db = client.db("mall");
    const collection = db.collection("order");
    const body = req.body;
    console.log("body", body);
    try {
        collection.insertOne(body);
        res.status(200).send({ "succes": "operazione effetuata con sucesso" })
    } catch (err) { res.status(404).send({ "error": err }) }

})






// Avvio del server

app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});


